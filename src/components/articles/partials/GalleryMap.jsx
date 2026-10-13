import "./GalleryMap.scss"
import React, {useEffect, useRef, useState} from "react"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"

const TILE_SIZE = 256

function topographicImages(config, zoom, size) {
    const worldSize = TILE_SIZE * 2 ** zoom
    const latitude = config.latitude * Math.PI / 180
    const centerX = (config.longitude + 180) / 360 * worldSize
    const centerY = (1 - Math.asinh(Math.tan(latitude)) / Math.PI) / 2 * worldSize
    const left = centerX - size.width / 2
    const top = centerY - size.height / 2
    const images = []

    for(let y = Math.floor(top / TILE_SIZE); y * TILE_SIZE < top + size.height; y++) {
        for(let x = Math.floor(left / TILE_SIZE); x * TILE_SIZE < left + size.width; x++) {
            images.push({
                src: config.tileUrl.replace("{z}", zoom).replace("{x}", x).replace("{y}", y),
                left: x * TILE_SIZE - left,
                top: y * TILE_SIZE - top,
                width: TILE_SIZE,
                height: TILE_SIZE,
            })
        }
    }
    return images
}

function MapImages({images, climate}) {
    const language = useLanguage()
    const utils = useUtils()
    const [status, setStatus] = useState({})
    const failed = images.some(image => status[image.src] === "error")
    const loading = images.some(image => !status[image.src])
    const mark = (src, value) => setStatus(previous => ({...previous, [src]: value}))

    return (
        <>
            <div className={`gallery-map-images ${climate ? "gallery-map-images-climate" : ""}`}
                 aria-hidden="true">
                {images.map(image => (
                    <img key={image.src}
                         src={utils.file.resolvePath(image.src)}
                         alt=""
                         draggable="false"
                         style={{left: image.left, top: image.top, width: image.width, height: image.height,
                             visibility: status[image.src] === "error" ? "hidden" : "visible"}}
                         onLoad={() => mark(image.src, "loaded")}
                         onError={() => mark(image.src, "error")}/>
                ))}
            </div>
            {(loading || failed) && (
                <div className="gallery-map-status" role="status">
                    {language.getString(failed ? "map_unavailable" : "loading")}
                </div>
            )}
        </>
    )
}

