const express = require("express");

const User = require("../models/User");
const Availability = require("../models/Availability");
const authenticate = require("../middleware/auth");

const router = express.Router();


router.get("/", authenticate, async (req, res) => {
  try {

    
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only patients can view professionals"
      });
    }

  
    const availabilities = await Availability.find({
      available: true
    });

    const professionalIds = [
      ...new Set(
        availabilities.map((availability) =>
          availability.professionalId.toString()
        )
      )
    ];

    const professionals = await User.find({
      _id: { $in: professionalIds },
      role: "pro"
    })
      .select("-password")
      .sort({ score: -1 });

    res.json({
      professionals
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


module.exports = router;