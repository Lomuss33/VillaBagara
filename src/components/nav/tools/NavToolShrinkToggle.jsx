import React, {useEffect, useState} from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import CircularButton from "/src/components/buttons/CircularButton.jsx"

function NavToolShrinkToggle({ expanded, setExpanded }) {
    const language = useLanguage()

    const faIcon = expanded ?
        "fa-solid fa-caret-left" :
        "fa-solid fa-caret-right"

    const size = expanded ?
        CircularButton.Sizes.LARGE :
        CircularButton.Sizes.SMALL

    return (
        <CircularButton onClick={() => { setExpanded(!expanded) }}
                        ariaLabel={language.getString(expanded ? "navigation_collapse" : "navigation_expand")}
                        aria-expanded={expanded}
                        aria-controls="villa-primary-navigation"
                        faIcon={faIcon}
                        size={size}
                        variant={CircularButton.Variants.BLEND}
                        tooltip={language.getString("toggle_sidebar")}
                        className={`nav-sidebar-btn-toggle`}/>
    )
}

export default NavToolShrinkToggle
