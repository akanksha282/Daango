import express from 'express';

import {
    getFundraiserDonationsById,
    getUserDonationsById,
    saveDonation,
} from '../controllers/donationController.js';
import { authenticate } from '../middlewares/authenticate.js';

const donationRouter = express.Router();

donationRouter.post(
    '/api/donation/saveDonation',
    authenticate,
    saveDonation
);
donationRouter.post(
    '/api/donation/getFundraiserDonationsById',
    getFundraiserDonationsById
);
donationRouter.post(
    '/api/donation/getUserDonationsById',
    authenticate,
    getUserDonationsById
);

export default donationRouter;
