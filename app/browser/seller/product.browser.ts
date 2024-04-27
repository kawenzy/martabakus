import { FastifyInstance } from "fastify";
import { checkToken } from "../../middleware/check.token";
import { seller } from "../../middleware/seller";
import { deleteProduct, getCurPro, productHandler, sellSpro, updaProduct } from "../../controller/seller/product.seller";
import { $ref } from "../../schemas/product.schema";


async function productBrowser(server: FastifyInstance) {
    server.get('/curr/product', {
        preHandler: [server.authenticate, checkToken, seller]
    },getCurPro)

    server.post("/product", {
        preHandler: [server.authenticate, checkToken, seller],
        schema: {
            body: $ref('prodsch'),
            response: {
                201: $ref('respprod')
            }
        }
    }, productHandler)

    server.delete("/product/del/:id", {
        preHandler: [server.authenticate, checkToken, seller]
    }, deleteProduct)

    server.put("/product/upd/:cuid", {
        preHandler: [ server.authenticate , checkToken, seller],
        schema: {
            body: $ref("prodsch")
        }
    }, updaProduct)

    server.get("/product/search",{
        preHandler: [server.authenticate, checkToken, seller]
    }, sellSpro)
}

export default productBrowser