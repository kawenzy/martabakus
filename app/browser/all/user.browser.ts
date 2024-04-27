import { FastifyInstance } from "fastify";
import { $ref } from "../../schemas/user.schemas";
import { currentUSer, loginHandler, logoutHandler, regsiHan, searchUser } from "../../controller/all/user.all";
import { checkToken } from "../../middleware/check.token";


async function userBrowser(server: FastifyInstance) {
    server.post('/register',{
        schema: {
            body: $ref('regis'),
        }
    }, regsiHan)

    server.post('/login',{
        schema: {
            body: $ref('loginSch')
        }
    }, loginHandler)

    server.delete('/logout',{
        preHandler: [server.authenticate, checkToken]
    },logoutHandler)

    server.get('/users', {
        preHandler: [server.authenticate, checkToken],
    },searchUser)

    server.get("/currentuser", {
        preHandler: [server.authenticate, checkToken]
    }, currentUSer)

}

export default userBrowser