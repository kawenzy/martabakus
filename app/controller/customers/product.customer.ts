import { FastifyReply, FastifyRequest } from "fastify";
import { proCus, searchProHelp, seprocyu, totalProduct } from "../../helper/product.help";
import { proThu, searchThumbHelp } from "../../helper/thumbnail.help";



function getTotalPage(totalItemCount: number, itemsPerPage: number = 2){
    return Math.ceil(totalItemCount/itemsPerPage)
}

export async function allProduct(req: FastifyRequest<{
    Querystring: {page: number}
}>, rply: FastifyReply) {
    const pageId = req.query.page
    const product_Page = await proCus(pageId)
    const thumbnail_Page = await proThu(pageId)
    const same_pro_thum = thumbnail_Page.filter((u) => product_Page.some((p) => p.cuid === u.productId))

    const resul_all = product_Page.map((u) => {
        const same_pro_all = same_pro_thum.find((t) => t.productId === u.cuid)
        return {
            thumbnail: same_pro_all,
            product: u
        }
    }).sort((a,b) => {
        const is_A = a.thumbnail && a.thumbnail.productId !== a.product.cuid
        const is_B = b.thumbnail && b.thumbnail.productId !== b.product.cuid

        if(is_A && !is_B) {
            return -1
        }else if(!is_A && is_B) {
            return 1
        }
        else{
            return 0
        }
    })

    const totalProducts = await totalProduct()
    const totalPage = getTotalPage(totalProducts)
    const currentPage = pageId || 1

    rply.send({
        produk: resul_all,
        total: totalPage,
        currentPage: currentPage
    })
}

export async function searchHandlerProduct(req: FastifyRequest<{Querystring: {q: string}}>, rply: FastifyReply) {
    const q = req.query.q
    const thumbnail = await searchThumbHelp()
    const product = await searchProHelp(q)
    const same = thumbnail.filter((u) => product.some((p) => p.cuid === u.productId))
    const result = product.map((u) => {
        const same_pro = same.find((t) => t.productId === u.cuid)
        return {
            thumbnail: same_pro,
            product: u
        }
    }).sort((a,b) => {
        const is_A = a.thumbnail && a.thumbnail.productId !== a.product.cuid
        const is_B = b.thumbnail && b.thumbnail.productId !== b.product.cuid

        if(is_A && !is_B) {
            return -1
        }else if(!is_A && is_B) {
            return 1
        }else{
            return 0
        }
    })
    return rply.code(201).send(result)
}

export async function searchAllProHandler(req: FastifyRequest<{Params: {id: string}}>, rply: FastifyReply) {
    const id = req.params.id
    const thumbnail = await searchThumbHelp()
    const product = await seprocyu(id)
    const same = thumbnail.filter((u) => product.some((p) => p.cuid === u.productId))
    const result = product.map((t) => {
        const same_pro = same.find((u) => u.productId === t.cuid)
        return {
            thumbnail: same_pro,
            product: t,
        }
    }).sort((a,b) => {
        const is_A = a.thumbnail && a.thumbnail.productId !== a.product.cuid
        const is_B = b.thumbnail && b.thumbnail.productId !== b.product.cuid

        if(is_A && !is_B) {
            return -1
        } else if(!is_A && is_B) {
            return 1
        }else{
            return 0
        }
    })
    return rply.code(201).send(result)
}