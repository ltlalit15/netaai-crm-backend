import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'packageitappofficially@gmail.com',        // SMTP sender
            pass: 'epvuqqesdioohjvi',
        },
        tls: {
            rejectUnauthorized: false, // ✅ ignore self-signed cert error
        },
    });

    const mailOptions = {
        from: 'sagar.kiaan12@gmail.com',  // Sender name and from-address
        to,
        subject,
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};
