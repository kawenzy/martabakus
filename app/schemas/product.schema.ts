import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";


const data = {
    title: z.string(),
    description: z.string(),
    harga: z.string(),
    stok: z.number(),
}

const prodsch = z.object({
    ...data,
})

const respprod = z.object({
    ...data,
    cuid: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export type prodInp = z.infer<typeof prodsch>

const models = {
    prodsch, 
    respprod
}

export const {schemas: productSchema,$ref} = buildJsonSchemas(models, {$id: "productSchema"})