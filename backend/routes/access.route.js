import express from 'express';
import {
    getMyAccessGrants,
    getMyPatients,
    requestAccess,
    respondToAccessRequest,
    revokeAccess,
    searchPatients,
} from '../controllers/access.controller.js';
import { authorizeRoles, protectedRoute } from '../middlewares/protectedRoute.js';

const accessRoute = express.Router();

accessRoute.get('/search-patient', protectedRoute, authorizeRoles('doctor'), searchPatients);
accessRoute.post('/request', protectedRoute, authorizeRoles('doctor'), requestAccess);
accessRoute.patch('/respond', protectedRoute, authorizeRoles('patient'), respondToAccessRequest);
accessRoute.get('/my-grants', protectedRoute, authorizeRoles('patient'), getMyAccessGrants);
accessRoute.get('/my-patients', protectedRoute, authorizeRoles('doctor'), getMyPatients);
accessRoute.patch('/revoke/:grantId', protectedRoute, authorizeRoles('patient'), revokeAccess);

export default accessRoute;
