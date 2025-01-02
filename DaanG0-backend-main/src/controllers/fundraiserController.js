import mongoose from 'mongoose';

import { FundraiserFunds } from '../models/fundraiserFunds.js';
import Fundraiser from '../models/fundraiserModel.js';
import { FundraiserUpdates } from '../models/fundraiserUpdatesModal.js';
import User from '../models/userModel.js';

const getDraftFundraiser = async (req, res) => {
    const { uid } = req.body;

    const fundraiser = await Fundraiser.findOne({
        uid,
        status: { $in: ['draft', 'review'] },
    });

    if (fundraiser) {
        return res.json({
            statusCode: 200,
            message: 'Draft fundraiser found!',
            fundraiser,
        });
    } else {
        return res.json({
            statusCode: 404,
            message: 'No draft fundraiser!',
        });
    }
};

const saveFundraiser = async (req, res) => {
    const {
        uid,
        creatorName,
        profilePicUrl,
        fundraiserTitle,
        fundraiserStory,
        fundraiserFor,
        beneficiaryName,
        fundraiserCause,
        fundraiserGoal,
        fundraiserCity,
        fundraiserState,
        coverMediaUrl,
        zipCode,
        status,
    } = req.body;

    const fundraiser = await Fundraiser.findOne({
        uid,
        status: { $in: ['draft', 'review'] },
    });
    const fundraiserId = fundraiser?._id;

    const user = await User.findOne({ uid });

    if (!user.emailVerified) {
        return res.json({
            statusCode: 400,
            message: 'Please verify your email!',
        });
    }

    if (!fundraiserId) {
        const fundraiser = await Fundraiser.create({
            uid,
            creatorName,
            profilePicUrl,
            fundraiserTitle,
            fundraiserStory,
            fundraiserFor,
            beneficiaryName,
            fundraiserCause,
            fundraiserGoal,
            fundraiserCity,
            fundraiserState,
            coverMediaUrl,
            zipCode,
            status,
        });
        return res.json({
            statusCode: 200,
            message: 'Fundraiser saved!',
            fundraiser,
        });
    } else {
        const fundraiser = await Fundraiser.findByIdAndUpdate(
            fundraiserId,
            {
                fundraiserTitle,
                fundraiserStory,
                fundraiserFor,
                beneficiaryName,
                fundraiserCause,
                fundraiserGoal,
                fundraiserCity,
                fundraiserState,
                coverMediaUrl,
                zipCode,
                status,
            },
            { new: true }
        );
        return res.json({
            statusCode: 200,
            message: 'Fundraiser updated!',
            fundraiser,
        });
    }
};

