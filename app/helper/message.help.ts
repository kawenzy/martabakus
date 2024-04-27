import { SendMessage } from "../schemas/message.schema";
import prisma from "../utils/prisma";

export async function msgHelp(inp: SendMessage, id:string ,senderId: string) {
    const {msg} = inp
    const msgs = await prisma.message.create({
        data: {msg: msg, receiverId:id, senderId: senderId}
    })
    return msgs
}

export async function receiver(){
    const msg = await prisma.message.findMany({
        select:{
            id: true,
            senderId: true,
            msg: true,
            receiverId: true,
            createdAt: true, 
            updatedAt: true
        }
    })
    return msg
}
