import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API route for MailerLite subscription
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email je povinný' });
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      console.error('Missing MAILERLITE_API_KEY');
      return res.status(500).json({ error: 'Chyba konfigurace serveru' });
    }

    // MailerLite v3 API endpoint for subscribers
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        email: email,
        groups: [] // You can add specific group IDs here if needed
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite Error:', data);
      return res.status(response.status).json({ error: data.message || 'Nepodařilo se přihlásit k odběru' });
    }

    res.json({ success: true, message: 'Úspěšně přihlášeno k odběru' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Došlo k chybě při komunikaci se serverem' });
  }
});

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  // In production, serve the built static files
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, use Vite middleware
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR === 'true' ? false : { port: 24678 }
    },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
