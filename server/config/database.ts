import mongoose from 'mongoose';

// Function responsible for establishing the connection to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // Connect to MongoDB using the connection string stored in environment variables (.env)
    const conn = await mongoose.connect(process.env.ATLAS_URI as string);

    // Log successful connection and display the host of the connected database  
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {

    // Catch and display any connection error (e.g., wrong URI, network issue)
    console.error(`❌ Error: ${(error as Error).message}`);

    // Immediately stop the Node.js process if the database connection fails
    // This prevents the application from running without a database
    process.exit(1); // Exit process with failure
  }
};
export default connectDB; // Export the function so it can be used in the main server file