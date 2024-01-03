import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (id: string) => {
  const payload = { sub: id };

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY || "", options);
};

export default generateToken;
