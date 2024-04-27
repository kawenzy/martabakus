import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";


const data = {
    msg: z.string(),
}


const sendM = z.object({
    ...data,
})

const sendRes = z.object({
    ...data,
    id: z.number(),
})

export type SendMessage = z.infer<typeof sendM>;

const models = {
    sendM,
    sendRes,
}


export const {schemas: msgSchemas, $ref } = buildJsonSchemas(models, {$id: "msgSchemas"})