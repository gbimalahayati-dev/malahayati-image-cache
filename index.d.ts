declare module "malahayati-image-cache" {
    interface ImageCacheOptions {
        headers?: object;
        ttl?: number;
        cacheLocation?: string;
    }

    class ImageCache {
        static downloadAndCache(url: String, options: ImageCacheOptions): Promise<any>
    }
}