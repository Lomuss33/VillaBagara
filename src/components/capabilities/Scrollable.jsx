import "./Scrollable.scss"
import React, {useEffect, useRef} from 'react'
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useConstants} from "/src/hooks/constants.js"

function Scrollable({ children, id, shouldResetScroll, setShouldResetScroll, className = "", labelledBy }) {
    const constants = useConstants()
    const viewport = useViewport()
    const scrollRef = useRef(null)

    useEffect(() => {
        if(!shouldResetScroll) return
        const frame = requestAnimationFrame(() => {
            if(scrollRef.current) scrollRef.current.scrollTop = 0
            setShouldResetScroll(false)
        })
        return () => cancelAnimationFrame(frame)
    }, [shouldResetScroll, setShouldResetScroll])

    return (
        <div className={'scrollable-wrapper ' + constants.HTML_CLASSES.scrollbarDecorator + ' ' + className}>
            <div className="scrollable" id={id} ref={scrollRef}
                 tabIndex={viewport.isDesktopLayout() ? 0 : undefined}
                 role={labelledBy ? "group" : undefined} aria-labelledby={labelledBy}>
                <div className="scrollable-content">{children}</div>
            </div>
        </div>
    )
}

export default Scrollable
