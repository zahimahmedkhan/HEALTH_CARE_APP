import express from 'express'
const vitalRoute = express.Router();
import { protectedRoute } from '../middlewares/protectedRoute.js'
import { addVital, deleteVital, getAllVitals, getSingleVital } from '../controllers/vital.controller.js';

vitalRoute.post("/", protectedRoute, addVital);

vitalRoute.get("/", protectedRoute, getAllVitals);

vitalRoute.get("/vitals/:id", protectedRoute, getSingleVital);

vitalRoute.delete("/:id", protectedRoute, deleteVital);

export default vitalRoute;