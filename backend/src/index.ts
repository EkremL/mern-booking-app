import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { log } from "console";
import mongoose from "mongoose";
import userRoutes from "./routes/auth";
import myHotelsRoutes from "./routes/my-hotels";
import cookieParser from "cookie-parser";
import path from "path";
import morgan from "morgan";
//!CLOUDINARY IMPORT
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function connectToDatabase() {
  try {
    //!ek olarak then ekledik ve e2e databasesine bağlanmasını sağladık, npm run e2e komutu sayesinde bu databaseye bağlandık ama konsolda yazdırmak risk olduğu icin iptal ettik
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    // .then(() => {
    //   console.log(
    //     "Successfully connected to MongoDB",
    //     process.env.MONGODB_CONNECTION_STRING
    //   );
    // });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

const port = 5000;

const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

//! tsconfig dosyası oluşturduk (npx tsc --init) daha sonra  "outDir": "./dist" yi aktif ettik ve package json da frontend ve backend icin çeşitli scriptler ekleyip buildlerini aldık
//!aşağıdaki işlem, backend serveri üzerinde frontendin çalışmasını sağlar böylece 2 terminalde ayrı ayrı çalıştırmak yerine tek terminalde 2 si de çalıştırılmış olur!
//!go to the frontend dist folder  and statik dosyaların servis edilmesi
//?Nasıl çalışır? Örneğin index.html, style.css, ve main.js gibi dosyalar frontend/dist dizininde bulunuyorsa, bu dosyalar /index.html, /style.css, /main.js gibi yollarla istemciye servis edilir.
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelsRoutes);
// app.get("/api/test", async (req: Request, res: Response) => {
//   res.json({ message: "testing api endpoint, hello!" });
// });

app.listen(port, () => {
  log(`listening on port ${port}`);
  connectToDatabase();
});
