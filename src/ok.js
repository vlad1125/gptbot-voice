import { rejects } from "assert"
import axios from "axios"
import Ffmpeg from "fluent-ffmpeg"
import installer from '@ffmpeg-installer/ffmpeg'
import { on } from "events"
import { createWriteStream } from 'fs'
import { dirname, resolve}  from 'path'
import {fileURLToPath} from 'url'
import { removeFile } from "./utils.js"

const __dirname = dirname (fileURLToPath(import.meta.url))

class okConverter {
    constructor() {
        Ffmpeg.setFfmpegPath(installer.path)
    }

    toMp3(input, output) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`)
            return new Promise((resolve, reject) => {
                 Ffmpeg(input)
                    .inputOptions('-t 30')
                    .output(outputPath)
                    .on('end', () => {
                        removeFile(input)
                         resolve(outputPath )
                    })
                    .on('error', err => reject(err.message))
                    .run()
            })
        } catch (e) {
            console.log('Error mp3', e.message);
        }
    }
    
    async create(url, filename) {
        try {
            const okPath = resolve(__dirname, '../voices', `${filename}.ok`)
            const response = await axios({
                method: 'get',
                url, 
                responseType: 'stream',
           })

           return new Promise((resolve) => {
            const stream = createWriteStream(okPath)
            response.data.pipe(stream)
            stream.on ('finish', () => resolve(okPath))
           })
        } catch (e) {
          console.log('Error voice massage', e.message);
        }
    }
}

export const ok = new okConverter()