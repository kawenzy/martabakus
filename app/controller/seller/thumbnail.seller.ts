import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs"
import util, { promisify } from "util"
import { pipeline } from "stream";
import { delThumbs, seltThumb, thumbHelp, updThumb } from "../../helper/thumbnail.help";
import { getProd } from "../../helper/product.help";


export async function uploadHnad(req: FastifyRequest<{Params: {id: string}}>, rply: FastifyReply) {
    const file = await req.file()
    const productId = req.params.id
    const userId = req.user.uuid
    const product = await getProd(productId)
    const valid = product.find(u => userId === u.sellerId)
    if(!valid) {
        return rply.code(203).send({msg: "no product"})
    }
    const pump = util.promisify(pipeline)
    await pump(file!.file, fs.createWriteStream(`uploads/${file!.filename}`))
    const thumnail = await thumbHelp(file!.filename, productId)
    return rply.code(201).send({msg: "succes", thumnail})
}


export async function updThumbnail(req: FastifyRequest<{Params: {id: string}}>, rply: FastifyReply) {
    const file = await req.file()
    const productID = req.params.id
    const UserId = req.user.uuid
    const thumb = await getProd(productID)
    const valid = thumb.find(u => UserId === u.sellerId)
    if(!valid) {
        return rply.code(203).send({msg: "no thumbnail"})
    }
    const delThumb = await seltThumb(productID)
    const unlink = promisify(fs.unlink);
    const del = delThumb.find(u => u.image)
    const fdpath = `uploads/${del!.image}`
    const dels = await unlink(fdpath)
    const pump = util.promisify(pipeline)
    const fileUpd = await pump(file!.file, fs.createWriteStream(`uploads/${file!.filename}`))
    const upd = await updThumb(productID, file!.filename)
    const resp = rply.code(201).send({msg: "update succes"})
    return { resp, dels, fileUpd, upd }
}

//ini versi blm di sort
//kalau mau di sort harus pakek map kayak di product.seller
// export async function getThumb(req: FastifyRequest<{Params: {id: string}}>, rply: FastifyReply) {
//     const productId = req.params.id
//     const userId = req.user.uuid
//     const product = await getProd(productId)
//     const validUser = product.find(u => userId === u.sellerId)
//     if(!validUser) {
//         return rply.code(204).send({msg: "no product user"})
//     }
//     const Product = validUser.cuid
//     const thumbanil = await seltThumb(productId)
//     const valid = thumbanil.find(u => u.productId === Product)
//     if(!valid) {
//         return rply.code(204).send({msg: "no thumbnail"})
//     }
//     const data = {valid, validUser}
//     return rply.code(200).send(data)
// }

export async function delThumb(req: FastifyRequest<{Params: {id: string}}>, rply: FastifyReply) {
    const productId = req.params.id
    const userId = req.user.uuid
    const product = await getProd(productId)
    const validUser = product.find(u => userId === u.sellerId)
    if(!validUser) {
        return rply.code(204).send({msg: "no product user"})
    }
    const thumbs = delThumbs(validUser.cuid)
    const resp = rply.code(203).send({msg: "delet thumbnail succes"})
    const data = { resp, thumbs }
    return data
}