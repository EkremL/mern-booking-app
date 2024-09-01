import { Request, RequestHandler, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //?5MB FILE SIZE
  },
}); //!routede kullanmak için oraya export ile gönderdik

//!CREATE HOTEL CONTROLLER
export const CreateHotel: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    //?1. upload the images to cloudinary
    //!bütün imageler upload edilene kadar işlemi bekletir
    const imageUrls = await uploadImages(imageFiles); //!refactor yaptık ve kodun en sonuna eklemiş olduk çünkü aynı kodu update kısmında da kullanacağız ve kod daha temiz görünecek

    //?2. if upload was successful, add the URLS to the new hotel
    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;
    //?3. save the new hotel to the database
    const hotel = new Hotel(newHotel);
    await hotel.save();
    //?4. send a response with the new hotel (201)
    res.status(201).send(hotel);
  } catch (error) {
    console.log("Error creating hotel", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//! WIEW (GET) MY HOTEL CONTROLLER
export const GetMyHotels: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.status(200).json(hotels);
  } catch (error) {
    console.log("Error getting hotels", error);
    res.status(500).json({ message: "Error fetching hotels!" });
  }
};

//!FETCH HOTEL BY ID CONTROLLER
export const EditMyHotel: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.status(200).json(hotel);
  } catch (error) {
    console.log("Error getting hotels", error);
    res.status(500).json({ message: "Error editing hotel!" });
  }
};

//!UPDATE HOTEL CONTROLLER
export const UpdateMyHotel: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const updatedHotel: HotelType = req.body;
    updatedHotel.lastUpdated = new Date();

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId, userId: req.userId },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    const files = req.files as Express.Multer.File[];
    const updatedImageUrls = await uploadImages(files);

    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error updating!" });
  }
};
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  //!bütün imageler upload edilene kadar işlemi bekletir
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
