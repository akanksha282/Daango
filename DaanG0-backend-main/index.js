import cors from 'cors';
import express from 'express';
import { createRouteHandler } from 'uploadthing/express';

import { connectDb } from './src/database/db.js';
import authRouter from './src/routers/authRouter.js';
import donationRouter from './src/routers/donationRouter.js';
import fundraiserRouter from './src/routers/fundraiserRouter.js';
import stripeRouter from './src/routers/stripeRouter.js';
import userRouter from './src/routers/userRouter.js';
import { uploadRouter } from './src/utils/uploadthing.js';

import 'dotenv/config';

connectDb();

const app = express();
const PORT = 5172;

const corsOptions = {
    origin: 'https://daan-g0-frontend.vercel.app',
    optionsSuccessStatus: 200,
  };
  
  app.use(cors(corsOptions));


app.use(express.static('public'));

app.use(
    '/api/uploadthing',
    createRouteHandler({
        router: uploadRouter,
        config: {
            uploadthingSecret: process.env.UPLOADTHING_SECRET,
            uploadthingId: process.env.UPLOADTHING_APP_ID,
        },
    })
);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(authRouter);
app.use(userRouter);
app.use(fundraiserRouter);
app.use(donationRouter);
app.use(stripeRouter);
if (process.env.NODE_ENV === 'production') {
    console.log('Running in production environment');
} else if (process.env.NODE_ENV === 'development') {
    console.log('Running in development environment');
} else {
    console.log('Environment is not explicitly set or recognized');
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
