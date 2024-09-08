import { Request, Response, RequestHandler } from "express";
import User from "../models/user";
import { log } from "console";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

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
    return res.status(200).send({ message: "User registered successfully" });
  } catch (error) {
    log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

export const Login: RequestHandler = async (req: Request, res: Response) => {
  //!express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    //!user check
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    //!password compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //!JTW TOKEN
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
      maxAge: 86400000,
    });
    res.status(200).json({ user });
  } catch (error) {
    log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
};

export const Logout: RequestHandler = async (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
};

export const ValidateToken: RequestHandler = (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
};

//!Fetch Logged In User
export const GetCurrent: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password"); //kullaniciyi şifreyi getirmeden fetch eder
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user!" });
  }
};
