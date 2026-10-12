import imageManifest from '../../data/generated/imageManifest.generated.js'

export function getResponsiveImage(src) {
    if(typeof src !== 'string') return null
    const path = src.replace(/^\//, '')
    return Object.hasOwn(imageManifest, path) ? imageManifest[path] : null
}

export function resolveResponsiveImage(src, resolvePath) {
    const image = getResponsiveImage(src)
    if(!image) return null
    return {
        width: image.width,
        height: image.height,
        srcSet: image.variants.map(variant => `${resolvePath(variant.src)} ${variant.width}w`).join(', ')
    }
}
