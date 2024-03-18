import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const { MONGO_URI, DB_NAME } = process.env;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${MONGO_URI}/${DB_NAME}?retryWrites=true&w=majority`
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
