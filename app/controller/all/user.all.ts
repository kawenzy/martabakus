import { FastifyReply, FastifyRequest } from "fastify";
import { loginInp, regisInp, searchInp } from "../../schemas/user.schemas";
import { checkTokens, checkUser, current, findEmail, searchUs, storeToken } from "../../helper/user.help";
import saveUrl from "../../utils/save";
import { mains } from "../../types/type.user";
import { v4 as uuidv4 } from 'uuid';
import main from "../../utils/mail";
import fs from 'fs';
import genOtp from "../../utils/otp";
import { verifyPassword } from "../../utils/hash";


const requsetCooldown: Record<string, number> = {}

export async function regsiHan(req: FastifyRequest<{
    Body: regisInp
}>, rply: FastifyReply) {
    const { profile, email, password, name, role } = req.body
    const id = uuidv4()
    try {
        const currentTime = Date.now()
        const lastTime = requsetCooldown[email]
        if (lastTime && currentTime - lastTime < 120000) {
            const repeatTime = Math.ceil((lastTime + 120000 - currentTime / 1000))
            return rply.code(401).send({ msg: `please wait a ${repeatTime} minutes, for request code otp` })
        }
        //split itu untuk mengambil name file agian akhir dengan tanda yang diberi sesuai kita
        let allowedExtensions: mains['allowedExtensions'] = ["png", "jpg", "gif"]
        let fileExtension: mains['fileExtension'] = profile.split(".").pop();
        let fileN: mains['fileName'] = `${id}-${name}`
        let fileUp: mains['fileUp'] = `${fileN}.${fileExtension}`
        let emailN: mains['emailN'] = email.split("@").pop()
        let emailX: mains['emailX'] = ['gmail.com']
        const checkU = await checkUser(email)
        const otpa = genOtp()
        if (checkU) {
            return rply.code(400).send("email already exist")
        }
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            return rply.code(400).send("File extension is not allowed.");
        }
        if (!emailN || !emailX.includes(emailN)) {
            return rply.code(400).send("format email failed")
        }
        const sendMail = await main(email, otpa)
        const file = await saveUrl({ url: profile, path: 'uploads', name: fileN })
        const data = fs.writeFileSync(`cache/${otpa}.json`, JSON.stringify({ profile: fileUp, email, password, name, role, otp: otpa, expiration: Date.now() + 120000 }), "utf-8")
        requsetCooldown[email] = currentTime
        const resp = await rply.code(201).send({ msg: "check your email and verify your account" })
        return { resp, data, file, sendMail }
    }
    catch (e) {
        return rply.code(401).send(e)
    }
}

export async function loginHandler(req: FastifyRequest<{Body: loginInp}>, rply: FastifyReply) {
    const { email, password } = req.body
    const users = await findEmail(email)
    const vypass = verifyPassword({verifypassword: password, hash: users!.password, salt: users!.salt})
    let emailN: mains['emailN'] = email.split("@").pop()
    let emailX: mains['emailX'] = ['gmail.com']
    const cook = req.cookies.token
    if (!emailN || !emailX.includes(emailN)) {
        return rply.code(400).send("format email failed")
    }
    const tkn = await checkTokens(users!.uuid)
    if(tkn) {
        return rply.code(401).send({msg: "already logged in"})
    }
    if(vypass) {
        return rply.code(401).send({msg: 'invalid password'})
    }
    if(cook){
        return rply.code(401).send('already logged in')
    }
    const payload = {
        uuid: users!.uuid,
        name: users!.name,
        email: users!.email
    }
    const tokens = req.jwt.sign(payload)
    await storeToken(users!.uuid,tokens)
    rply.setCookie('token', tokens, {
        path: '/api/v1',
        httpOnly: false,
        secure: false,
    })
    return {token: tokens}
}

export async function logoutHandler(req: FastifyRequest, rply: FastifyReply) {
    const userId = req.user.uuid
    const deltToken = await storeToken(userId, null)
    const cookieCl = rply.clearCookie('token')
    const resp = await rply.code(201).send({msg: 'logout berhasil'})
    return {resp, cookieCl, deltToken}
}

export async function searchUser(req: FastifyRequest<{Querystring: searchInp}>, rply: FastifyReply) {
    const text = req.query.text
    const user = await searchUs(text)
    if(!user){
        return rply.code(203).send({msg: "user not found"})
    }
    return rply.code(201).send(user)
}

export async function currentUSer(req: FastifyRequest, rply: FastifyReply) {
    const currents = await current()
    const currentUser = currents.find(u => req.user.uuid === u.uuid)
    return rply.code(201).send(currentUser)
}