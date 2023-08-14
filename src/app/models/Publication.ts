import { Model, DataTypes, Sequelize } from "sequelize";
import appConfig from "../../config/app";

interface PublicationAttributes {
  user_id: number;
  title: string;
  content: string;
  image: string;
  url: string;
}

class Publication extends Model {
  public user_id!: number;
  public title!: string;
  public content!: string;
  public image!: string;
  public url!: string;

  static initModel(sequelize: Sequelize): void {
    this.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
        },
        title: {
          type: DataTypes.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 50],
              msg: "Title must be between 3 and 50 characters",
            },
          },
        },
        content: {
          type: DataTypes.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 255],
              msg: "Content must be between 3 and 255 characters",
            },
          },
        },
        image: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        url: {
          type: DataTypes.VIRTUAL,
          defaultValue: "",
          get() {
            if (this.image || this.image !== "") {
              return `${appConfig.url}:${
                appConfig.port
              }/images/publication/${this.getDataValue("image")}`;
            }
          },
        },
      },
      { sequelize }
    );
  }

  static associate(models: any): void {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.hasMany(models.Comment, {
      foreignKey: "publication_id",
      as: "comments",
    });
  }
}

export default Publication;
