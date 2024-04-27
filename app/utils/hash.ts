import crypto from 'crypto'


export function hassPassword(password: string) {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString('hex')
    return { hash, salt }
}

export function verifyPassword({ verifypassword, hash, salt }: { verifypassword: string, hash: string, salt: string }) {
    const vypw = crypto.pbkdf2Sync(verifypassword, salt, 100, 64, "sha512").toString('hex')
    return vypw === hash
}
