import express from 'express';
import { getExperts, getExpertById } from '../controllers/expertController.js';

const router = express.Router();

router.route('/').get(getExperts);
router.route('/:id').get(getExpertById);

export default router;
