import "./FloatingContactButton.scss"
import React from "react"
import GestureAwareButton from "/src/components/buttons/GestureAwareButton.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"

function FloatingContactButton({ link }) {
    const navigation = useNavigation()
    const viewport = useViewport()

    const shouldAddFooterOffset = viewport.getLayoutConstraints()?.shouldAddFooterOffset
    const offsetClass = shouldAddFooterOffset ? "floating-contact-button-with-offset" : ""
    const activeClass = link?.active ? "floating-contact-button-active" : ""

    if(!link)
        return <></>

    return (
        <GestureAwareButton
            className={`floating-contact-button ${offsetClass} ${activeClass}`}
            tooltip={link.label}
            onClick={() => navigation.navigateToSectionWithLink(link.href)}>
            <i className={link.faIcon}/>
            <span dangerouslySetInnerHTML={{ __html: link.label }}/>
        </GestureAwareButton>
    )
}

export default FloatingContactButton
