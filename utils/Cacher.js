import { AsyncStorage as AS } from 'react-native'
import FileSystem from './FileSystem'

// Private properties and method
const STORAGE_NAME = "@RYNTO14_"

function getCurrentTime() {
    return Math.floor((new Date).getTime() / 1000)
}

async function _read(table) {
    let rawData = await AS.getItem(table)
    if(rawData == null) {
        rawData = "{}"
    }
    return JSON.parse(rawData)
}

async function _write(table, data) {
    const _data = data!=null ? JSON.stringify(data) : null
    return AS.setItem(table, _data)
}

// END - Private properties and method

export default class Cacher {
    static COLLECTIONS = STORAGE_NAME + "cache"

    static async getCache(url) {
        const data = await _read(this.COLLECTIONS)
        
        if(data[url] == null || data[url] == undefined) return null;
        return data[url].uri
    }

    static async refreshCache() {
        const currentEpoch = getCurrentTime()
        let data = await _read(this.COLLECTIONS)

        for (let key in data) {
            if (!data.hasOwnProperty(key)) continue

            if (data[key].ttl < currentEpoch) {
                console.log("Clearing cache: " + key)
                await FileSystem.deleteFile(data[key].uri)
                delete data[key]
            }
        }

        await _write(this.COLLECTIONS, data)
    }

    static async addCache(url, uri, ttl) {
        await this.refreshCache()
        const currentEpoch = getCurrentTime()
        let collections = await _read(this.COLLECTIONS)
        collections[url] = {
            uri: uri,
            ttl: currentEpoch + ttl 
        }
        await _write(this.COLLECTIONS, collections)
    }

    static async clearCache() {
        await AS.removeItem(this.COLLECTIONS)
    }
}