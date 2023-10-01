const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var bookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
    },
    roomId: {
      type: String,
    },
    roomName: {
      type: String,
      required: true,
    },
    roomPrice: {
      type: String,
    },
    totalPrice: {
      type: String,
    },
    lengthOfStay: {
      type: String,
    },
    checkInDate: {
      type: String,
    },
    checkOutDate: {
      type: String,
    },
    adults: {
      type: String,
    },
    childrens: {
      type: String,
    },
    customerDetails: [
      {
        fullname: {
          type: String,
        },
        email: {
          type: String,
        },
        address: {
          type: String,
        },
        contactNumber: {
          type: String,
        },
      },
    ],
    cardDetails: [
      {
        cardNo: {
          type: String,
        },
        cardExpiry: {
          type: String,
        },
        cardCVV: {
          type: String,
        },
      },
    ],
    bookingStatus: {
      type: String,
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Booking", bookingSchema);
