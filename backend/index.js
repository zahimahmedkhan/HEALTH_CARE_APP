import express from 'express'
import 'dotenv/config'
import mongoose from './db/db.js';
import mainRoute from './routes/main.route.js'
import cors from 'cors'

const app = express();

const port = process.env.PORT || 5000;

const db = mongoose.connection;

// For DB Connection
db.on("Error", (error) => {
    console.log("DB Error", error);
})

db.once("open", () => {
    console.log("DB Connected");
})
// For DB Connection

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}));


// For Routes
app.use("/api", mainRoute);
// For Routes

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})