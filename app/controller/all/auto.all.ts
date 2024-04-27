import { CronJob } from "cron";
import fs from 'fs';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const cachePath = 'cache/';


const autoF = new CronJob('*/5 * * * *', async function() {
    try{
        const files = await readdir(cachePath)
        const currTime = Date.now();
        for( const file of files) {
            const filepath = cachePath + file
            const filestat = fs.statSync(filepath)
            const fileCrTm = filestat.birthtime.getTime()
            const elapsedTm = currTime - fileCrTm
            if(elapsedTm >= 5 * 60 * 1000) {
                await unlink(filepath)
                console.log('session auth timeout')
            }
        }
    }catch(e){
        console.error(e)
    }
})

export default autoF