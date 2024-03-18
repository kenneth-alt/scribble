import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
};

export default generateToken;
