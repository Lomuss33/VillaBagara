import "./CircularButton.scss"
import React from 'react'
import {_stringUtils} from "/src/hooks/utils/_string-utils.js"

function CircularButton({ faIcon, onClick, variant = "circular-button-variant-default", size = "circular-button-size-default", tooltip = null, className = "", ariaLabel = null, ...rest }) {
    return (
        <button {...rest}
                type="button"
                aria-label={_stringUtils.stripHTMLTags(ariaLabel || tooltip || "") || undefined}
                className={`circular-button ${variant} ${size} ${className}`}
                data-tooltip={tooltip}
                onClick={onClick}>
            <i className={`${faIcon}`} aria-hidden="true"/>
        </button>
    )
}

CircularButton.Variants = {
    DEFAULT: "circular-button-variant-default",
    BLEND: "circular-button-variant-blend",
    TRANSPARENT: "circular-button-variant-transparent",
}

CircularButton.Sizes = {
    SMALL: "circular-button-size-small",
    DEFAULT: "circular-button-size-default",
    LARGE: "circular-button-size-large",
    EXTRA_LARGE: "circular-button-size-extra-large",
    EXTRA_EXTRA_LARGE: "circular-button-size-extra-extra-large",
}

export default CircularButton
