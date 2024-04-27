interface main {
    fileName: string
    fileUp: string
    allowedExtensions: string[]
    emailX: string[]
    emailN: string | undefined
    fileExtension: string | undefined
}

type mains = {
    fileName: main['fileName']
    fileUp: main['fileUp']
    allowedExtensions: main['allowedExtensions']
    fileExtension: main['fileExtension']
    emailX: main['emailX']
    emailN: main['emailN']
}

export { mains }