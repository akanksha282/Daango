import express from 'express';

import {
    deleteFundraiser,
    deleteFundraiserDraft,
    getDraftFundraiser,
    getUserFundraiserById,
    getUserFundraisers,
} from '../controllers/fundraiserController.js';
import {
    getUserOtherDetails,
    saveUserOtherDetails,
    updateUserEmail,
    updateUserFullName,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authenticate.js';

const userRouter = express.Router();

userRouter.post(
    '/api/user/getDraftFundraiser',
    authenticate,
    getDraftFundraiser
);
userRouter.post(
    '/api/user/deleteDraftFundraiser',
    authenticate,
    deleteFundraiserDraft
);
userRouter.post(
    '/api/user/getAllFundraisers',
    authenticate,
    getUserFundraisers
);
userRouter.post(
    '/api/user/getUserFundraiserById',
    authenticate,
    getUserFundraiserById
);
userRouter.post(
    '/api/user/deleteFundraiser',
    authenticate,
    deleteFundraiser
);
userRouter.post(
    '/api/user/changeUserEmail',
    authenticate,
    updateUserEmail
);
userRouter.post(
    '/api/user/changeUserFullName',
    authenticate,
    updateUserFullName
);
userRouter.post(
    '/api/user/saveUserOtherDetails',
    authenticate,
    saveUserOtherDetails
);
userRouter.post(
    '/api/user/getUserOtherDetails',
    authenticate,
    getUserOtherDetails
);

export default userRouter;
