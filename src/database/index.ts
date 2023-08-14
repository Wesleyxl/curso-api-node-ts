import { Sequelize } from "sequelize";
import dbConfig from "../config/database";

// models
import User from "../app/models/User";
import Publication from "../app/models/Publication";
import Comment from "../app/models/Comment";

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

// models arrays
const models = [User, Publication, Comment];

// init models
models.forEach((model) => model.initModel(sequelize));

// associations
models.forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

export default sequelize;
