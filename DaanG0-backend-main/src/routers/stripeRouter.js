import express from 'express';

import {
    cancelPaymentIntent,
    createConfirmIntent,
    createPaymentIntent,
    getPaymentDetailsById,
} from '../controllers/stripeController.js';
import { authenticate } from '../middlewares/authenticate.js';

const stripeRouter = express.Router();

stripeRouter.post(
    '/api/stripe/createPaymentIntent',
    authenticate,
    createPaymentIntent
);
stripeRouter.post(
    '/api/stripe/cancelPaymentIntent',
    authenticate,
    cancelPaymentIntent
);
stripeRouter.post(
    '/api/stripe/createConfirmIntent',
    authenticate,
    createConfirmIntent
);
stripeRouter.post(
    '/api/stripe/getPaymentDetailsById',
    authenticate,
    getPaymentDetailsById
);

export default stripeRouter;
