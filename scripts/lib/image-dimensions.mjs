// Read dimensions from the PNG source and generated WebP files without a dependency.
export function imageDimensions(bytes) {
    if(bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        return {width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20)}
    }
    if(bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') return null

    for(let offset = 12; offset + 8 <= bytes.length;) {
        const type = bytes.toString('ascii', offset, offset + 4)
        const length = bytes.readUInt32LE(offset + 4)
        const data = offset + 8
        if(data + length > bytes.length) return null
        if(type === 'VP8 ' && length >= 10) {
            return {width: bytes.readUInt16LE(data + 6) & 0x3fff, height: bytes.readUInt16LE(data + 8) & 0x3fff}
        }
        if(type === 'VP8L' && length >= 5) {
            const bits = bytes.readUInt32LE(data + 1)
            return {width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1}
        }
        if(type === 'VP8X' && length >= 10) {
            return {width: bytes.readUIntLE(data + 4, 3) + 1, height: bytes.readUIntLE(data + 7, 3) + 1}
        }
        offset = data + length + (length % 2)
    }
    return null
}
