import express, { Request, Response, RequestHandler } from "express";
import User from "../models/user";
import { log } from "console";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const Register: RequestHandler = async (req: Request, res: Response) => {
  //!express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    //!User email check
    if (user) return res.status(400).json({ message: "Email already exists" });

    //!sending user and save to database
    user = new User(req.body);
    await user.save();

    //!JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d", //? expires for 1 day
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000, //? YUKARDAKİ 1 GÜNÜN KARŞILIĞINI MİLİSANİYE CİNSİNDE YAZDIK
    });
    return res.sendStatus(200);
  } catch (error) {
    log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};
