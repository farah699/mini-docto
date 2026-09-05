const express = require("express");

const Availability = require("../models/Availability");
const authenticate = require("../middleware/auth");

const router = express.Router();




router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "pro") {
      return res.status(403).json({
        message: "Only professionals can create availability"
      });
    }

    const {
      date,
      startTime,
      endTime
    } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        message: "Date, startTime and endTime are required"
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "startTime must be before endTime"
      });
    }

    const availability = await Availability.create({
      professionalId: req.user.userId,
      date,
      startTime,
      endTime,
      available: true
    });

    res.status(201).json({
      message: "Availability created successfully",
      availability
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});
router.get(
  "/professional/:professionalId",
  authenticate,
  async (req, res) => {
    try {

      const availabilities = await Availability.find({
        professionalId: req.params.professionalId,
        available: true
      }).sort({
        date: 1,
        startTime: 1
      });

      res.json({
        availabilities
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Server error"
      });

    }
  }
);

router.delete("/:id", authenticate, async (req, res) => {
  try {

    if (req.user.role !== "pro") {
      return res.status(403).json({
        message: "Only professionals can delete availability"
      });
    }

    const availability = await Availability.findOne({
      _id: req.params.id,
      professionalId: req.user.userId
    });

    if (!availability) {
      return res.status(404).json({
        message: "Availability not found"
      });
    }

    if (!availability.available) {
      return res.status(400).json({
        message: "Booked availability cannot be deleted"
      });
    }

    await Availability.findByIdAndDelete(
      availability._id
    );

    res.json({
      message: "Availability deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


module.exports = router;