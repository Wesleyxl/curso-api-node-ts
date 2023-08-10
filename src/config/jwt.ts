export default {
  jwt_secret: process.env.JWT_SECRET || "ioeuroie",
  jwt_expire_in: process.env.JWT_EXPIRE_IN || "1d",
};
