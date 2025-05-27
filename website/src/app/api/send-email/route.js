import nodemailer from 'nodemailer';

export async function POST(request) {
    const body = await request.json();
    const { to, subject, text, html } = body;

    if (!to || !subject || !text) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // your email
        pass: process.env.EMAIL_PASS,     // your app password
      },
    });

        const mailOptions = {
            from: process.env.EMAIL_USER, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            //html if provided
            html: html || '<p>This is a test email</p>', // html body
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ error: 'Failed to send email' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

}


