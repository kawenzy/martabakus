import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";




const updSch = z.object({
    status: z.enum([
        "PROCESS",
        "ACCEPTED",
        "SENDING",
        "REJECTED",
        "COMPLETED",
        "CANCELLED",
    ])
})


export type statusUpd = z.infer<typeof updSch>

const model = {
    updSch
}

export const {schemas: statusSchema, $ref} = buildJsonSchemas(model, {$id: "statusSchema"})