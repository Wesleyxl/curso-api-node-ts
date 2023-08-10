import { Model, DataTypes, Sequelize } from "sequelize";
import bcryptjs from "bcryptjs";

interface UserAttributes {
  name: string;
  email: string;
  password_hash: string;
  password: string;
  image: string;
}

class User extends Model<UserAttributes> {
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public password!: string;
  public image!: string;

  /**
   * A middleware function that sets up the necessary middleware for the express app.
   *
   * The function sets up two middleware:
   *   - express.json(): This middleware parses incoming requests with JSON payloads and is based on body-parser.
   *   - cors(): This middleware enables Cross-Origin Resource Sharing (CORS) and is used to allow or restrict resources requested from a different domain.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  static initModel(sequelize: Sequelize): void {
    this.init(
      {
        name: {
          type: DataTypes.STRING,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 50],
              msg: "Name must be between 3 and 50 characters",
            },
          },
        },
        email: {
          type: DataTypes.STRING,
          defaultValue: "",
          unique: true,
          validate: {
            isEmail: {
              msg: "Invalid email",
            },
          },
        },
        password_hash: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        password: {
          type: DataTypes.VIRTUAL,
          defaultValue: "",
          validate: {
            len: {
              args: [6, 50],
              msg: "Password must be between 6 and 50 characters",
            },
          },
        },
        image: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeSave", async (user: User) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });
  }
}

export default User;
