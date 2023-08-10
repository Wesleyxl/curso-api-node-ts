import express from "express";
import cors from "cors";

import sequelize from "./database";
import routes from "./routes";

class App {
  public express: express.Express;
  private databaseConnection: any;

  constructor() {
    this.express = express();
    this.middleware();
    this.database();
    this.routes();
  }

  private middleware() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  private database() {
    this.databaseConnection = sequelize;
  }

  private routes() {
    this.express.use(routes);
  }
}

export default new App().express;
