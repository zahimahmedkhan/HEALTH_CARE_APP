import express from 'express'
import userRoute, { adminRoute } from './user.route.js';
import aiRoute from './ai.route.js';
import vitalRoute from './vital.route.js';

const mainRoute = express.Router();

// Info route - shows available routes
mainRoute.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Healthcare API - Available Routes',
    routes: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/user-profile (protected)',
        'PUT /api/auth/update-profile (protected)'
      ],
      admin: [
        'GET /api/admin/pending-verifications (admin only)',
        'PATCH /api/admin/approve-verification/:userId (admin only)'
      ],
      vitals: [
        'POST /api/vitals (protected)',
        'GET /api/vitals (protected)',
        'GET /api/vitals/:id (protected)',
        'DELETE /api/vitals/:id (protected)'
      ],
      ai: [
        'POST /api/ai/analyze (protected)',
        'GET /api/ai/insights (protected)',
        'GET /api/ai/insights/:id (protected)',
        'DELETE /api/ai/insights/:id (protected)'
      ]
    }
  });
});

mainRoute.use("/auth", userRoute);

mainRoute.use("/admin", adminRoute);

mainRoute.use("/ai", aiRoute);

mainRoute.use("/vitals", vitalRoute);

export default mainRoute;