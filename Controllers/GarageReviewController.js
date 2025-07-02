const Review = require('../models/GarageReview');

exports.createGarageReview = async (req, res) => {
  try {
    const { garageId, service, rating, name, message } = req.body;

    // Optional: validate rating is in range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: false,
        message: "Rating must be between 1 and 5."
      });
    }

    const review = new Review({
      garageId,
      service,
      rating,
      name,
      message
    });

    await review.save();

    return res.status(201).json({
      status: true,
      message: "Review created successfully",
      data: review
    });

  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create review",
      error: error.message
    });
  }
};
