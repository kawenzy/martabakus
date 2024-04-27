import { FastifyReply, FastifyRequest } from "fastify"
import { findRole } from "../helper/user.help"


export async function seller(req: FastifyRequest, reply: FastifyReply,){
    const userID = req.user.uuid
    const findRoles = await findRole(userID)
    const wait = findRoles.find(u => u.role === "SELLER")
    if(!wait) {
        return reply.code(401).send({msg: "you are not seller"})
    }
}