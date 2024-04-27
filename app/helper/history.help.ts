import { statusUpd } from "../schemas/history.schema";
import prisma from "../utils/prisma";



export async function buyHelp(productId: string, userId: string) {
    const history = await prisma.history.create({
        data: {productId, userId}
    })
    return history
}

export async function getHistoryHelp() {
    const history = await prisma.history.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
    return history
}


export async function updateHelp(opt: statusUpd , id: number) {
    const {status} = opt
    const history = await prisma.history.update({
        where: {id: Number(id)},
        data: {status: status}
    })
    return history
}

export async function sHisto(id: number) {
    const history = await prisma.history.findMany({
        where: {id: Number(id)}
    })
    return history
}