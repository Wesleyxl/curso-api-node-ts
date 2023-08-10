import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "api_typescript",
  host: process.env.DB_HOST || "localhost",
  dialect: process.env.DB_DRIVE || "mysql",
  drive: process.env.DB_DRIVE || "mysql",
  define: {
    timestamps: true,
    underscored: true,
  },
};
