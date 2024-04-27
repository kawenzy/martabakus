import prisma from '../utils/prisma';


export async function thumbHelp(image: string, productId: string) {
    const thumbs = await prisma.thumbnail.create({
        data: {image: image, productId: productId}
    })
    return thumbs
}

export async function seltThumb(productId: string) {
    const thumb = await prisma.thumbnail.findMany({
        where: {productId},
        select: {image: true,productId: true}
    })
    return thumb
}

export async function updThumb(productId: string, image: string) {
    const thumb = await prisma.thumbnail.update({
        where: {productId},
        data: {image}
    })
    return thumb
}

export async function delThumbs(productId: string) {
    const thumb = await prisma.thumbnail.delete({
        where: {productId}
    })
    return thumb
}

export async function curThumb() {
    const thumb = await prisma.thumbnail.findMany({
        select: {image: true, productId: true}
    })
    return thumb
}

export async function proThu(page: number) {
    const limit = 2
    const skip = (page - 1) * limit
    const thumb = await prisma.thumbnail.findMany({
        take: limit,
        skip: skip,
        select: {
            productId: true,
            image: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return thumb
}


export async function searchThumbHelp() {
    const thumbnail = await prisma.thumbnail.findMany({
        select: {productId: true, image: true},
        orderBy: {createdAt: "desc"}
    })
    return thumbnail
}