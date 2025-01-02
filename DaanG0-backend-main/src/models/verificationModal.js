import mongoose from 'mongoose';

const UserVerificationModal = new mongoose.Schema(
    {
        uid: String,
        email: String,
    },
    { timestamps: true }
);

export const UserVerification = mongoose.model(
    'UserVerification',
    UserVerificationModal
);
