
import mongoose from 'mongoose';
import { FundraiserDonations } from '../models/fundraiserDonationsModal.js';
import { FundraiserFunds } from '../models/fundraiserFunds.js';
import Fundraiser from '../models/fundraiserModel.js';
import User from '../models/userModel.js';
import sendPaymentSuccessMail from '../utils/sendPaymentSuccessMail.js';

const saveDonation = async (req, res) => {
    const {
        fundraiserId,
        paymentId,
        amount,
        anonymous,
        uid,
        fullname,
    } = req.body;

    const user = await User.findOne({ uid });

    if (!user.emailVerified) {
        return res.json({
            statusCode: 400,
            message:
                'Please verify your email before making a donation',
        });
    }

    if (mongoose.isValidObjectId(fundraiserId)) {
        const fundraiser =
            await Fundraiser.findById(fundraiserId);
        const funds = await FundraiserFunds.findOne({
            fundraiserId,
        });

        if (fundraiser.status !== 'active') {
            return res.json({
                statusCode: 400,
                message: 'Fundraiser is not active',
            });
        }

        if (fundraiser) {
            fundraiser.amountRaised += Number(amount);
            await fundraiser.save();
        }

        if (funds) {
            funds.funds += Number(amount);
            await funds.save();
        } else {
            await FundraiserFunds.create({
                uid,
                fundraiserId,
                funds: amount,
            });
        }

        const donation = await FundraiserDonations.create({
            uid,
            fullname,
            fundraiserId,
            paymentId,
            donationAmount: amount,
            anonymousDonation: anonymous,
        });

        if (donation) {
            const sentStatus = await sendPaymentSuccessMail(
                user.email,
                fullname,
                paymentId,
                fundraiserId,
                amount
            );

            if (sentStatus === 'sent') {
                return res.json({
                    statusCode: 200,
                    message: 'Donation saved successfully',
                    donation,
                });
            }
        } else {
            return res.json({
                statusCode: 400,
                message: 'Failed to save donation',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser Id',
        });
    }
};

const getFundraiserDonationsById = async (req, res) => {
    const { fundraiserId } = req.body;

    if (mongoose.isValidObjectId(fundraiserId)) {
        const donations = await FundraiserDonations.find({
            fundraiserId,
        }).select(['-paymentId']);

        if (donations) {
            return res.json({
                statusCode: 200,
                message: 'Donations fetched successfully',
                donations,
            });
        } else {
            return res.json({
                statusCode: 404,
                message: 'No donations found',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const getUserDonationsById = async (req, res) => {
    const { uid } = req.body;

    const donations = await FundraiserDonations.find({
        uid,
    });
    const fundraisers = await Fundraiser.find({
        _id: {
            $in: donations.map(
                (donation) => donation.fundraiserId
            ),
        },
    });

    if (donations) {
        const composedDonations = donations.map((donation) => ({
            ...donation._doc,
            fundraiserTitle: fundraisers
                .filter(
                    (fundraiser) =>
                        donation.fundraiserId ===
                        fundraiser._id.toString()
                )
                .map((fundraiser) =>
                    fundraiser.status === 'deleted'
                        ? `${fundraiser.fundraiserTitle} (Not active)`
                        : fundraiser.fundraiserTitle
                )[0],
        }));

        return res.json({
            statusCode: 200,
            message: 'Donations fetched successfully',
            donations: composedDonations,
        });
    } else {
        return res.json({
            statusCode: 404,
            message: 'No donations found',
        });
    }
};

export {
    getFundraiserDonationsById,
    getUserDonationsById,
    saveDonation,
};
