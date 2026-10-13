import "./SectionHeader.scss"
import React, {useEffect, useState} from 'react'
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useParser} from "/src/hooks/parser.js"
import {_stringUtils} from "/src/hooks/utils/_string-utils.js"

function SectionHeader({ section }) {
    const viewport = useViewport()
    const parser = useParser()

    const isMobileLayout = viewport.isMobileLayout()
    const parsedTitle = parser.parseSectionTitle(section)
    const title = _stringUtils.stripHTMLTags(parsedTitle.title)
    const navTitle = _stringUtils.stripHTMLTags(parsedTitle.navTitle)
    const headingLabel = title === navTitle ? title : navTitle + ': ' + title

    const titleClass = !isMobileLayout ?
        `lead-4` :
        ``

    return (
        <header className={`section-header`}>
            {parsedTitle.prefix && (
                <div className={`section-header-prefix lead-2 mb-2`}>
                    <i className={`fa-solid fa-cubes`}/>
                    <span dangerouslySetInnerHTML={{__html: parsedTitle.prefix}}/>
                </div>
            )}

            <h2 className={`section-header-title ${titleClass} h3`}
                id={'section-heading-' + section.id}
                tabIndex={-1}
                aria-label={headingLabel}
                dangerouslySetInnerHTML={{__html: parsedTitle.title}}/>
        </header>
    )
}

export default SectionHeader
