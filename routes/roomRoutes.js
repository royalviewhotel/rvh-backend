const express = require("express");
const {
  createRoom,
  getAllRoom,
  uploadImages,
  addBathroom,
  addView,
  addFacilities,
  getSpecificRoom,
  addRoomDetails,
  changeRoomSize,
  changeDescription,
  updateRoomPrice,
  addBooking,
  getAllBookings,
  getSpecificBooking,
  cancelBooking,
  deleteImages,
  deleteOverview,
  deleteView,
  deleteBathroom,
  deleteFacilities,
  roomAvailability,
} = require("../controller/roomController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
const { uploadPhoto, roomImgResize } = require("../middlewares/uploadImages");

var cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://royal-view-hotel.vercel.app",
    "https://royal-view-hotel-admin.vercel.app",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

router.post("/", authMiddleware, cors(corsOptions), createRoom);
router.get("/", getAllRoom);
router.get("/all-bookings", getAllBookings);
router.get("/room-details/:id", getSpecificRoom);
router.put(
  "/upload/:id",
  // uploadPhoto.array("images", 10),
  // roomImgResize,
  uploadImages
);
router.put("/delete-image/:id", deleteImages);
router.put("/delete-overview/:id", deleteOverview);
router.put("/delete-view/:id", deleteView);
router.put("/delete-bathroom/:id", deleteBathroom);
router.put("/delete-facilities/:id", deleteFacilities);
router.put("/room-availability/:id", roomAvailability);
router.put("/bathroom/:id", addBathroom);
router.put("/room-size/:id", changeRoomSize);
router.put("/room-price/:id", updateRoomPrice);
router.put("/description/:id", changeDescription);
router.put("/view/:id", addView);
router.put("/facilities/:id", addFacilities);
router.put("/details/:id", addRoomDetails);

router.post("/booking", addBooking);
router.post("/booking-details", getSpecificBooking);
router.post("/cancel-booking", cancelBooking);

module.exports = router;
