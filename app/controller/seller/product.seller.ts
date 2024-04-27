import { FastifyReply, FastifyRequest } from "fastify";
import { prodInp } from "../../schemas/product.schema";
import { cretprodH, curPro, delPordHl, getProd, selProHel, updProHel } from "../../helper/product.help";
import { curThumb } from "../../helper/thumbnail.help";


export async function productHandler(req: FastifyRequest<{
    Body: prodInp
}>, rply: FastifyReply) {
    const userId = req.user.uuid
    const body = req.body
    const product = await cretprodH({
        ...body,
        sellerId: userId
    })
    return rply.code(201).send(product)
}

export async function deleteProduct(req: FastifyRequest<{ Params: { cuid: string } }>, rply: FastifyReply) {
    const productId = req.params.cuid
    const userId = req.user.uuid
    const searchProduct = await getProd(productId)
    if (!searchProduct) {
        return rply.code(204).send({ msg: "no product" })
    }
    const valid = searchProduct.find(u => userId === u.sellerId)
    if (!valid) {
        return rply.code(203).send({ msg: "It's not your product" })
    }
    await delPordHl(productId)
    return rply.code(203).send({ msg: "delete product is succes" })
}

export async function updaProduct(req: FastifyRequest<{
    Params: { cuid: string },
    Body: prodInp
}>, rply: FastifyReply) {
    const productId = req.params.cuid
    const userId = req.user.uuid
    const body = req.body
    const searchProduct = await getProd(productId)
    if (!searchProduct) {
        return rply.code(204).send({ msg: "no product" })
    }
    const valid = searchProduct.find(u => userId === u.sellerId)
    if (!valid) {
        return rply.code(204).send({ msg: "It's not your content" })
    }
    const product = await updProHel(productId, body)
    return rply.code(200).send(product)
}

export async function getCurPro(req: FastifyRequest, rply: FastifyReply) {
    const userId = req.user.uuid;
    const products = await curPro();
    const curProd = products.filter((u) => userId === u.sellerId);

    const thumb = await curThumb();
    const curThumbs = thumb.filter((u) => curProd.some((p) => p.cuid === u.productId));

    const result = curProd.map((p) => {
        const curThumb = curThumbs.find((t) => t.productId === p.cuid);
        return {
            thumbnail: curThumb,
            product: p,
        };
    }).sort((a, b) => {
        const isThumbnailA = a.thumbnail && a.thumbnail.productId !== a.product.cuid;
        const isThumbnailB = b.thumbnail && b.thumbnail.productId !== b.product.cuid;
    
        if (isThumbnailA && !isThumbnailB) {
          return -1;
        }
        if (!isThumbnailA && isThumbnailB) {
          return 1;
        }
        return 0;
      });

    rply.send(result);
}

export async function sellSpro(req: FastifyRequest<{Querystring: {product: string}}>, rply: FastifyReply) {
    const productName = req.query.product
    const userId = req.user.uuid
    const seaPro = await selProHel(productName)
    const curPro = seaPro.filter((u) => userId === u.sellerId)
    if(!curPro) {
        return rply.code(203).send({msg: "this product no you"})
    }
    const thumb = await curThumb()
    const curThumbs = thumb.filter((u) => curPro.some((p) => p.cuid === u.productId))

    const results = curPro.map((f) => {
        const corThumb = curThumbs.find((t) => t.productId === f.cuid)
        return {
            thumbnail: corThumb,
            product: f,
        }
    }).sort((a,b) => {
        const product = a.product && productName !== a.product.title
        const productB = b.product && productName !== b.product.title
        if(product && !productB) {
            return -1
        }else if ( !product && productB ) {
            return 1
        }
        return 0
    })
    rply.send(results)
}