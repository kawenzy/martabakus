import prisma from "../utils/prisma";


export async function notifHelp(productId: string, CusSelId: string) {
    const notif = await prisma.noties.create({
        data : {productId, CusSelId}
    })
    return notif
}

export async function notiFix() {
    const notif = await prisma.noties.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    return notif
}


export async function seNoHelp(id: number) {
    const notif = await prisma.noties.findMany({
        where: {id}
    })
    return notif
}

export async function getNoAlHe() {
    const notif = await prisma.noties.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    return notif
}

export async function totalNotif() {
    const notif = await prisma.noties.count()
    return notif
}