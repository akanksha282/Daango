import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { UserVerification } from '../models/verificationModal.js';
import sendVerificationMail from '../utils/tokenSender.js';

import 'dotenv/config';

const signIn = async (req, res) => {
    const { uid, email } = req.body;
    const user = await User.findOne({
        uid,
        email,
    });

    if (user) {
        return res.json({
            statusCode: 200,
            message: 'User logged in!',
            userDetails: {
                fullname: user.fullname,
                emailVerified: user.emailVerified,
                profilePicUrl: user.profilePicUrl,
            },
        });
    } else {
        return res.json({
            statusCode: 400,
            message: 'User not found!',
        });
    }
};

const signUp = async (req, res) => {
    const { uid, fullname, email } = req.body;

    if (!(fullname.length >= 3)) {
        return res.json({
            statusCode: 400,
            message: 'Fullname must be greater than 3',
        });
    }
    const user = await User.create({
        uid,
        fullname,
        email,
    });

    if (user) {
        await sendVerificationMail(email, uid);

        return res.json({
            statusCode: 200,
            message: 'User created!',
            userDetails: {
                emailVerified: false,
                fullname: fullname,
                profilePicUrl: user.profilePicUrl,
            },
        });
    } else {
        return res.json({
            statusCode: 400,
            message: 'User not created!',
        });
    }
};

const resendVerificationMail = async (req, res) => {
    const { email, uid } = req.body;

    const user = await User.findOne({
        uid,
        email,
    });

    if (user) {
        if (!user.emailVerified) {
            const sentStatus = await sendVerificationMail(
                email,
                uid
            );

            if (sentStatus === 'sent') {
                return res.json({
                    statusCode: 200,
                    message: 'Verification mail sent!',
                });
            } else {
                return res.json({
                    statusCode: 400,
                    message:
                        'Email already sent, please wait for 2 minutes!',
                });
            }
        } else {
            return res.json({
                statusCode: 400,
                message: 'Email already verified!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'User not found!',
        });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
        async function (err, decoded) {
            if (err) {
                return res.send(
                    'Email verification failed, possibly the link is invalid or expired'
                );
            } else {
                const { email, uid } = decoded.data;

                const user = await User.findOne({
                    uid,
                    email,
                });

                await UserVerification.findOneAndDelete({
                    uid,
                    email,
                });

                if (user) {
                    if (user.emailVerified) {
                        return res.send(
                            'Email already verified'
                        );
                    } else {
                        user.emailVerified = true;
                        await user.save();
                        return res.send(
                            'Email verified successfully'
                        );
                    }
                } else {
                    return res.send(
                        'No user is associated with this email!'
                    );
                }
            }
        }
    );
};

export { resendVerificationMail, signIn, signUp, verifyEmail };
