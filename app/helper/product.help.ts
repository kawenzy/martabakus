import { prodInp } from "../schemas/product.schema";
import prisma from "../utils/prisma";


export async function getProd(productId: string) {
    const product = await prisma.product.findMany({
        where: { cuid: productId }
    })
    return product
}

export async function cretprodH(inp: prodInp & { sellerId: string }) {
    const data = inp
    const product = await prisma.product.create({
        data
    })
    return product
}

export async function delPordHl(cuid: string) {
    const product = await prisma.product.delete({
        where: { cuid }
    })
    return product
}

export async function updProHel(cuid: string, ipt: prodInp) {
    const data = ipt
    const product = await prisma.product.update({
        where: { cuid },
        data
    })
    return product
}

export async function curPro() {
    const product = await prisma.product.findMany({
        select: { 
            cuid: true, title: true, harga: true, description: true, stok: true, sellerId: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return product
}

export async function selProHel(title: string) {
    const product = await prisma.product.findMany({
        select: {
            cuid: true,
            title: true,
            harga: true,
            description: true,
            stok: true,
            sellerId: true
        },
        orderBy:{
            _relevance:{
                fields: "title",
                search: title,
                sort: "desc"
            }
        }
    })
    return product
}


export async function proCus(page: number) {
    const limit = 2;
    const skip = (page - 1) * limit;
    const product = await prisma.product.findMany({
        take: limit,
        skip: skip,
        select: {
            sellerId: true,
            cuid: true,
            title: true,
            description: true,
            harga: true,
            stok: true,
        },
        orderBy:{
            createdAt: "desc"
        }
    })
    return product
}


export async function totalProduct() {
    const product = await prisma.product.count();
    return product
}


export async function searchProHelp(title: string) {
    const product = await prisma.product.findMany({
        where: {title: {startsWith: title}},
        select: {
            sellerId: true,
            cuid: true,
            title: true,
            description: true,
            harga: true,
            stok: true,
        },
        orderBy:{
            createdAt: "desc"
        }
    })
    return product
}

export async function seprocyu(cuid: string) {
    const product = await prisma.product.findMany({
        where: {cuid},
    })
    return product
}

export async function stokHelp(stok: number, cuid: string) {
    const product = await prisma.product.update({
        where: {cuid},
        data: {stok}
    })
    return product
} 

export async function stokDefeat(cuid: string) {
    const product = await prisma.product.findMany({
        where: {cuid},
        select: {stok: true}
    })
    return product
}