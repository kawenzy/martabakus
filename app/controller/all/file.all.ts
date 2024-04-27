import { FastifyReply, FastifyRequest } from "fastify";


export async function getFile(req: FastifyRequest<{Params: {profile: string}}>, rply: FastifyReply) {
    const profile = req.params.profile
    return rply.sendFile(profile)
}