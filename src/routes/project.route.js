import express from 'express';
import { checkAuthToken } from '../middleware/auth.middleware.js';
import { createNewEndpoint, createNewProject, directQuery, hitEndpoint, loginInProjectUser, logoutProjectUser, signupProjectUser, updateEndpoint } from '../controller/project.controller.js';

const router = express.Router();


router.all('*', checkAuthToken);

router.post('/new',createNewProject);
router.post('/add-endpoint', createNewEndpoint);
router.post('/update-endpoint',updateEndpoint);
router.post('/hit-endpoint',hitEndpoint);
router.post('/direct', directQuery);
router.post('/auth/login', loginInProjectUser);
router.post('/auth/signup', signupProjectUser);
router.post('/auth/logout',logoutProjectUser);
const projectRouter = router;
export default projectRouter;