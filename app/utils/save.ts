interface data {
    url: string
    path: string
    name : string
}

async function saveUrl(datas: data) {
    const saveFile = require('save-file-npm')
    const file = await saveFile(datas.url, datas.path, datas.name)
    return {file}
}
export default saveUrl