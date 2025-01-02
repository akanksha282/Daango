import mongoose from 'mongoose';

const FoundraiserSchema = new mongoose.Schema(
    {
        uid: String,
        creatorName: String,
        profilePicUrl: String,
        fundraiserTitle: String,
        fundraiserStory: String,
        fundraiserFor: String,
        beneficiaryName: {
            type: String,
            default: null,
        },
        fundraiserCause: String,
        fundraiserGoal: Number,
        fundraiserCity: String,
        fundraiserState: String,
        zipCode: String,
        amountRaised: { type: Number, default: 0 },
        coverMediaUrl: String,
        status: String,
    },
    {
        timestamps: true,
    }
);

const Fundraiser = mongoose.model(
    'Fundraiser',
    FoundraiserSchema
);

export default Fundraiser;
