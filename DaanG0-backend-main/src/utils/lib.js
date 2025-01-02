import CryptoJS from 'crypto-js';

import { createClient } from '@supabase/supabase-js';

import 'dotenv/config';

const baseurl = process.env.NODE_ENV
    ? 'https://daan-g0-backend.vercel.app/'
    : 'http://localhost:5172';


function encryptValue(val) {
    return CryptoJS.AES.encrypt(
        val,
        process.env.CRYPTOJS_SECRET_KEY
    ).toString();
}

function decryptValue(val) {
    return CryptoJS.AES.decrypt(
        val,
        process.env.CRYPTOJS_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    }
);

function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return (
            interval +
            ' year' +
            (interval === 1 ? '' : 's') +
            ' ago'
        );
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return (
            interval +
            ' month' +
            (interval === 1 ? '' : 's') +
            ' ago'
        );
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return (
            interval +
            ' day' +
            (interval === 1 ? '' : 's') +
            ' ago'
        );
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return (
            interval +
            ' hour' +
            (interval === 1 ? '' : 's') +
            ' ago'
        );
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return (
            interval +
            ' minute' +
            (interval === 1 ? '' : 's') +
            ' ago'
        );
    }
    return 'just now';
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (
        m < 0 ||
        (m === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
}

export {
    baseurl,
    decryptValue,
    encryptValue,
    getAge,
    supabase,
    timeSince,
};