function GalleryMap({itemWrapper}) {
    const language = useLanguage()
    const config = itemWrapper.map
    const climate = config.type === "climate"
    const [zoom, setZoom] = useState(config.zoom)
    const [size, setSize] = useState({width: 0, height: 0})
    const [visible, setVisible] = useState(false)
    const canvas = useRef(null)
    const helpId = `${itemWrapper.uniqueId}-map-help`
    const titleId = `${itemWrapper.uniqueId}-map-title`

    useEffect(() => {
        const element = canvas.current
        const resize = new ResizeObserver(([entry]) => {
            setSize({width: entry.contentRect.width, height: entry.contentRect.height})
        })
        const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
        resize.observe(element)
        intersection.observe(element)
        return () => {
            resize.disconnect()
            intersection.disconnect()
        }
    }, [])

    useEffect(() => {
        const element = canvas.current
        let accumulated = 0
        let lastWheel = 0
        let pinchDistance = null
        const changeZoom = direction => setZoom(previous =>
            Math.min(config.maxZoom, Math.max(config.minZoom, previous + direction)))
        const wheel = event => {
            // A native, non-passive listener also keeps smooth-scrollbar from
            // moving the section while the visitor zooms the map.
            event.preventDefault()
            event.stopPropagation()
            const now = performance.now()
            if(now - lastWheel > 200) accumulated = 0
            lastWheel = now
            accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size.height : 1)
            if(Math.abs(accumulated) >= 60) {
                changeZoom(accumulated < 0 ? 1 : -1)
                accumulated = 0
            }
        }
        const distance = touches => Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY)
        const touchStart = event => {
            if(event.touches.length === 2) {
                event.preventDefault()
                event.stopPropagation()
                pinchDistance = distance(event.touches)
            }
        }
        const touchMove = event => {
            if(event.touches.length !== 2 || !pinchDistance) return
            event.preventDefault()
            event.stopPropagation()
            const current = distance(event.touches)
            if(current / pinchDistance > 1.25 || current / pinchDistance < 0.8) {
                changeZoom(current > pinchDistance ? 1 : -1)
                pinchDistance = current
            }
        }
        const touchEnd = () => { pinchDistance = null }
        element.addEventListener("wheel", wheel, {passive: false})
        element.addEventListener("touchstart", touchStart, {passive: false})
        element.addEventListener("touchmove", touchMove, {passive: false})
        element.addEventListener("touchend", touchEnd)
        element.addEventListener("touchcancel", touchEnd)
        return () => {
            element.removeEventListener("wheel", wheel)
            element.removeEventListener("touchstart", touchStart)
            element.removeEventListener("touchmove", touchMove)
            element.removeEventListener("touchend", touchEnd)
            element.removeEventListener("touchcancel", touchEnd)
        }
    }, [config.minZoom, config.maxZoom, size.height])

    const keyboardZoom = event => {
        if(event.ctrlKey || event.metaKey || event.altKey) return
        const direction = ["+", "="].includes(event.key) ? 1 : ["-", "_"].includes(event.key) ? -1 : 0
        if(!direction) return
        event.preventDefault()
        event.stopPropagation()
        setZoom(previous => Math.min(config.maxZoom, Math.max(config.minZoom, previous + direction)))
    }
    const images = climate ? [{
        src: config.imagesByZoom[zoom],
        left: (size.width - config.imageWidth) / 2,
        top: (size.height - config.imageHeight) / 2,
        width: config.imageWidth,
        height: config.imageHeight,
    }] : topographicImages(config, zoom, size)

    const metersPerPixel = 156543.033928 * Math.cos(config.latitude * Math.PI / 180) / 2 ** zoom
    const magnitude = 10 ** Math.floor(Math.log10(80 * metersPerPixel))
    const scaleMeters = [5, 2, 1].find(value => value * magnitude <= 80 * metersPerPixel) * magnitude
    const coordinates = `${config.latitude.toFixed(6)}° N · ${config.longitude.toFixed(6)}° E`
    const publicMapUrl = config.publicMapUrl ? new URL(config.publicMapUrl) : null
    if(publicMapUrl) {
        const center = `${config.latitude},${config.longitude}`
        publicMapUrl.searchParams.set("center", center)
        publicMapUrl.searchParams.set("popup", center)
        publicMapUrl.searchParams.set("zoom", zoom)
    }

    return (
        <section className={`gallery-map ${climate ? "gallery-map-climate" : ""}`}
                 aria-labelledby={titleId}>
            <div className="gallery-map-heading">
                <h5 id={titleId}>{itemWrapper.locales.title}</h5>
                <span>{config.caption || coordinates}</span>
            </div>
            <div ref={canvas}
                 className="gallery-map-canvas"
                 role="region"
                 aria-label={`${itemWrapper.imageAlt}: ${coordinates}`}
                 aria-describedby={helpId}
                 tabIndex={0}
                 data-zoom={zoom}
                 data-latitude={config.latitude}
                 data-longitude={config.longitude}
                 onKeyDown={keyboardZoom}>
                {visible && size.width > 0 && <MapImages images={images} climate={climate}/>}
                <span className="gallery-map-marker" aria-hidden="true">
                    <svg viewBox="0 0 24 32"><path d="M12 31S1 19 1 12a11 11 0 0 1 22 0c0 7-11 19-11 19Z"/>
                        <circle cx="12" cy="12" r="3"/></svg>
                    <span>Villa Bagara</span>
                </span>
                <span className="gallery-map-north" aria-hidden="true">↑ N</span>
                <div className="gallery-map-scale" aria-hidden="true">
                    <span style={{width: scaleMeters / metersPerPixel}}/>
                    {scaleMeters >= 1000 ? `${scaleMeters / 1000} km` : `${scaleMeters} m`}
                </div>
                <span className="gallery-map-hint gallery-map-hint-mouse">{language.getString("map_zoom_hint")}</span>
                <span className="gallery-map-hint gallery-map-hint-touch">{language.getString("map_zoom_hint_touch")}</span>
                <span id={helpId} className="visually-hidden">{language.getString("map_zoom_help")}</span>
            </div>
            {publicMapUrl && (
                <div className="gallery-map-public-source">
                    <a className="gallery-map-public-link" href={publicMapUrl.href}
                       target="_blank" rel="noopener noreferrer"
                       aria-describedby={`${itemWrapper.uniqueId}-map-source-help`}>
                        <span>{language.getString("map_open_elevation")}</span>
                        <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"/>
                    </a>
                    <p id={`${itemWrapper.uniqueId}-map-source-help`}>
                        {language.getString("map_public_elevation_help")}
                    </p>
                </div>
            )}
            {climate && (
                <ul className="gallery-map-legend">
                    {config.legend.map(zone => (
                        <li key={zone.code}>
                            <span className="gallery-map-swatch" style={{backgroundColor: zone.color}}/>
                            <span><strong>{zone.code}</strong> {language.getTranslation(zone.locales, "label")}</span>
                        </li>
                    ))}
                </ul>
            )}
            <div className="gallery-map-attribution">
                {climate ? (
                    <><a href="https://www.gloh2o.org/koppen/" target="_blank" rel="noopener noreferrer">Beck et al. (2023)</a>
                        {" · "}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></>
                ) : (
                    <><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a>
                        {" · SRTM · "}<a href="https://opentopomap.org/about" target="_blank" rel="noopener noreferrer">OpenTopoMap (CC BY-SA)</a></>
                )}
            </div>
        </section>
    )
}

export default GalleryMap
