import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { UserVerification } from '../models/verificationModal.js';

import { baseurl } from './lib.js';

import 'dotenv/config';

const sendVerificationMail = async (sendTo, uid) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.OFFICIAL_GMAIL,
            pass: process.env.OFFICIAL_GMAIL_PASSWORD,
        },
        service: 'gmail',
    });

    const token = jwt.sign(
        {
            data: { email: sendTo, uid: uid },
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '30m' }
    );

    const mailConfigurations = {
        from: {
            name: 'DaanGo',
            address: process.env.OFFICIAL_GMAIL,
        },
        to: sendTo,
        subject: 'Email Verification',
        html: `Hi! There, You have recently created an account or asked for verification mail on our website.<br/><br/>Please follow the given link to verify your email<br/><br/><a href="${baseurl}/user/verify?token=${token}" target="_blank">Verify Email</a><br/><br/>The link will expire in 30 minutes<br/><br/>Thank You!`,
    };

    const verificationData = await UserVerification.findOne({
        uid,
        email: sendTo,
    });

    if (!verificationData) {
        const mailSent = await transporter.sendMail(
            mailConfigurations
        );

        if (mailSent) {
            await UserVerification.create({
                uid,
                email: sendTo,
            });
            return 'sent';
        }
    } else if (
        Math.floor(
            (new Date() - new Date(verificationData.updatedAt)) /
                60000
        ) > 2
    ) {
        verificationData.updatedAt = new Date();
        await verificationData.save();
        await new Promise((resolve, reject) => {
            transporter.sendMail(
                mailConfigurations,
                function (error, info) {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        resolve(info);
                    }
                }
            );
        });
        return 'sent';
    } else {
        return 'cooldown';
    }
};

export default sendVerificationMail;
