import "./GestureAwareButton.scss"
import React from 'react'
import {isPlainActivation} from "/src/hooks/navigationAccessibility.js"
import {_stringUtils} from "/src/hooks/utils/_string-utils.js"

// Native clicks handle mouse, keyboard, touch, and assistive activation.
function GestureAwareButton({ children, className = "", onClick = null, tooltip = "", disabled = false,
    hrefToolTip = null, ariaLabel = null, ...rest }) {
    const label = _stringUtils.stripHTMLTags(ariaLabel || tooltip || "")
    const common = {
        ...rest,
        className: 'gesture-aware-button ' + className,
        'aria-label': label || undefined,
        'data-tooltip': tooltip || undefined,
        title: label || undefined,
        draggable: false
    }
    const handleClick = event => {
        if(disabled) {
            event.preventDefault()
            return
        }
        if(hrefToolTip && !isPlainActivation(event)) return
        if(onClick) {
            event.preventDefault()
            onClick(event)
        }
    }

    if(hrefToolTip) {
        return <a {...common} href={hrefToolTip} aria-disabled={disabled || undefined}
                  tabIndex={disabled ? -1 : rest.tabIndex} onClick={handleClick}>{children}</a>
    }
    return <button {...common} type="button" disabled={disabled} onClick={handleClick}>{children}</button>
}

export default GestureAwareButton
