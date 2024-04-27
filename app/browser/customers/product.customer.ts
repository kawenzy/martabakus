import { FastifyInstance } from "fastify";
import { checkToken } from "../../middleware/check.token";
import { customer } from "../../middleware/customer";
import { allProduct, searchAllProHandler, searchHandlerProduct } from "../../controller/customers/product.customer";


async function productCustomer(server: FastifyInstance) {
    server.get("/products", {
        preHandler: [server.authenticate, checkToken, customer]
    },allProduct)

    server.get("/search/", {
        preHandler: [server.authenticate, checkToken, customer]
    }, searchHandlerProduct)

    server.get("/search/:id", {
        preHandler: [server.authenticate, checkToken, customer]
    }, searchAllProHandler)
}

export default productCustomer