import "./NavTabController.scss"
import React, {useEffect, useState} from 'react'
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import Nav from "/src/components/nav/base/Nav.jsx"
import GestureAwareButton from "/src/components/buttons/GestureAwareButton.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"

function NavTabController({ links }) {
    const viewport = useViewport()
    const language = useLanguage()

    const shouldAddFooterOffset = viewport.getLayoutConstraints()?.shouldAddFooterOffset
    const offsetClass = shouldAddFooterOffset ? `nav-tab-controller-with-offset` : ``

    return (
        <Nav links={links}
             ariaLabel={language.getString("navigation_primary")}
             data={null}
             tag={`nav-tab-controller`}
             className={`nav-tab-controller ${offsetClass}`}
             itemComponent={NavTabControllerLink}/>
    )
}

function NavTabControllerLink({ link, active, data, onClick, onClickTimeout }) {
    const activeClass = active ?
        `nav-tab-controller-link-active` :
        ``

    return (
        <GestureAwareButton className={`nav-tab-controller-link ${activeClass}`}
                            hrefToolTip={link.href}
                            ariaLabel={link.label}
                            aria-current={active ? "page" : undefined}
                            data-navigation-link={link.id}
                            onClick={onClick}>
            <i className={`${link.faIcon}`} aria-hidden="true"/>
            <span dangerouslySetInnerHTML={{__html: link.label}}/>
        </GestureAwareButton>
    )
}

export default NavTabController
