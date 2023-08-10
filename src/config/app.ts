import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  app_name: process.env.APP_NAME || "Api_Typescript ",
  url: process.env.APP_URL || "http://localhost",
  port: process.env.APP_PORT || 8080,
};
