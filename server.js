import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db.js';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/flights', async (req, res) => {
  try {
    const { origin, destination, outDate, returnDate, passengers, currency = 'TWD', type = '1' } = req.query;
    
    const API_KEY = process.env.SERPAPI_KEY;
    if (!API_KEY || API_KEY === 'YOUR_SERPAPI_KEY_HERE') {
      return res.status(401).json({ error: 'API_KEY_MISSING' });
    }

    // https://serpapi.com/google-flights-api
    const params = {
      engine: 'google_flights',
      departure_id: origin, // IATA code
      arrival_id: destination, // IATA code
      outbound_date: outDate, // YYYY-MM-DD
      currency: currency,
      hl: 'zh-tw',
      adults: passengers || 1,
      type: type, // 1 for round-trip, 2 for one-way
      api_key: API_KEY
    };

    if (returnDate && type === '1') {
      params.return_date = returnDate;
    }

    const response = await axios.get('https://serpapi.com/search', { params });
    res.json(response.data);

  } catch (error) {
    console.error('Error fetching from SerpApi:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch flight data.' });
  }
});

// In-memory array to simulate a database for price alerts
const subscriptions = [];

app.post('/api/subscribe', (req, res) => {
  const { email, origin, destination, targetPrice } = req.body;
  if (!email || !origin || !destination) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newSub = { id: Date.now(), email, origin, destination, targetPrice, createdAt: new Date() };
  subscriptions.push(newSub);
  
  console.log(`[Price Alert System] New subscription received:`);
  console.log(`Email: ${email} | Route: ${origin} -> ${destination} | Target Price: < ${targetPrice}`);
  
  res.status(200).json({ success: true, message: 'Subscription saved!', subId: newSub.id });
});

app.get('/api/account', async (req, res) => {
  try {
    const API_KEY = process.env.SERPAPI_KEY;
    if (!API_KEY || API_KEY === 'YOUR_SERPAPI_KEY_HERE') {
      return res.status(401).json({ error: 'API_KEY_MISSING' });
    }

    const response = await axios.get(`https://serpapi.com/account?api_key=${API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching account from SerpApi:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch account data.' });
  }
});

// ==========================================
// Phase 4: Auth & Database Endpoints
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET || 'nexus-flight-super-secret-key';

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    const info = stmt.run(username, hashedPassword);
    
    const token = jwt.sign({ id: info.lastInsertRowid, username }, JWT_SECRET);
    res.json({ success: true, token, username });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const stmt = db.prepare(''); user = await stmt.get(username);
    
    if (!user) return res.status(400).json({ error: 'User not found' });
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ success: true, token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// AviationStack Flight Status API (REAL DATA)
app.get('/api/flight-status/:flightNum', async (req, res) => {
  const flightNum = req.params.flightNum;
  const apiKey = process.env.AVIATION_STACK_API_KEY;
  
  if (!apiKey) {
    return res.status(400).json({ error: 'AVIATION_STACK_API_KEY is not configured in backend .env' });
  }
  
  const flightIata = flightNum.replace(/\s+/g, ''); // "BR 8" -> "BR8"

  try {
    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: apiKey,
        flight_iata: flightIata
      }
    });
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      res.json(response.data.data[0]);
    } else {
      res.status(404).json({ error: 'Flight not found in real-time tracking.' });
    }
  } catch (error) {
    console.error('AviationStack API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch flight status.' });
  }
});

// Sync Data (Save/Update)
app.post('/api/user/sync', authenticateToken, async (req, res) => {
  const { savedFlights, passengerProfile } = req.body;
  const userId = req.user.id;
  
  try {
    // We just overwrite for simplicity (store as JSON string)
    if (savedFlights) {
      await db.prepare('DELETE FROM saved_flights WHERE user_id = ?').run(userId);
      const stmt = db.prepare(''); stmt.run(userId, JSON.stringify(savedFlights));
    }
    
    if (passengerProfile) {
      await db.prepare('DELETE FROM passenger_profiles WHERE user_id = ?').run(userId);
      const stmt = db.prepare(''); stmt.run(userId, JSON.stringify(passengerProfile));
    }
    
    res.json({ success: true, message: 'Data synced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Get User Data
app.get('/api/user/info', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const flights = await db.prepare('SELECT flight_data FROM saved_flights WHERE user_id = ?').get(userId);
    const profile = await db.prepare('SELECT profile_data FROM passenger_profiles WHERE user_id = ?').get(userId);
    
    res.json({
      savedFlights: flights ? JSON.parse(flights.flight_data) : [],
      passengerProfile: profile ? JSON.parse(profile.profile_data) : []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// ==========================================
// Phase 4: Auto Email Alerts (Cron Job)
// ==========================================
let transporter;
(async () => {
  // Create a test account on Ethereal (Fake SMTP service)
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('[Email System] Ethereal test account ready.');
  } catch (error) {
    console.error('Failed to create Ethereal account:', error);
  }
})();

// Schedule a job to run every 5 minutes (for testing, every minute could be used, but we'll mock the trigger)
// Since we want the user to see it easily, let's expose an endpoint to MANUALLY trigger the cron logic for demonstration.
app.post('/api/trigger-alert', async (req, res) => {
  if (subscriptions.length === 0) {
    return res.json({ message: 'No subscriptions found to alert.' });
  }

  const sub = subscriptions[subscriptions.length - 1]; // Pick the latest subscription
  
  if (!transporter) {
    return res.status(500).json({ error: 'Email transporter not ready' });
  }

  // Generate a beautiful HTML email
  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 28px; letter-spacing: 2px;">Nexus Flight</h1>
        <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">您的降價雷達已觸發！</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #3b82f6; margin-top: 0;">🔥 票價破底啦！</h2>
        <p style="color: #cbd5e1; line-height: 1.6;">親愛的會員您好，您追蹤的航線 <strong>${sub.origin} ✈️ ${sub.destination}</strong> 剛剛出現了歷史新低價！</p>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
          <p style="margin: 0; color: #94a3b8; font-size: 14px;">當前最低票價</p>
          <div style="font-size: 36px; font-weight: bold; color: #10b981; margin: 10px 0;">TWD ${(sub.targetPrice * 0.9).toFixed(0)}</div>
          <p style="margin: 0; color: #fbbf24; font-size: 12px;">比您的目標價格還要便宜！</p>
        </div>

        <a href="#" style="display: block; width: 100%; text-align: center; background: #3b82f6; color: white; text-decoration: none; padding: 15px 0; border-radius: 8px; font-weight: bold; font-size: 16px;">立即前往搶票 ↗</a>
      </div>
      <div style="text-align: center; padding: 20px; background: #0b1120; color: #64748b; font-size: 12px;">
        這是一封由 Nexus Flight 系統自動發出的郵件，請勿直接回覆。
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Nexus Flight OTA" <alerts@nexusflight.com>',
      to: sub.email,
      subject: `🚨 降價通知！${sub.origin} 飛往 ${sub.destination} 票價破底！`,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('[Email System] Alert sent! Preview URL: %s', previewUrl);
    
    res.json({ 
      success: true, 
      message: 'Alert sent successfully',
      previewUrl: previewUrl
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Serve static frontend files (Monolithic Deployment)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve React's index.html for client-side routing
// Express 5 嚴格要求萬用字元必須有變數名稱，所以改用 app.use 作為最終兜底路由
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend proxy server running on http://localhost:${PORT}`);
});
