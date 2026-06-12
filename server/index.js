import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Helper to read JSON file
const readData = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Helper to write JSON file
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Meshach Olajide Photography API is online' });
});

// Bookings endpoint
app.post('/api/booking', (req, res) => {
  const booking = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };

  const bookings = readData(BOOKINGS_FILE);
  bookings.push(booking);
  writeData(BOOKINGS_FILE, bookings);

  console.log('New Booking Received:', booking);
  res.status(201).json({
    success: true,
    message: 'Booking request received successfully',
    booking
  });
});

// Messages endpoint
app.post('/api/contact', (req, res) => {
  const message = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };

  const messages = readData(MESSAGES_FILE);
  messages.push(message);
  writeData(MESSAGES_FILE, messages);

  console.log('New Message Received:', message);
  res.status(201).json({
    success: true,
    message: 'Message received successfully',
    message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
