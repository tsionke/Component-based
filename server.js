import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  loadUsersDB,
  loadPickupsDB,
  savePickupsDB,
  findUserByEmail,
  upsertUser,
  updateUser,
  getRequests,
  createRequest,
  loadNotificationsDB,
  createNotification,
  updateNotificationStatus,
  getUserNotifications,
  loadPaymentsDB,
  savePaymentsDB,
  createPayment,
  getPayments,
  getUserPayments,
} from "./db/index.js";

import { Server } from "socket.io";
import cron from "node-cron";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Backend: http://localhost:${PORT}`);
  console.log("📁 Users DB: users.db.json");
  console.log("📁 Pickup DB: pickups.db.json");
  console.log("✅ Ready - Pickup requests saved separately");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Weekly pickup schedule approval notifications - Every Sunday at 9AM
cron.schedule("0 9 * * 0", () => {
  console.log("📅 Weekly pickup schedule check...");
  const pickupsDb = loadPickupsDB();
  const notificationsDb = loadNotificationsDB();
  const usersDb = loadUsersDB();

  // Find pending/weekly recurring pickups from last week that need approval
  const pendingPickups = pickupsDb.requests.filter(r => 
    (!r.status || r.status === 'pending') && 
    r.recurring === 'weekly' && // Assume flag, or filter recent
    new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  pendingPickups.forEach(request => {
    const notification = createNotification({
      pickupId: request.id,
      userEmail: request.userEmail,
      kg: request.kg,
      price: request.kg * 3,
      type: 'schedule_approval',
    });

    io.emit('schedule-notification', {
      id: notification.id,
      pickupId: request.id,
      message: `Pickup Schedule Approval\nWeekly pickup request for tomorrow at 10:00 AM`,
      type: 'schedule_approval',
    });

    io.to(request.userEmail).emit('schedule-notification', notification);

    console.log(`📅 Weekly schedule notif #${notification.id} for ${request.userEmail}`);
  });
}, {
  scheduled: true,
  timezone: "Africa/Addis_Ababa",
});

io.on("connection", (socket) => {
  console.log("🔔 Client connected:", socket.id);

  socket.on("join-user", (userEmail) => {
    socket.join(userEmail);
    console.log(`👤 ${socket.id} joined room: ${userEmail}`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Dashboard - Safe access
app.get("/", (req, res) => {
  const usersDb = loadUsersDB();
  const pickupsDb = loadPickupsDB();
  const paymentsDb = loadPaymentsDB();
  res.json({
    message: "Smart Waste Backend - Pickup DB Separated ✅",
    usersDb: "backend/users.db.json",
    pickupsDb: "backend/pickups.db.json",
    paymentsDb: "backend/payments.db.json",
    users: usersDb.users,
    pickups: pickupsDb.requests || [],
    payments: paymentsDb.payments || [],
    stats: {
      users: usersDb.users.length,
      pickups: (pickupsDb.requests || []).length,
      payments: (paymentsDb.payments || []).length,
    },
  });
});

// AUTH Send OTP
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Name & email required" });

    const existing = findUserByEmail(email)?.isVerified;
    if (existing) return res.status(400).json({ error: "User exists" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const userData = {
      name,
      email,
      isVerified: false,
      otp,
      otp_expires: otpExpires,
    };
    upsertUser(userData);

    console.log(`🔥 OTP ${otp} → ${email}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AUTH Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const dbUsers = loadUsersDB().users;
    const user = dbUsers.find(
      (u) =>
        u.email === email &&
        u.otp === otp &&
        u.otp_expires > Date.now() &&
        !u.isVerified,
    );
    if (!user) return res.status(400).json({ error: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(password, 12);
    updateUser(email, {
      password: hashedPassword,
      otp: null,
      otp_expires: null,
      isVerified: true,
      role: "citizen",
    });

    console.log(`✅ Signup ${user.name}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AUTH Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const dbUsers = loadUsersDB().users;
    const user = dbUsers.find((u) => u.email === email && u.isVerified);
    if (!user) return res.status(400).json({ error: "User not verified" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Wrong password" });

    console.log(`✅ Login ${user.name}`);
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WASTE REQUESTS Create
app.post("/api/requests", async (req, res) => {
  try {
    const { kg, userEmail } = req.body;
    if (!kg) return res.status(400).json({ error: "kg required" });

    const price = kg * 3;
    const request = createRequest({ kg, userEmail });

    const notification = createNotification({
      pickupId: request.id,
      userEmail,
      kg,
      price,
    });

    io.emit("price-notification", {
      id: notification.id,
      pickupId: request.id,
      kg,
      price,
      message: `Pickup approved for ${kg}kg. Price: ${price} ETB`,
    });

    console.log(
      `🗑️ Request #${request.id} → Price: ${price} ETB → Notif #${notification.id}`,
    );
    res.json({ success: true, request, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/requests", (req, res) => {
  const { userEmail } = req.query;
  const allRequests = getRequests();
  const userRequests = userEmail
    ? allRequests.filter((r) => r.userEmail === userEmail)
    : allRequests;
  res.json({ success: true, requests: userRequests });
});

app.get("/api/notifications", (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) return res.status(400).json({ error: "userEmail required" });
  const notifications = getUserNotifications(userEmail);
  res.json({ success: true, notifications });
});

app.put("/api/notifications/:id/approve", (req, res) => {
  const { id } = req.params;
  const notification = updateNotificationStatus(parseInt(id), "approved");
  if (notification) {
    // Update pickup request status
    const pickupsDb = loadPickupsDB();
    const request = pickupsDb.requests.find(
      (r) => r.id === notification.pickupId,
    );
    if (request) {
      request.status = "approved";
      savePickupsDB(pickupsDb);
    }

    io.to(notification.userEmail).emit("notification-update", notification);
    io.emit("notification-update", notification);
    res.json({ success: true, notification });
  } else {
    res.status(404).json({ error: "Notification not found" });
  }
});

app.put("/api/notifications/:id/reject", (req, res) => {
  const { id } = req.params;
  const notification = updateNotificationStatus(parseInt(id), "rejected");
  if (notification) {
    // Update pickup request status
    const pickupsDb = loadPickupsDB();
    const request = pickupsDb.requests.find(
      (r) => r.id === notification.pickupId,
    );
    if (request) {
      request.status = "rejected";
      savePickupsDB(pickupsDb);
    }

    io.to(notification.userEmail).emit("notification-update", notification);
    io.emit("notification-update", notification);
    res.json({ success: true, notification });
  } else {
    res.status(404).json({ error: "Notification not found" });
  }
});

// ==================== TELEBIRR PAYMENTS ====================
// Create payment
app.post("/api/payments", async (req, res) => {
  try {
    const { phone, amount, userEmail } = req.body;
    if (!phone || !amount) {
      return res.status(400).json({ error: "Phone and amount required" });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4)}`;
    
    // Create payment record
    const payment = createPayment({
      phone,
      amount: parseFloat(amount),
      userEmail: userEmail || "",
      transactionId,
    });

    console.log(`💳 Payment #${payment.id} - ${amount} ETB via Telebirr (${phone})`);

    // Emit payment notification to frontend
    io.emit("payment-notification", {
      id: payment.id,
      amount,
      transactionId,
      message: `Payment of ${amount} ETB successful`,
    });

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all payments
app.get("/api/payments", (req, res) => {
  const { userEmail } = req.query;
  const allPayments = getPayments();
  const userPayments = userEmail
    ? allPayments.filter((p) => p.userEmail === userEmail)
    : allPayments;
  res.json({ success: true, payments: userPayments });
});

// Get payment stats
app.get("/api/payments/stats", (req, res) => {
  const { userEmail } = req.query;
  const payments = userEmail ? getUserPayments(userEmail) : getPayments();
  
  const totalPaid = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  
  res.json({
    success: true,
    stats: {
      totalPaid,
      totalTransactions: payments.length,
      completedTransactions: payments.filter(p => p.status === "completed").length,
    }
  });
});
