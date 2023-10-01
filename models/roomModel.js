const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [],
    roomDetails: [],
    roomSize: {
      type: Number,
    },
    inBathroom: [],
    view: [],
    facilities: [],
    smoking: {
      type: Boolean,
    },
    roomPrice: {
      type: Number,
    },
    isAvailable: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Room", roomSchema);
