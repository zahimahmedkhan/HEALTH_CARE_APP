import mongoose from 'mongoose'
import "dotenv/config"

if (!process.env.DB_URL) {
    console.error("❌ DB_URL environment variable is not set!");
    process.exit(1);
}

mongoose.connect(process.env.DB_URL)
    .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    });

export default mongoose