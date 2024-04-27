import { FastifyInstance } from "fastify";
import { checkToken } from "../../middleware/check.token";
import { getFile } from "../../controller/all/file.all";


async function fileBrowser(server: FastifyInstance) {
    server.get("/img/:profile",{
        preHandler: [server.authenticate, checkToken]
    },getFile)

}
export default fileBrowser