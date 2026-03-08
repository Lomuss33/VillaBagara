import "./LayoutSlideshow.scss"
import React, {useEffect, useState} from 'react'
import Section from "/src/components/sections/Section.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"

function LayoutSlideshow({ sections, currentSection, previousSection }) {
    const navigation = useNavigation()
    const effectiveCurrentSection = currentSection || previousSection || sections[0] || null

    const isTransitioning = navigation.isTransitioning()
    const transitioningClass = isTransitioning ?
        `layout-slideshow-transitioning` :
        ``

    const _shouldTransition = (section) => {
        const isCurrentOrPrevious = section === effectiveCurrentSection || section === previousSection
        return isCurrentOrPrevious && isTransitioning
    }

    return (
        <div className={`layout-slideshow ${transitioningClass}`}>
            {sections.map((section, index) => (
                <Section key={section.id}
                         section={section}
                         visible={section === effectiveCurrentSection}
                         shouldTransition={_shouldTransition(section)}/>
            ))}
        </div>
    )
}

export default LayoutSlideshow
