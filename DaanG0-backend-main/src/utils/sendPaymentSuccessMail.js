import nodemailer from 'nodemailer';

import 'dotenv/config';

const sendPaymentSuccessMail = async (
    sendTo,
    fullname,
    paymentId,
    fundraiserId,
    amount
) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.OFFICIAL_GMAIL,
            pass: process.env.OFFICIAL_GMAIL_PASSWORD,
        },
        service: 'gmail',
    });

    const mailConfigurations = {
        from: {
            name: 'sahyog',
            address: process.env.OFFICIAL_GMAIL,
        },
        to: sendTo,
        subject: 'Donation Successful',
        html: `Hello ${fullname}, Thank you for your generous donation<br/><br/>Amount: ₹${amount}<br/>Fundraiser: <a href="https://sahyogweb.vercel.app/fundraiser/${fundraiserId}" target="_blank">View Details</a><br/>Payment ID: ${paymentId}.<br/><br/>This is a payment confirmation mail for your donation. Do not reply.`,
    };

    const mailSent = await transporter.sendMail(
        mailConfigurations
    );

    if (mailSent) {
        return 'sent';
    } else {
        return 'failed';
    }
};

export default sendPaymentSuccessMail;
