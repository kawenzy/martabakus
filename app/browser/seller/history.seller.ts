import { FastifyInstance } from "fastify";
import { checkToken } from "../../middleware/check.token";
import { seller } from "../../middleware/seller";
import { getHistoryCustomer, updateStatusHandler } from "../../controller/seller/history.seller";
import { $ref } from "../../schemas/history.schema";



async function histoBorwSel(server: FastifyInstance){
    server.get("/history/sellers",{
        preHandler: [server.authenticate, checkToken, seller]
    },getHistoryCustomer)

    server.put("/history/seller/:id", {
        preHandler: [server.authenticate, checkToken, seller],
        schema: {
            body: $ref("updSch")
        }
    },updateStatusHandler)
}

export default histoBorwSel