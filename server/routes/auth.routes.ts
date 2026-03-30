import {Router} from 'express';
import { loginUser, googleOAuth } from '../controllers/auth.controller';

// Import authentication controller functions that handle login logic
const router = Router();

// Route for logging in using username and password credentials
router.post('/credential', loginUser);

// Route for logging in using Google OAuth authentication
router.post('/AOuth', googleOAuth);

// Export the router so it can be used in the main Express application
export default router;