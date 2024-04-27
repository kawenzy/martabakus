import { FastifyReply, FastifyRequest } from "fastify";
import { SendMessage } from "../../schemas/message.schema";
import { msgHelp, receiver } from "../../helper/message.help";


export async function sendMsg(req: FastifyRequest<{Body: SendMessage, Params: {id:string}}>, rply: FastifyReply){
    const {msg} = req.body
    const receiverId = req.params.id
    const userId = req.user.uuid
    const sendM = await msgHelp({msg},receiverId,userId)
    return rply.code(201).send(sendM)
}

export async function getChat(req: FastifyRequest<{ Params: { receIverId: string } }>, reply: FastifyReply) {
    const userId = req.user.uuid;
    const receId = req.params.receIverId;
    const chatRece = await receiver();
  
    const receChat = chatRece.filter(u => receId === u.receiverId);
    if (receChat.length === 0) {
      return reply.code(203).send({ msg: "haven't sent a message yet" });
    }
  
    const recChat = chatRece.filter(u => userId === u.receiverId);
    if (recChat.length === 0) {
      return reply.code(203).send({ msg: "haven't sent a message yet" });
    }
    const sortChat = [...receChat, ...recChat].sort((a,b) => {
        if(a.createdAt < b.createdAt) {
            return -1;
        } else if(a.createdAt > b.createdAt) {
            return 1;
        } else{
            return 0;
        }
    })
  
    return reply.code(201).send(sortChat);
  }
