import { FastifyInstance } from "fastify";
import { checkToken } from "../../middleware/check.token";
import { seller } from "../../middleware/seller";
import { listNotif } from "../../controller/seller/notif.seller";



async function notifSelBrowser(server: FastifyInstance) {
    server.get("/notifs/seller", {
        preHandler: [server.authenticate, checkToken, seller]
    },listNotif)
}

export default notifSelBrowser