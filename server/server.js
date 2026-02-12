import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/user.routes.js";
import ownerRouter from "./routes/owner.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import webhookRouter from "./routes/webhook.routes.js";

// Initialize Express App
const app = express();

// Connect Database
await connectDB();

// Middleware
app.use(cors());
app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRouter,
);
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
