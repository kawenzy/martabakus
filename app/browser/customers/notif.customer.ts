import { FastifyInstance } from "fastify";
import { checkToken } from "../../middleware/check.token";
import { customer } from "../../middleware/customer";
import { addNotif, delNotif, getAllNotif, sNotifCus } from "../../controller/customers/notif.customer";



async function notifCustomer(server: FastifyInstance) {
    server.post("/notif/:id", {
        preHandler: [server.authenticate, checkToken, customer]
    }, addNotif)

    server.delete("/notif/del/:id", {
        preHandler: [server.authenticate, checkToken, customer]
    }, delNotif)

    server.get("/notifs", {
        preHandler: [server.authenticate, checkToken, customer]
    }, getAllNotif)

    server.get("/notif/s/:id", {
        preHandler: [server.authenticate, checkToken, customer]
    }, sNotifCus)
}

export default notifCustomer