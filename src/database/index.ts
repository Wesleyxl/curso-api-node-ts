import { Sequelize } from "sequelize";
import dbConfig from "../config/database";

// models
import User from "../app/models/User";

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "mysql",
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

const models = [User];

// init models
models.forEach((model) => model.initModel(sequelize));

export default sequelize;
