import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const data = {
    name: z.string(),
    email: z.string().email(),
    profile: z.string(),
    role: z.enum(["SELLER", "CUSTOMER"])
}

const regis = z.object({
    ...data,
    password: z.string()
})

const regisRes = z.object({
    uuid: z.string(),
    ...data,
})

const searc = z.object({
    text: z.string()
})


const loginSch = z.object({
    email: z.string().email(),
    password: z.string()
})


export type regisInp = z.infer<typeof regis>
export type loginInp = z.infer<typeof loginSch>
export type searchInp = z.infer<typeof searc>

const models = {
    regisRes,
    loginSch,
    regis,
    searc
}

export const {schemas: userSchemas, $ref} = buildJsonSchemas(models, {$id: 'userSchemas'})