import mongoose from 'mongoose';

const FundraiserUpdatesSchema = new mongoose.Schema(
    {
        uid: String,
        fundraiserId: String,
        updateDetails: String,
    },
    {
        timestamps: true,
    }
);

export const FundraiserUpdates = mongoose.model(
    'FundraiserUpdates',
    FundraiserUpdatesSchema
);
