import Cacher from './utils/Cacher'
import FileSystem from './utils/FileSystem'
import { md5 } from './utils/MD5'
const _ = require('lodash/object')

const defaultOptions = {
    headers: {},
    ttl: 60 * 60 * 24 * 7 * 4, // 1 month
    cacheLocation: FileSystem.CACHE_DIR
}

export default class ImageCache {
    static DOWNLOAD_FAIL = "DOWNLOAD_FAIL"

    static async downloadAndCache(url, options = {}) {
        _.defaults(options, defaultOptions)
        const hashedUrl = md5(url)
        
        const imageUri = await Cacher.getCache(hashedUrl)
        if (imageUri != null && typeof imageUri === 'string') {
            return Promise.resolve(imageUri)
        } else {
            const localFileUri = await FileSystem.downloadFile(url, hashedUrl, options.headers)
            if (localFileUri == null) {
                Cacher.clearCache()
                return Promise.reject(this.DOWNLOAD_FAIL)
            } else {
                await Cacher.addCache(hashedUrl, localFileUri, options.ttl)
                return Promise.resolve(localFileUri)
            }
        }
    }
}