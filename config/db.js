import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoURI =
      "mongodb+srv://saikumarparisa980:Saikumar%40_123@ai-image-generator.0kp5w.mongodb.net/ai?retryWrites=true&w=majority";

    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit the process if unable to connect to the DB
  }
};

export default connectDb;
