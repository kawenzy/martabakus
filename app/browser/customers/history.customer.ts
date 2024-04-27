import { FastifyInstance } from "fastify";
import { checkToken } from "../../middleware/check.token";
import { customer } from "../../middleware/customer";
import { buyHandler, historyHandler } from "../../controller/customers/buy.customer";



async function historyBroCus(server: FastifyInstance) {
    server.post("/history/:id", {
        preHandler: [server.authenticate, checkToken, customer]
    }, buyHandler)

    server.get("/history/cur",{
        preHandler: [server.authenticate, checkToken, customer]
    },historyHandler)
}

export default historyBroCus