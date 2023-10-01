const Room = require("../models/roomModel");
const asyncHandler = require("express-async-handler");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
const uniqid = require("uniqid");
const Booking = require("../models/bookingModel");

const createRoom = asyncHandler(async (req, res) => {
  const newRoom = await Room.create(req.body);

  res.json(newRoom);
});

const getAllRoom = asyncHandler(async (req, res) => {
  const rooms = await Room.find();

  res.json(rooms);
});

const getSpecificRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const rooms = await Room.findById({ _id: id });

  res.json(rooms);
});

const addRoomDetails = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const roomDetails = await Room.findByIdAndUpdate(
    id,
    {
      $push: {
        roomDetails: {
          id: uniqid(),
          name: name,
        },
      },
    },
    { new: true }
  );

  res.json(roomDetails);
});

const addBathroom = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const roomDetails = await Room.findByIdAndUpdate(
    id,
    {
      $push: {
        inBathroom: {
          id: uniqid(),
          name: name,
        },
      },
    },
    { new: true }
  );

  res.json(roomDetails);
});

const addView = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const { id } = req.params;

  const roomDetails = await Room.findByIdAndUpdate(
    id,
    {
      $push: {
        view: {
          id: uniqid(),
          name: data,
        },
      },
    },
    { new: true }
  );

  res.json(roomDetails);
});

const changeRoomSize = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const roomDetails = await Room.findByIdAndUpdate(
    id,
    {
      roomSize: name,
    },
    { new: true }
  );

  res.json(roomDetails);
});

const updateRoomPrice = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const roomDetails = await Room.findByIdAndUpdate(
    id,
    {
      roomPrice: name,
    },
    { new: true }
  );

  res.json(roomDetails);
});
const changeDescription = asyncHandler(async (req, res) => {
  const { data } = req.body;
  const { id } = req.params;

  const roomDetails = await Room.findByIdAndUpdate(
    id,
    {
      description: data,
    },
    { new: true }
  );

  res.json(roomDetails);
});

const addFacilities = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const roomDetails = await Room.findByIdAndUpdate(
    id,
    {
      $push: {
        facilities: {
          id: uniqid(),
          name: name,
        },
      },
    },
    { new: true }
  );

  res.json(roomDetails);
});

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { photos } = req.body;

  const room = await Room.findById(id);

  const alreadyAdded = room?.images.find((aw) => aw.url === photos);

  if (alreadyAdded === undefined) {
    const findRoom = await Room.findByIdAndUpdate(
      id,
      {
        $push: {
          images: {
            url: photos,
          },
        },
      },
      { new: true }
    );
    res.json(findRoom);
  } else {
    res.status(401).json({ message: "Image is already added!" });
  }
});

// const uploadImages = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   try {
//     const uploader = (path) => cloudinaryUploadImg(path, "images");
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newpath = await uploader(path);
//       urls.push(newpath);
//       fs.unlinkSync(path);
//     }

//     const findRoom = await Room.findByIdAndUpdate(
//       id,
//       {
//         images: urls.map((file) => {
//           return file;
//         }),
//       },
//       { new: true }
//     );

//     res.json(findRoom);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const addBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create(req.body);

  const bookingDetails = await Booking.find({ _id: booking._id });
  res.json(bookingDetails);
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookingDetails = await Booking.find();
  res.json(bookingDetails);
});

const getSpecificBooking = asyncHandler(async (req, res) => {
  const bookingDetails = await Booking.findOne({
    bookingRef: req.body.bookingRef,
  });

  if (!bookingDetails) {
    res.status(404).send({
      message: "Cannot find booking details with this booking reference",
    });
  } else {
    res.json(bookingDetails);
  }
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const bookingDetails = await Booking.findByIdAndUpdate(
    id,
    {
      bookingStatus: "Cancelled",
    },
    { new: true }
  );

  if (!bookingDetails) {
    res.status(404).send({
      message: "Cannot find booking details with this booking reference",
    });
  } else {
    res.json(bookingDetails);
  }
});

// DELETE

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;

  const room = await Room.findByIdAndUpdate(
    id,
    {
      $pull: {
        images: {
          url: url,
        },
      },
    },
    { new: true }
  );

  if (room) {
    res.status(200).json({ message: "Image has been deleted" });
  }

  // if (alreadyAdded === undefined) {
  //   const findRoom = await Room.findByIdAndUpdate(
  //     id,
  //     {
  //       $push: {
  //         images: {
  //           url: photos,
  //         },
  //       },
  //     },
  //     { new: true }
  //   );
  //   res.json(findRoom);
  // } else {
  //   res.status(401).json({ message: "Image is already added!" });
  // }
});

const deleteOverview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const room = await Room.findByIdAndUpdate(
    id,
    {
      $pull: {
        roomDetails: {
          name: name,
        },
      },
    },
    { new: true }
  );

  if (room) {
    res.status(200).json({ message: "Overview has been deleted" });
  }
});

const deleteView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const room = await Room.findByIdAndUpdate(
    id,
    {
      $pull: {
        view: {
          name: name,
        },
      },
    },
    { new: true }
  );

  if (room) {
    res.status(200).json({ message: "View has been deleted" });
  }
});

const deleteBathroom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const room = await Room.findByIdAndUpdate(
    id,
    {
      $pull: {
        inBathroom: {
          name: name,
        },
      },
    },
    { new: true }
  );

  if (room) {
    res.status(200).json({ message: "Bathroom has been deleted" });
  }
});

const deleteFacilities = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const room = await Room.findByIdAndUpdate(
    id,
    {
      $pull: {
        facilities: {
          name: name,
        },
      },
    },
    { new: true }
  );

  if (room) {
    res.status(200).json({ message: "Facilities has been deleted" });
  }
});

const roomAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  const room = await Room.findByIdAndUpdate(
    id,
    {
      isAvailable: availability,
    },
    { new: true }
  );

  if (room) {
    res.status(200).json({ message: "Availability has been updated" });
  }
});

module.exports = {
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
};
