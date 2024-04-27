import { FastifyInstance } from 'fastify';
import { $ref } from '../../schemas/verify.schemas';
import { verifyAccount } from '../../controller/all/verify.all';


async function verifyBrowser(server: FastifyInstance) {
    server.post('/verify', {
        schema: {
            body: $ref('verify')
        }
    },verifyAccount)
}

export default verifyBrowser