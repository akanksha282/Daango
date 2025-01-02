import mongoose from 'mongoose';

const OtherUserDetailsSchema = new mongoose.Schema(
    {
        uid: String,
        gender: String,
        age: String,
        dob: String,
        govtIDType: String,
        govtIDNumber: String,
        accountHolderName: String,
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountType: String,
        status: String,
    },
    { timestamps: true }
);

export const OtherUserDetails = mongoose.model(
    'OtherUserDetails',
    OtherUserDetailsSchema
);
