const { Client } = require("basic-ftp")
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const localStore = process.env.LOCAL_STORE
const remoteSourceStore = process.env.FTP_SOURCE_STORE
const remoteDestinationSotre = process.env.FTP_DESTINATION_STORE


async function start() {
    const client = new Client()
    client.ftp.verbose = false
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
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
        console.info('Конец')
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}

setInterval(() => start(), 10000)
