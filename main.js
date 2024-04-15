const { Client } = require("basic-ftp")

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
        await client.cd('privetOne')
        const privetList = await client.list()
        if (privetList.length > 0 ) {
            console.log('Каталог не пуст')
            for (const file of privetList) {
                await client.downloadTo(`copy_${file.name}`, file.name)
                await client.uploadFrom(`copy_${file.name}`, `copy_${file.name}` )
            }
        }
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}


start()