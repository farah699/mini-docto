require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const availabilityRoutes = require("./routes/availability.routes");
const professionalRoutes = require("./routes/professional.routes");
const appointmentRoutes = require("./routes/appointment.routes");


const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Mini Docto+ API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/professionals", professionalRoutes);

app.use("/api/appointments", appointmentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});