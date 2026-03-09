import mongoose from 'mongoose';


const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.ATLAS_URI as string);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};
export default connectDB;