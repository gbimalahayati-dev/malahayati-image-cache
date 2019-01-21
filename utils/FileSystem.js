import RNFetchBlob from 'rn-fetch-blob'

const { fs } = RNFetchBlob

function getFilenameFromUrl(url = "") {
    return url.substring(url.lastIndexOf('/') + 1)
}

function getFileExt(url) {
    const filename = getFilenameFromUrl(url)
    return "." + filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
}

export default class FileSystem {
    static CACHE_DIR = fs.dirs.CacheDir + '/imagesCacheDir/';

    static deleteFile(uri) {
        return fs.unlink(uri);
    }

    static clearAllFile() {
        return fs.unlink(this.CACHE_DIR)
    }

    // TODO: ERROR storage penuh
    static async downloadFile(url, hashedFileName, header) {
        const tmpFile = this.CACHE_DIR + hashedFileName + ".tmp"
        let toFile = this.CACHE_DIR + hashedFileName + getFileExt(url)

        try {
            const result = await RNFetchBlob.config({path: tmpFile}).fetch('GET', url, header)
            const status = Math.floor(result.respInfo.status / 100)

            if(status === 2) {
                const remoteFileInfo = result.respInfo.headers
                const localFileInfo = await fs.stat(tmpFile)

                if(remoteFileInfo['Content-Length'] && remoteFileInfo['Content-Length'] == localFileInfo.size) { 
                    await fs.cp(tmpFile, toFile)
                }
                this.deleteFile(tmpFile)
            }
        } catch(error) {
            this.deleteFile(tmpFile)
            toFile = null
        }

        return toFile
    }
}
