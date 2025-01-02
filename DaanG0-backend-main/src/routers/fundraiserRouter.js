import express from 'express';

import {
    deleteFundraiserUpdate,
    getAllFundraisers,
    getFundraiserById,
    getFundraiserFunds,
    getFundraiserUpdates,
    postFundraiserUpdate,
    saveFundraiser,
    updateFundraiser,
} from '../controllers/fundraiserController.js';
import { authenticate } from '../middlewares/authenticate.js';

const fundraiserRouter = express.Router();

fundraiserRouter.post(
    '/api/fundraiser/getFundraiserUpdates',
    getFundraiserUpdates
);
fundraiserRouter.post(
    '/api/fundraiser/postFundraiserUpdate',
    authenticate,
    postFundraiserUpdate
);
fundraiserRouter.post(
    '/api/fundraiser/deleteFundraiserUpdate',
    authenticate,
    deleteFundraiserUpdate
);
fundraiserRouter.post(
    '/api/fundraiser/getAllFundraisers',
    getAllFundraisers
);
fundraiserRouter.post(
    '/api/fundraiser/saveFundraiser',
    authenticate,
    saveFundraiser
);
fundraiserRouter.post(
    '/api/fundraiser/updateFundraiser',
    authenticate,
    updateFundraiser
);
fundraiserRouter.post(
    '/api/fundraiser/getFundraiserById',
    getFundraiserById
);
fundraiserRouter.post(
    '/api/fundraiser/getFundraiserFunds',
    authenticate,
    getFundraiserFunds
);

export default fundraiserRouter;
