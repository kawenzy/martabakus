import { FastifyReply, FastifyRequest } from "fastify"
import { findToken } from "../helper/user.help"


export async function checkToken(req: FastifyRequest, reply: FastifyReply,){
    const userID = req.user.uuid
    const CookToken = req.cookies.token
    const findRoles = await findToken(userID)
    const wait = findRoles.find(u => CookToken === u.token)
    if(!wait) {
        return reply.code(401).send({msg: "authenticatin is required"})
    }
}