const updateFundraiser = async (req, res) => {
    const {
        uid,
        fundraiserId,
        fundraiserTitle,
        fundraiserStory,
        fundraiserCause,
        fundraiserGoal,
        fundraiserCity,
        fundraiserState,
        coverMediaUrl,
        zipCode,
    } = req.body;

    const user = await User.findOne({ uid });

    if (!user.emailVerified) {
        return res.json({
            statusCode: 400,
            message: 'Please verify your email!',
        });
    }
    if (mongoose.isValidObjectId(fundraiserId)) {
        const findFundraiser =
            await Fundraiser.findById(fundraiserId);

        if (findFundraiser.status !== 'active') {
            return res.josn({
                statusCode: 400,
                message: 'Fundraiser is not active!',
            });
        }

        if (findFundraiser) {
            if (findFundraiser.uid === uid) {
                const fundraiser =
                    await Fundraiser.findByIdAndUpdate(
                        fundraiserId,
                        {
                            fundraiserTitle,
                            fundraiserStory,
                            fundraiserCause,
                            fundraiserGoal,
                            fundraiserCity,
                            fundraiserState,
                            coverMediaUrl,
                            zipCode,
                        },
                        { new: true }
                    );
                return res.json({
                    statusCode: 200,
                    message: 'Fundraiser updated!',
                    fundraiser,
                });
            } else {
                return res.json({
                    statusCode: 400,
                    message: 'Forbidden access!',
                });
            }
        } else {
            return res.json({
                statusCode: 404,
                message: 'Fundraiser not found!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const deleteFundraiserDraft = async (req, res) => {
    const { uid, fundraiserId } = req.body;

    if (mongoose.isValidObjectId(fundraiserId)) {
        const fundraiser = await Fundraiser.findByIdAndDelete({
            uid,
            _id: fundraiserId,
        });

        if (fundraiser) {
            return res.json({
                statusCode: 200,
                message: 'Draft fundraiser deleted!',
            });
        } else {
            return res.json({
                statusCode: 404,
                message: 'No draft fundraiser found!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const getAllFundraisers = async (req, res) => {
    const allFundraisers = await Fundraiser.find(
        {
            status: 'active',
        },
        null,
        { sort: { createdAt: -1 } }
    );
    if (allFundraisers) {
        return res.json({
            statusCode: 200,
            message: 'All fundraisers found!',
            allFundraisers,
        });
    } else {
        return res.json({
            statusCode: 404,
            message: 'No fundraisers found!',
        });
    }
};

const getUserFundraisers = async (req, res) => {
    const { uid } = req.body;

    const userFundraisers = await Fundraiser.find(
        {
            uid,
        },
        null,
        { sort: { createdAt: -1 } }
    );

    if (userFundraisers) {
        return res.json({
            statusCode: 200,
            message: 'User fundraisers found!',
            userFundraisers,
        });
    } else {
        return res.json({
            statusCode: 404,
            message: 'No fundraisers found!',
        });
    }
};

const getFundraiserById = async (req, res) => {
    const { fundraiserId } = req.body;

    if (mongoose.isValidObjectId(fundraiserId)) {
        const fundraiserDetails =
            await Fundraiser.findById(fundraiserId);
        if (fundraiserDetails.status !== 'active') {
            return res.json({
                statusCode: 400,
                message: 'Fundraiser is not active!',
            });
        }
        if (fundraiserDetails) {
            return res.json({
                statusCode: 200,
                message: 'Fundraiser found!',
                fundraiserDetails,
            });
        } else {
            return res.json({
                statusCode: 404,
                message: 'Fundraiser not found!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const getUserFundraiserById = async (req, res) => {
    const { fundraiserId, uid } = req.body;

    if (mongoose.isValidObjectId(fundraiserId)) {
        const fundraiserDetails =
            await Fundraiser.findById(fundraiserId);
        if (fundraiserDetails.status !== 'active') {
            return res.json({
                statusCode: 400,
                message: 'Fundraiser is not active!',
            });
        }
        if (fundraiserDetails.uid === uid) {
            if (fundraiserDetails) {
                return res.json({
                    statusCode: 200,
                    message: 'Fundraiser found!',
                    fundraiserDetails,
                });
            } else {
                return res.json({
                    statusCode: 404,
                    message: 'Fundraiser not found!',
                });
            }
        } else {
            return res.json({
                statusCode: 400,
                message: 'Forbidden access!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const deleteFundraiser = async (req, res) => {
    const { fundraiserId, uid } = req.body;

    if (mongoose.isValidObjectId(fundraiserId)) {
        const fundraiser =
            await Fundraiser.findById(fundraiserId);
        if (fundraiser) {
            if (fundraiser.uid === uid) {
                await FundraiserUpdates.deleteMany({
                    fundraiserId: fundraiserId,
                });
                const fundraiserDelete =
                    await Fundraiser.findByIdAndUpdate(
                        fundraiserId,
                        {
                            creatorName: null,
                            profilePicUrl: null,
                            status: 'deleted',
                        },
                        { new: true }
                    );
                if (fundraiserDelete) {
                    return res.json({
                        statusCode: 200,
                        message: 'Fundraiser deleted!',
                    });
                }
            } else {
                return res.json({
                    statusCode: 400,
                    message: 'Forbidden access!',
                });
            }
        } else {
            return res.json({
                statusCode: 404,
                message: 'Fundraiser not found!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const getFundraiserUpdates = async (req, res) => {
    const { fundraiserId } = req.body;

    if (mongoose.isValidObjectId(fundraiserId)) {
        const fundraiserUpdates = await FundraiserUpdates.find(
            {
                fundraiserId: fundraiserId,
            },
            null,
            { sort: { createdAt: -1 } }
        );

        if (fundraiserUpdates) {
            return res.json({
                statusCode: 200,
                message: 'Fundraiser updates found!',
                fundraiserUpdates,
            });
        } else {
            return res.json({
                statusCode: 404,
                message: 'No fundraiser updates found!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const postFundraiserUpdate = async (req, res) => {
    const { fundraiserId, uid, updateDetails } = req.body;

    const user = await User.findOne({ uid });

    if (!user.emailVerified) {
        return res.json({
            statusCode: 400,
            message: 'Please verify your email!',
        });
    }

    if (mongoose.isValidObjectId(fundraiserId)) {
        const fundraiser =
            await Fundraiser.findById(fundraiserId);

        if (fundraiser.status !== 'active') {
            return res.json({
                statusCode: 400,
                message: 'Fundraiser is not active!',
            });
        }

        if (fundraiser.uid === uid) {
            const fundraiserUpdate =
                await FundraiserUpdates.create({
                    uid,
                    fundraiserId,
                    updateDetails,
                });
            if (fundraiserUpdate) {
                return res.json({
                    statusCode: 200,
                    message: 'Fundraiser update posted!',
                    fundraiserUpdate,
                });
            } else {
                return res.json({
                    statusCode: 400,
                    message: 'Fundraiser update not posted!',
                });
            }
        } else {
            return res.json({
                statusCode: 400,
                message: 'Forbidden access!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const deleteFundraiserUpdate = async (req, res) => {
    const { fundraiserId, updateId, uid } = req.body;

    if (mongoose.isValidObjectId(fundraiserId)) {
        if (mongoose.isValidObjectId(updateId)) {
            const fundraiser =
                await Fundraiser.findById(fundraiserId);
            const update =
                await FundraiserUpdates.findById(updateId);
            if (fundraiser && update) {
                if (
                    fundraiser.uid === uid &&
                    update.uid === uid
                ) {
                    const deleteUpdate =
                        await FundraiserUpdates.findByIdAndDelete(
                            updateId
                        );
                    if (deleteUpdate) {
                        return res.json({
                            statusCode: 200,
                            message:
                                'Fundraiser update deleted!',
                        });
                    } else {
                        return res.json({
                            statusCode: 400,
                            message:
                                'Fundraiser update not deleted!',
                        });
                    }
                } else {
                    return res.json({
                        statusCode: 403,
                        message: 'Forbidden access!',
                    });
                }
            } else {
                return res.json({
                    statusCode: 400,
                    message: 'Invalid id!',
                });
            }
        } else {
            return res.json({
                statusCode: 400,
                messages: 'Invalid id!',
            });
        }
    } else {
        return res.json({
            statusCode: 400,
            message: 'Invalid fundraiser id!',
        });
    }
};

const getFundraiserFunds = async (req, res) => {
    const { uid, fundraiserId } = req.body;

    const user = User.findOne({
        uid,
    });

    if (user) {
        const fundraiser =
            await Fundraiser.findById(fundraiserId);

        if (fundraiser.status === 'active') {
            const fundraiserFunds =
                await FundraiserFunds.findOne({
                    uid,
                    fundraiserId,
                });

            if (fundraiserFunds) {
                return res.json({
                    statusCode: 200,
                    message: 'Funds found!',
                    fundraiserFunds,
                });
            } else {
                return res.json({
                    statusCode: 404,
                    message: 'Funds not found!',
                });
            }
        } else {
            return res.json({
                statusCode: 400,
                message: 'Fundraiser is not active!',
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
    deleteFundraiser,
    deleteFundraiserDraft,
    deleteFundraiserUpdate,
    getAllFundraisers,
    getDraftFundraiser,
    getFundraiserById,
    getFundraiserFunds,
    getFundraiserUpdates,
    getUserFundraiserById,
    getUserFundraisers,
    postFundraiserUpdate,
    saveFundraiser,
    updateFundraiser,
};
