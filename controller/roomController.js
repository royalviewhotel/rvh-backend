const Room = require("../models/roomModel");
const asyncHandler = require("express-async-handler");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");
const fs = require("fs");
const uniqid = require("uniqid");

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
  const { name } = req.body;
  const { id } = req.params;

  const roomDetails = await Room.findByIdAndUpdate(
    id,
    {
      $push: {
        view: {
          id: uniqid(),
          name: name,
        },
      },
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

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }

    const findRoom = await Room.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );

    res.json(findRoom);
  } catch (error) {
    throw new Error(error);
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
};
