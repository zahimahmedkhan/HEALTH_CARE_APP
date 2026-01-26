import express from 'express'
import 'dotenv/config'
import mongoose from './db/db.js';
import mainRoute from './routes/main.route.js'
import cors from 'cors'

const app = express();

const port = process.env.PORT || 5000;

const db = mongoose.connection;

// For DB Connection
db.on("error", (error) => {
    console.log("❌ DB Error", error);
})

db.once("open", () => {
    console.log("✅ DB Connected");
})
// For DB Connection

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, 
}));

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Global Error Handler:", err);
    res.status(500).send({
        status: 500,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// For Routes
app.use("/api", mainRoute);
// For Routes

app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`)
})