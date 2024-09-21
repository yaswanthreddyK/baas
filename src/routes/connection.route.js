import express from 'express';
import { checkAuthToken } from '../middleware/auth.middleware.js';
import { create_update_connections } from '../controller/connection.controller.js';

const router = express.Router();

router.all('*', checkAuthToken);


router.route('/')
    .post(create_update_connections);


const connectionRouter = router;
export default connectionRouter;