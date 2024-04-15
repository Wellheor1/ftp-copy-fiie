const { Client } = require("basic-ftp")
const fs = require('fs')
const path = require('path')

const localStore = 'localStore'
const remoteSourceStore = 'privetOne'
const remoteDestinationSotre = 'privetTwo'

async function start() {
    const client = new Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: "151.248.114.64",
            user: "kasian",
            password: "kasian",
            secure: false
        })
        const privetList = await client.list(remoteSourceStore)
        if (privetList.length > 0 ) {
            console.info('Количество файлов ', privetList.length)
            await client.downloadToDir(localStore, remoteSourceStore)
            await client.uploadFromDir(localStore, remoteDestinationSotre)
            console.info('Файлы скопированы успешно')

            await fs.readdir(localStore, (err, files) => {
                if (err) throw err
                for (const file of files) {
                    fs.unlink(path.join(localStore, file), (err) => {
                        if (err) throw err
                    })
                }
            })
            console.info('Локальное хранилище очищено')
        } else {
            console.info('Каталог пуст')
        }
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}


start()