import mongoose from 'mongoose';

const FundraiserFundsSchema = new mongoose.Schema(
    {
        uid: String,
        fundraiserId: String,
        funds: Number,
    },
    { timestamps: true }
);

export const FundraiserFunds = mongoose.model(
    'FundraiserFunds',
    FundraiserFundsSchema
);
