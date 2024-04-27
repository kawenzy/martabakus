import { FastifyInstance } from "fastify";
import { $ref } from "../../schemas/message.schema";
import { getChat, sendMsg } from "../../controller/all/message.all";
import { checkToken } from "../../middleware/check.token";


async function messageBrowser(server: FastifyInstance) {
    server.post('/msg/:id', {
        preHandler: [server.authenticate, checkToken],
        schema: {
            body: $ref("sendM")
        }
    }, sendMsg)

    server.get('/msgs/:receIverId', {
        preHandler: [server.authenticate, checkToken]
    }, getChat)
}

export default messageBrowser