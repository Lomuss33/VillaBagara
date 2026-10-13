import "./StatusCircle.scss"
import React, {useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import HoverStaticTooltip from "/src/components/widgets/HoverStaticTooltip.jsx"

function StatusCircle({ variant, message, size = "status-circle-size-default", className = "", onClick = null, ariaLabel = null }) {
    const utils = useUtils()
    const [uniqueId, setUniqueId] = useState(utils.string.generateUniqueRandomString("status-circle-"))
    const Element = onClick ? "button" : "span"

    return (
        <span className={`status-circle-host ${className} ${size}`}>
            <Element className={`status-circle ${size} status-circle-variant-${variant}`}
                     type={onClick ? "button" : undefined} id={uniqueId} onClick={onClick}
                     aria-label={utils.string.stripHTMLTags(ariaLabel || message || "")}
                     role={onClick ? undefined : "img"}>
                <span className={`status-circle-pulse`} aria-hidden="true"/>
                <span className={`status-circle-body`} aria-hidden="true"/>
            </Element>
            <HoverStaticTooltip label={message}
                                className={`status-circle-tooltip text-center`}
                                id={uniqueId + "-tooltip"}
                                targetId={uniqueId}
                                toggleBehaviorOnTouchScreens={!onClick}/>
        </span>
    )
}

StatusCircle.Sizes = {
    SMALL: "status-circle-size-small",
    DEFAULT: "status-circle-size-default"
}

export default StatusCircle
