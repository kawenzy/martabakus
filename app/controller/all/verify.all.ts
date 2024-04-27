import { FastifyReply, FastifyRequest } from "fastify";
import { verifyInp } from "../../schemas/verify.schemas";
import fs from 'fs';
import { registerHelp } from "../../helper/user.help";


export async function verifyAccount(req: FastifyRequest<{Body: verifyInp}>, rply: FastifyReply) {  
    const {otp} = req.body
    const jsonS = fs.readFileSync(`cache/${otp}.json`, 'utf-8')
    const data = JSON.parse(jsonS)
    if(otp === data.otp && data.expiration >= Date.now()){
        const name = data.name
        const email = data.email
        const password = data.password
        const role = data.role
        const profile = data.profile
        const user = await registerHelp({name: name, email: email, password: password, role: role, profile: profile})
        const les = await rply.code(201).send({msg: "verify account berhasil"})
        delete data.email;
        fs.unlinkSync(`cache/${otp}.json`)
           return {les, user}
    }else{
        return rply.code(400).send({msg: "otp is failed"})
    }
}