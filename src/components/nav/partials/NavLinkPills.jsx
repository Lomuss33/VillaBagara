import "./NavLinkPills.scss"
import React, {useEffect} from 'react'
import Nav from "/src/components/nav/base/Nav.jsx"
import GestureAwareButton from "/src/components/buttons/GestureAwareButton.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"

function NavLinkPills({ links, id, className = "" }) {
    const language = useLanguage()
    const visible = links.length >= 2
    const visibleClass = visible ? `` : `d-none`
    const scrollableClass = links.length > 4 ? `nav-link-pills-many-links` : ``
    const activeLinkId = links.find(link => link.active)?.id

    useEffect(() => {
        if(!activeLinkId || links.length <= 4)
            return

        const nav = document.getElementById(id)
        const activeLink = nav?.querySelector('[aria-current="page"]')
        if(!nav || !activeLink)
            return

        const navBounds = nav.getBoundingClientRect()
        const linkBounds = activeLink.getBoundingClientRect()
        let nextScrollLeft = nav.scrollLeft

        if(linkBounds.left < navBounds.left)
            nextScrollLeft += linkBounds.left - navBounds.left
        else if(linkBounds.right > navBounds.right)
            nextScrollLeft += linkBounds.right - navBounds.right
        else
            return

        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        nav.scrollTo({left: Math.max(0, nextScrollLeft), behavior})
    }, [id, activeLinkId, links.length])

    return (
        <Nav id={id}
             ariaLabel={language.getString("navigation_sections")}
             links={links}
             data={null}
             tag={id}
             className={`nav-link-pills ${scrollableClass} ${className} ${visibleClass}`}
             itemComponent={NavLinkPillsLink}/>
    )
}

function NavLinkPillsLink({ link, active, data, onClick, onClickTimeout }) {
    const activeClass = active ?
        `nav-link-pills-link-active` :
        ``

    return (
        <GestureAwareButton className={`nav-link-pills-link ${activeClass}`}
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

export default NavLinkPills
