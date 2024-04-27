import nodemailer from "nodemailer";

const trasntEmail = nodemailer.createTransport({
    host: "smtp.elasticemail.com",
    port: 2525,
    secure: false,
    auth: {
        user: "martabak@gmail.com",
        pass: "E2235860740A01ED78F0EF52BA43F83958BB",
        accessToken: "b6168b9e-d9df-434d-a89c-480c8830e939"
    },
    logger: true
})

async function main(email: string, otp: string) {
    const info = await trasntEmail.sendMail({
        from: `webh262@gmail.com`,
        to: email,
        subject: "test",
        text: "test",
        html: `<p>this is code: ${otp}</p><br> <span>the time limit for this code is 2 minutes</span>`
    })
    return info
}

export default main