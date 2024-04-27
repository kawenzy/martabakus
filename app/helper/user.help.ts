import { regisInp } from "../schemas/user.schemas";
import { hassPassword } from "../utils/hash";
import prisma from "../utils/prisma";


export async function registerHelp(inp: regisInp) {
    const { password, ...rest} = inp
    const { hash, salt} = hassPassword(password)
    const user  = await prisma.user.create({
        data: {...rest, salt, password: hash }
    })

    return user
}

export async function checkUser(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    return user
}

export async function findEmail(email: string) {
    return prisma.user.findUnique({
        where: { email }
    })
}

export async function storeToken(uuid: string, token: string | null): Promise<void> {
     await prisma.user.update({
        where: {uuid: uuid},
        data: {token: token}
    })
}

export async function checkTokens(uuid: string): Promise<boolean>  {
    const user = await prisma.user.findUnique({
        where: {uuid: uuid},
        select: {token: true}
    })
    return !!user?.token
}


export async function findToken(uuid: string) {
    const user = await prisma.user.findMany({
        where: {uuid},
        select: {token: true}
    })
    return user
}

export async function findRole(uudis: string) {
    const user = await prisma.user.findMany({
        where: {uuid: uudis},
        select: {role: true}
    })
    return user
}

export async function searchUs(name: string) {
    const user = await prisma.user.findMany({
        where: {name: {contains: name}},
        select: {name: true, email: true, uuid: true},
        orderBy: {
            name: "asc"
        }
    })
    return user
}

export async function current() {
    const user = await prisma.user.findMany({
        select: {
            name: true,
            profile: true,
            email: true,
            uuid: true
        }
    })
    return user
}
