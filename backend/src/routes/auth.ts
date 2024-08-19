import express from "express";
import { check } from "express-validator";
import * as UserController from "../controllers/users";

const router = express.Router();

//!registerden sonraki arrayda express-validator kullanmıs olduk, controllerde ise check işlemi yaptırmış olduk
router.post(
  "/register",
  [
    check("firstName", "First Name is required!").isString(),
    check("lastName", "Last Name is required!").isString(),
    check("email", "Email is required!").isEmail(),
    check("password", "Password with 6 or more characters required!").isLength({
      min: 6,
    }),
  ],
  UserController.Register
);

export default router;
