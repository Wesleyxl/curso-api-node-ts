import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  jwt_secret: process.env.JWT_SECRET || "hsdkljhakds",
  expire_in: process.env.JWT_EXPIRE_IN || "1d",
};
