import "./ImageView.scss"
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {useConstants} from "/src/hooks/constants.js"
import {Spinner} from "react-bootstrap"
import {useUtils} from "/src/hooks/utils.js"
import {getResponsiveImage, resolveResponsiveImage} from "/src/hooks/utils/_image-utils.js"

function ImageView(props) {
    // Each source owns its load state, including a return to an already cached image.
    return <ImageViewSource key={props.src} {...props}/>
}

function ImageViewSource({ src, alt = "", className = "", id= null, hideSpinner = false, style = null, onStatus = null, responsive = true }) {
    const [loadStatus, setLoadStatus] = useState(src ? ImageView.LoadStatus.LOADING : ImageView.LoadStatus.ERROR)
    const viewRef = useRef(null)
    const responsiveImage = responsive ? getResponsiveImage(src) : null
    const [renderedWidth, setRenderedWidth] = useState(0)

    useLayoutEffect(() => {
        if(!responsiveImage) return
        const view = viewRef.current
        // Measure before creating the img so the browser selects one candidate immediately.
        const measure = () => {
            // Layout dimensions stay stable while section transitions scale or move the view.
            const width = view.clientWidth
            const height = view.clientHeight
            // Include the height requirement for tall tiles that crop with object-fit: cover.
            setRenderedWidth(Math.max(1, Math.ceil(Math.max(width, height * responsiveImage.width / responsiveImage.height))))
        }
        measure()
        if(typeof ResizeObserver === 'function') {
            const observer = new ResizeObserver(measure)
            observer.observe(view)
            return () => observer.disconnect()
        }
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [responsiveImage])

    /** @listens loadStatus **/
    useEffect(() => {
        onStatus && onStatus(loadStatus)
    }, [loadStatus, onStatus])

    const spinnerVisible = loadStatus === ImageView.LoadStatus.LOADING && !hideSpinner
    const containerVisible = loadStatus === ImageView.LoadStatus.LOADED
    const errorVisible = loadStatus === ImageView.LoadStatus.ERROR

    const _onLoad = () => {
        setLoadStatus(ImageView.LoadStatus.LOADED)
    }

    const _onError = () => {
        setLoadStatus(ImageView.LoadStatus.ERROR)
    }

    return (
        <div className={`image-view ${className}`}
             ref={viewRef}
             id={id}
             style={style}>
            {(!responsiveImage || renderedWidth > 0) && <ImageViewContainer src={src}
                                alt={alt}
                                renderedWidth={renderedWidth}
                                responsive={responsive}
                                visible={containerVisible}
                                loadStatus={loadStatus}
                                onLoad={_onLoad}
                                onError={_onError}/>}

            <ImageViewSpinner visible={spinnerVisible}/>
            <ImageViewError visible={errorVisible}
                            hideIcon={hideSpinner}/>
        </div>
    )
}

ImageView.LoadStatus = {
    LOADING: "loading",
    LOADED: "loaded",
    ERROR: "error"
}

function ImageViewContainer({ src, alt, renderedWidth, responsive, visible, loadStatus, onLoad, onError }) {
    const constants = useConstants()
    const utils = useUtils()

    const resolvedSrc = utils.file.resolvePath(src)
    const responsiveImage = responsive ? resolveResponsiveImage(src, utils.file.resolvePath) : null
    const visibleClass = visible ? `visible` : `invisible`

    return (
        <img className={`image-view-img ${visibleClass} ${constants.HTML_CLASSES.imageView} ${constants.HTML_CLASSES.imageView}-${loadStatus}`}
             src={resolvedSrc}
             srcSet={responsiveImage?.srcSet}
             sizes={responsiveImage ? `${renderedWidth}px` : undefined}
             width={responsiveImage?.width}
             height={responsiveImage?.height}
             decoding="async"
             alt={alt}
             onLoad={onLoad}
             onError={onError}/>
    )
}

function ImageViewSpinner({ visible }) {
    if(!visible)
        return <></>

    return (
        <div className={`image-view-spinner-wrapper`}>
            <Spinner/>
        </div>
    )
}

function ImageViewError({ visible, hideIcon }) {
    if(!visible)
        return <></>

    return (
        <div className={`image-view-error-wrapper`}>
            {!hideIcon && (
                <i className={`fa-solid fa-eye-slash`}/>
            )}
        </div>
    )

}

export default ImageView
