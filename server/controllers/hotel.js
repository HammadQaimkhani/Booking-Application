import Hotel from "../model/hotel";
import Order from "../model/order";
import fs from "fs";

export const create = async (req, res) => {
  try {
    let fields = req.fields;
    let files = req.files;

    let hotel = new Hotel(fields);
    hotel.postedBy = req.user._id;

    if (files.image) {
      hotel.image.data = fs.readFileSync(files.image.path);
      hotel.image.contentType = files.image.type;
    }
    try {
      const result = await hotel.save();
      res.json(result);
    } catch (err) {
      res.status(400).send("Error Saving");
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

export const hotels = async (req, res) => {
  // const all = await Hotel.find({ from: { $gte: new Date() } })
  const all = await Hotel.find()
    .limit(24)
    .select("-image.data")
    .populate("postedBy", "_id name")
    .exec();

  res.json(all);
};

export const image = async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId).exec();

  if (hotel && hotel.image && hotel.image.data !== null) {
    res.set("Content-Type", hotel.image.contentType);
    return res.send(hotel.image.data);
  }
};

export const sellerHotel = async (req, res) => {
  const all = await Hotel.find({ postedBy: req.user._id })
    .select("-image.data")
    .populate("postedBy", "_id name")
    .exec();

  res.send(all);
};

export const remove = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.hotelId).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.send("Server Err ===> ", err);
  }
};

export const read = async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId)
    .populate("postedBy", "_id name")
    .select("-image.data")
    .exec();

  res.json(hotel);
};

export const update = async (req, res) => {
  try {
    let fields = req.fields;
    let files = req.files;

    let data = { ...fields };

    if (files.image) {
      let image = {};
      image.data = fs.readFileSync(files.image.path);
      image.contentType = files.image.type;
      data.image = image;
    }
    let updated = await Hotel.findOneAndUpdate(req.params.hotelId, data, {
      new: true,
    }).select("-image.data");

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(401).send("Update Hotel is Failed Please Try Again");
  }
};

export const userHotelBookings = async (req, res) => {
  const all = await Order.find({ orderedBy: req.user._id })
    .select("session")
    .populate("hotel", "-image.data")
    .populate("orderedBy", "_id name")
    .exec();
  res.json(all);
};

export const isAlreadyBooked = async (req, res) => {
  const { hotelId } = req.params;
  // find orders of the currently logged in user
  const userOrder = await Order.find({ orderedBy: req.user._id })
    .select("hotel")
    .exec();

  // check if hotel id is found in userOrder array

  let ids = [];

  for (let i = 0; i < userOrder.length; i++) {
    ids.push(userOrder[i].hotel.toString());
  }

  res.json({ ok: ids.includes(hotelId) });
};
