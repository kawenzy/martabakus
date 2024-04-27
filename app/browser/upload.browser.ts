import { FastifyInstance } from "fastify";
import { delThumb, updThumbnail, uploadHnad } from "../controller/seller/thumbnail.seller";
import { checkToken } from "../middleware/check.token";
import { seller } from "../middleware/seller";


async function uploadBrowser(server: FastifyInstance) {
    server.post('/product/thumbnail/:id', { 
        preHandler: [server.authenticate, checkToken,seller ] 
    }, uploadHnad)

    // server.get('/cur/producthumb', {
    //     preHandler: [server.authenticate, checkToken, seller]
    // }, getThumb)

    server.put('/up/thumbail/:id',{
        preHandler: [server.authenticate, checkToken, seller]
    }, updThumbnail)

    server.delete('/del/thumb/:id', {
        preHandler: [server.authenticate, checkToken, seller]
    }, delThumb)
}

export default uploadBrowser