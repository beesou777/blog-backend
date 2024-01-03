import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URI || "";

  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("successfully connected")
  } catch (error: any) {
    console.log("unable to connect with mongodb")
    process.exit(1);
  }
};

export default connectDB;
