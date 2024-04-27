import { FastifyReply, FastifyRequest } from "fastify";
import { notifHelp, notiFix, seNoHelp } from "../../helper/notification.help";


export async function addNotif(req: FastifyRequest<{Params: {id: string}}>, rply: FastifyReply) {
    const id = req.params.id
    const userId = req.user.uuid
    const addNotication = await notifHelp(id,userId)
    return rply.code(200).send(addNotication)
}

export async function delNotif(req: FastifyRequest<{Params: {id: string}}>, rply: FastifyReply) {
    const id = req.params.id
    const userId = req.user.uuid
    const notifF = await notiFix()
    const valid = notifF.find((u) => userId === u.CusSelId)
    if(!valid) {
        return rply.code(204).send({msg: "this not notif, not yours"})
    }
    await notifHelp(id,userId)
    return rply.code(203).send({msg: "del notif succes"})
}

export async function getAllNotif(req: FastifyRequest, rply: FastifyReply) {
    const userId = req.user.uuid
    const notifF = await notiFix()
    const all = notifF.find((u) => userId === u.CusSelId)
    const alls = notifF.filter((u) => u.CusSelId === all?.CusSelId)
    return rply.code(200).send(alls)
}

export async function sNotifCus(req: FastifyRequest<{Params: {id: number}}>, rply: FastifyReply) {
    const userId = req.user.uuid
    const id = req.params.id
    const notifF = await notiFix()
    const valid = notifF.find((u) => userId === u.CusSelId)
    if(!valid) {
        return rply.code(204).send({msg: "this not notif, not yours"})
    }
    const notis = await seNoHelp(id)
    return rply.code(200).send(notis)
}