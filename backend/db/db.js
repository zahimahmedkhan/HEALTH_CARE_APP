import mongoose from 'mongoose'
import "dotenv/config"

if (!process.env.DB_URL) {
    console.error("❌ DB_URL environment variable is not set! Skipping DB connection.");
} else {
    mongoose.connect(process.env.DB_URL)
        .catch((error) => {
            // In serverless, never force process exit on cold start.
            console.error("❌ MongoDB connection error:", error.message);
        });
}

export default mongoose