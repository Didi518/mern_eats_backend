import mongoose from "mongoose";

const connectDatabse = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING?.replace(
        "<password>",
        process.env.MONGODB_PASSWORD as string
      ) as string
    );
  } catch (error) {
    console.log(error);
  }
};

export default connectDatabse;
