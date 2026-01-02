import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import psychologistRoutes from './routes/psychologistRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { handleStripeWebhook } from './webhooks/stripeWebhook.js';
import emailCalendarService from './services/emailCalendarService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/api/psychologists', psychologistRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payment', paymentRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
