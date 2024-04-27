'use strict'

import fastifyHelmet from "@fastify/helmet";
import fastifyJwt, { FastifyJWT, JWT } from "@fastify/jwt";
import fastifyStatic from "@fastify/static";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { userSchemas } from "../schemas/user.schemas";
import userBrowser from "../browser/all/user.browser";
import { verifySchemas } from "../schemas/verify.schemas";
import verifyBrowser from "../browser/all/verify.browser";
import autoF from "../controller/all/auto.all";
import fastifyCookie from "@fastify/cookie";
import fastifyMiddie from "@fastify/middie";
import { Client } from "@elastic/elasticsearch";
import { msgSchemas } from "../schemas/message.schema";
import messageBrowser from "../browser/all/message.browser";
import fastifyMultipart from "@fastify/multipart";
import uploadBrowser from "../browser/upload.browser";
import { productSchema } from "../schemas/product.schema";
import productBrowser from "../browser/seller/product.browser";
import productCustomer from "../browser/customers/product.customer";
import notifCustomer from "../browser/customers/notif.customer";
import fastifyCompress from "@fastify/compress";
import zlib from 'zlib';
import notifSelBrowser from "../browser/seller/notif.seller";
import historyBroCus from "../browser/customers/history.customer";
import { statusSchema } from "../schemas/history.schema";
import histoBorwSel from "../browser/seller/history.seller";
import fileBrowser from "../browser/all/file.browser";


export const server = fastify()

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any;
    }
    interface FastifyRequest {
        jwt: JWT;
        client: Client;
    }

}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            uuid: string
            name: string
            email: string
        }
    }
}


const token = "3RilmTZP19sIYX4HOyO7e1t2lJxzqxRSgMKPZFp1xl-EoCK51Rx8SA3N0XElO4aQ"

async function main() {
    server.register(fastifyMiddie)
    server.register(fastifyHelmet, { contentSecurityPolicy: true, xXssProtection: true, global: false })
    server.register(fastifySwagger)
    server.register(fastifySwaggerUi, {
        prefix: '/docs',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: true
        },
        uiHooks: {
            preHandler: function (requset, reply, next) { next() }
        }
    })

    server.register(fastifyCompress, {
        threshold: 2000,
        encodings: ["deflate", "gzip"],
        requestEncodings: ["gzip", "deflate"],
        global: false,
        brotliOptions: {
            params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 4
            }
        }
    })

    server.register(fastifyJwt, {
        secret: token
    })

    server.register(fastifyCookie, {
        hook: "preHandler",
        secret: token, parseOptions: { priority: "high" }
    })

    server.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        const tokan = request.cookies.token
        if (!tokan) {
            return reply.code(401).send({ msg: "authenticatin is required" })
        }
        const decode = request.jwt.verify<FastifyJWT['user']>(tokan)
        request.user = decode
    })

    server.register(fastifyMultipart)

    server.addHook("preHandler", (req, reply, next) => {
        req.jwt = server.jwt;
        return next();
    });

    server.register(fastifyStatic, {
        root: path.join(__dirname, "../../uploads"),
        prefix: "/uploads/",

    })

    for (const schemas of [
        ...userSchemas, 
        ...verifySchemas, 
        ...msgSchemas, 
        ...productSchema,
        ...statusSchema]) {
        server.addSchema(schemas)
    }

    for (const router of [
        userBrowser, 
        verifyBrowser, 
        messageBrowser, 
        uploadBrowser, 
        productBrowser, 
        productCustomer, 
        notifCustomer, 
        notifSelBrowser, 
        historyBroCus,
        histoBorwSel,
        fileBrowser]) {
        server.register(router, { prefix: '/api/v1' })
    }

    try {
        autoF.start()
        await server.listen({ port: 3000, host: '0.0.0.0' })
        console.log(`
        server is running:  http://127.0.0.1:3000/
        `)
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}


main()