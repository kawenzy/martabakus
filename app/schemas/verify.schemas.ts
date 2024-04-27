import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";


const data = {
    otp: z.string().length(4),
}


const verify = z.object({
    ...data
})

export type verifyInp = z.infer<typeof verify>

const models = {
    verify
}

export const { schemas: verifySchemas, $ref } = buildJsonSchemas(models, { $id: 'verifySchemas' })