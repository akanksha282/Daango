import { supabase } from '../utils/lib.js';

const authenticate = async (req, res, next) => {
    const { access_token, uid } = req.body;
    const {
        data: { user },
    } = await supabase.auth.getUser(access_token);

    if (
        user &&
        user.role === 'authenticated' &&
        user.id === uid
    ) {
        return next();
    } else {
        return res.json({
            statusCode: 401,
            message: 'Unathorized!',
        });
    }
};

export { authenticate };
