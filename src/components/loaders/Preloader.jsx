import "./Preloader.scss"
import React, {useEffect, useState} from 'react'
import VillaBagaraLoaderScene from "/src/components/loaders/VillaBagaraLoaderScene.jsx"
import {useUtils} from "/src/hooks/utils.js"
import {useConstants} from "/src/hooks/constants.js"

const PreloaderState = {
    PREPARING:          { id: 1 },
    SHOWING:            { id: 2 },
    HIDING:             { id: 3 },
    HIDDEN:             { id: 4 },
}

const HIDE_TRANSITION_TIME_MS = 180
const SHOW_DELAY_TIME_MS = 200

function Preloader({ children, preloaderSettings, isReady = false }) {
    const utils = useUtils()
    const constants = useConstants()
    const dom = utils.dom
    const storage = utils.storage
    const bodyAfterLoadingClass = constants.HTML_CLASSES.bodyAfterLoading
    const stayOnPreloaderScreen = storage.getWindowVariable("stayOnThePreloaderScreen")

    const enabled = preloaderSettings?.enabled
    const title = preloaderSettings?.title || ""
    const subtitle = preloaderSettings?.subtitle || ""

    const [state, setState] = useState(() => enabled ? PreloaderState.PREPARING : PreloaderState.HIDDEN)

    const shouldShowPreloaderWindow = state === PreloaderState.SHOWING || state === PreloaderState.HIDING
    const shouldShowContentElements = shouldShowPreloaderWindow
    const isHiding = state === PreloaderState.HIDING

    /** Keep the page inert and scroll-locked only while the overlay blocks it. **/
    useEffect(() => {
        dom.setBodyScrollEnabled(!shouldShowPreloaderWindow || isHiding)
        if(!shouldShowPreloaderWindow)
            document.body.classList.add(bodyAfterLoadingClass)
    }, [shouldShowPreloaderWindow, isHiding, dom, bodyAfterLoadingClass])

    useEffect(() => {
        if(state !== PreloaderState.PREPARING)
            return
        if(isReady && !stayOnPreloaderScreen) {
            setState(PreloaderState.HIDDEN)
            return
        }

        const timeoutId = window.setTimeout(() => setState(PreloaderState.SHOWING), SHOW_DELAY_TIME_MS)
        return () => window.clearTimeout(timeoutId)
    }, [state, isReady, stayOnPreloaderScreen])

    useEffect(() => {
        if(state !== PreloaderState.SHOWING || !isReady || stayOnPreloaderScreen)
            return
        setState(PreloaderState.HIDING)
    }, [state, isReady, stayOnPreloaderScreen])

    useEffect(() => {
        if(state !== PreloaderState.HIDING)
            return

        const timeoutId = window.setTimeout(() => setState(PreloaderState.HIDDEN), HIDE_TRANSITION_TIME_MS)
        return () => window.clearTimeout(timeoutId)
    }, [state])

    return (
        <div className={`preloader-content-wrapper`}>
            {shouldShowPreloaderWindow && (
                <PreloaderWindow title={title}
                                 subtitle={subtitle}
                                 showElements={shouldShowContentElements}
                                 isHiding={isHiding}/>
            )}

            <PreloaderContent blocked={shouldShowPreloaderWindow}>{children}</PreloaderContent>
        </div>
    )
}

function PreloaderWindow({ title, subtitle, showElements, isHiding }) {
    const hiddenClass = isHiding ?
        `preloader-window-hidden` : ``

    return (
        <div className={`preloader-window ${hiddenClass}`} role="status" aria-live="polite"
             aria-hidden={isHiding ? true : undefined} inert={isHiding ? "" : undefined}>
            <div className={`preloader-window-content ${showElements ? `` : `preloader-window-content-hidden`}`}>
                <VillaBagaraLoaderScene title={title}
                                        subtitle={subtitle}
                                        status="Preparing your stay"/>
            </div>
        </div>
    )
}

function PreloaderContent({ children, blocked }) {
    return (
        <div className={`preloader-content`} inert={blocked ? "" : undefined} aria-hidden={blocked ? true : undefined}>
            {children}
        </div>
    )
}

export default Preloader
