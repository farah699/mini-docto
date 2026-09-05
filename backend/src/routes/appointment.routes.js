const express = require("express");

const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");
const User = require("../models/User");

const authenticate = require("../middleware/auth");

const router = express.Router();


router.post("/", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only patients can book appointments"
      });
    }

    const { availabilityId } = req.body;

    if (!availabilityId) {
      return res.status(400).json({
        message: "availabilityId is required"
      });
    }

    const availability = await Availability.findById(
      availabilityId
    );

    if (!availability) {
      return res.status(404).json({
        message: "Availability not found"
      });
    }

    if (!availability.available) {
      return res.status(409).json({
        message: "This slot is already booked"
      });
    }

    const professional = await User.findOne({
      _id: availability.professionalId,
      role: "pro"
    });

    if (!professional) {
      return res.status(404).json({
        message: "Professional not found"
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user.userId,
      professionalId: availability.professionalId,
      availabilityId: availability._id,
      date: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      status: "booked"
    });

    availability.available = false;
    await availability.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

router.get("/my", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only patients can view their appointments"
      });
    }

    const appointments = await Appointment.find({
      patientId: req.user.userId
    })
      .populate("professionalId", "name email score")
      .sort({ date: 1, startTime: 1 });

    res.json({
      appointments
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

router.patch("/:id/cancel", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only patients can cancel appointments"
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.user.userId
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        message: "Appointment already cancelled"
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    await Availability.findByIdAndUpdate(
      appointment.availabilityId,
      {
        available: true
      }
    );

    res.json({
      message: "Appointment cancelled successfully",
      appointment
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});
router.get("/pro", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "pro") {
      return res.status(403).json({
        message: "Only professionals can view their appointments"
      });
    }

    const appointments = await Appointment.find({
      professionalId: req.user.userId,
      status: "booked"
    })
      .populate("patientId", "name email")
      .sort({ date: 1, startTime: 1 });

    res.json({
      appointments
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});
module.exports = router;