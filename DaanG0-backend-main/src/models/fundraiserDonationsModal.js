import mongoose from 'mongoose';

const FundraiserDonationsSchema = new mongoose.Schema(
    {
        uid: String,
        fullname: String,
        fundraiserId: String,
        paymentId: String,
        donationAmount: Number,
        anonymousDonation: Boolean,
    },
    {
        timestamps: true,
    }
);

export const FundraiserDonations = mongoose.model(
    'FundraiserDonations',
    FundraiserDonationsSchema
);
