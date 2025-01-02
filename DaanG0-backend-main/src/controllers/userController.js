import { FundraiserDonations } from '../models/fundraiserDonationsModal.js';
import Fundraiser from '../models/fundraiserModel.js';
import { OtherUserDetails } from '../models/otherUserDetailsModal.js';
import User from '../models/userModel.js';
import { getAge } from '../utils/lib.js';

const updateUserEmail = async (req, res) => {
    const { uid, email } = req.body;

    const user = await User.findOne({ uid });

    if (user) {
        user.email = email;
        user.emailVerified = false;
        const saved = await user.save();

        if (saved) {
            return res.json({
                statusCode: 200,
                message: 'User email updated!',
                userDetails: {
                    email: user.email,
                    emailVerified: user.emailVerified,
                },
            });
        } else {
            return res.json({
                statusCode: 400,
                message: 'User email not updated!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'User not found!',
        });
    }
};

const updateUserFullName = async (req, res) => {
    const { uid, fullname } = req.body;

    const user = await User.findOne({ uid });

    if (user) {
        await Fundraiser.updateMany(
            { uid },
            { creatorName: fullname }
        );
        await FundraiserDonations.updateMany(
            { uid },
            { fullname }
        );
        user.fullname = fullname;
        const updated = await user.save();

        if (updated) {
            return res.json({
                statusCode: 200,
                message: 'User fullname updated!',
            });
        } else {
            return res.json({
                statusCode: 400,
                message: 'Problem updating fullname',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'User not found!',
        });
    }
};

const getUserOtherDetails = async (req, res) => {
    const { uid } = req.body;

    const user = await User.findOne({
        uid,
    });

    if (user) {
        const otherDetails = await OtherUserDetails.findOne({
            uid,
        });

        return res.json({
            statusCode: 200,
            message: 'Found other details',
            otherDetails,
        });
    } else {
        return res.json({
            statusCode: 400,
            message: 'No user found!',
        });
    }
};

const saveUserOtherDetails = async (req, res) => {
    const { values, uid } = req.body;

    const user = await User.findOne({
        uid,
    });

    if (user) {
        const saveDetails = await OtherUserDetails.create({
            uid,
            gender: values.gender,
            age: getAge(new Date(values.dateOfBirth)),
            dob: values.dateOfBirth,
            govtIDType: values.govtIdType,
            govtIDNumber: values.govtIdNumber,
            accountHolderName: values.accountHolderName,
            accountNumber: values.accountNumber,
            ifscCode: values.ifscCode,
            bankName: values.bankName,
            accountType: values.accountType,
            status: 'review',
        });

        if (saveDetails) {
            return res.json({
                statusCode: 200,
                message: 'Details saved and under review!',
                details: saveDetails,
            });
        } else {
            return res.json({
                statusCode: 400,
                message: 'Problem saving details',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'User not found!',
        });
    }
};

export {
    getUserOtherDetails,
    saveUserOtherDetails,
    updateUserEmail,
    updateUserFullName,
};
