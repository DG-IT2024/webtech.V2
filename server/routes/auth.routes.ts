import {Router} from 'express';
import { loginUser, googleOAuth } from '../controllers/auth.controller';

const router = Router();
router.post('/credential', loginUser);
router.post('/AOuth', googleOAuth);
export default router;