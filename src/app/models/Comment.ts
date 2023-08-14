import { Model, DataTypes, Sequelize } from "sequelize";

interface CommentsAttributes {
  user_id?: number;
  publication_id: number;
  content: string;
}

class Comment extends Model {
  public user_id!: number;
  public publication_id!: number;
  public content!: string;

  static initModel(sequelize: Sequelize): void {
    this.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
        },
        publication_id: {
          type: DataTypes.INTEGER,
        },
        content: {
          type: DataTypes.TEXT,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 255],
              msg: "Content must be between 3 and 255 characters",
            },
          },
        },
      },
      { sequelize }
    );
  }

  static associate(models: any): void {
    this.belongsTo(models.Publication, {
      foreignKey: "publication_id",
      as: "publication",
    });
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export default Comment;
