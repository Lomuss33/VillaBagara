import "./LayoutNavigation.scss"
import React, {useEffect, useRef} from 'react'
import NavSidebar from "/src/components/nav/NavSidebar.jsx"
import NavTabController from "/src/components/nav/NavTabController.jsx"
import NavHeaderMobile from "/src/components/nav/NavHeaderMobile.jsx"
import FloatingContactButton from "/src/components/nav/FloatingContactButton.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import NavLinkPillsFixed from "/src/components/nav/partials/NavLinkPillsFixed.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import {focusSectionHeading} from "/src/hooks/navigationAccessibility.js"

function LayoutNavigation({ children, profile = null, sectionLinks = [], categoryLinks = [] }) {
    const viewport = useViewport()
    const language = useLanguage()
    const navigation = useNavigation()
    const lastFocusRef = useRef(null)
    const mainRef = useRef(null)
    const focusScrollFrameRef = useRef(null)

    const isMobileLayout = viewport.isMobileLayout()
    const primarySectionLinks = sectionLinks
    const contactLink = sectionLinks.find(link => link.id === "contact") || null
    const bottomNavLinkIds = ["home", "stay", "services", "story"]
    const bottomNavLinks = bottomNavLinkIds
        .map(id => primarySectionLinks.find(link => link.id === id))
        .filter(Boolean)

    const shouldAddFooterOffset = viewport.getLayoutConstraints()?.shouldAddFooterOffset
    const offsetClass = shouldAddFooterOffset ? `layout-navigation-children-wrapper-with-offset` : ``

    const revealFocusedContent = () => {
        if(focusScrollFrameRef.current) cancelAnimationFrame(focusScrollFrameRef.current)
        focusScrollFrameRef.current = requestAnimationFrame(() => {
            const active = document.activeElement
            if(mainRef.current?.contains(active) && active !== mainRef.current && !active.closest('[inert]')) {
                active.scrollIntoView({block: "nearest", inline: "nearest", behavior: "instant"})
            }
        })
    }
    useEffect(() => () => cancelAnimationFrame(focusScrollFrameRef.current), [])

    const skipToContent = event => {
        event.preventDefault()
        if(!focusSectionHeading(navigation.targetSection?.id)) mainRef.current?.focus()
    }
    useEffect(() => {
        if(!lastFocusRef.current || lastFocusRef.current.isConnected) return
        const frame = requestAnimationFrame(() => focusSectionHeading(navigation.targetSection?.id))
        return () => cancelAnimationFrame(frame)
    }, [isMobileLayout])

    return (
        <div className={`layout-navigation-wrapper`}
             onFocusCapture={event => {lastFocusRef.current = event.target; revealFocusedContent()}}
             onKeyDownCapture={event => {if(event.key === "Tab") revealFocusedContent()}}>
            <a className="skip-navigation" href="#main-content" onClick={skipToContent}>
                {language.getString("skip_to_content")}
            </a>
            {!isMobileLayout && (
                <NavSidebar profile={profile}
                            links={primarySectionLinks}/>
            )}

            {isMobileLayout && (
                <>
                    <NavLinkPillsFixed links={primarySectionLinks}/>
                    <NavHeaderMobile profile={profile}
                                     links={primarySectionLinks}/>
                </>
            )}

            {isMobileLayout && (
                <NavTabController links={bottomNavLinks}/>
            )}
            {contactLink && (
                <FloatingContactButton link={contactLink}/>
            )}

            <main id="main-content" ref={mainRef} tabIndex={-1}
                  aria-label={language.getString("main_content")}
                  aria-busy={Boolean(navigation.nextSection || navigation.scheduledNextSection)}
                  className={`layout-navigation-children-wrapper ${offsetClass}`}>
                {children}
            </main>
        </div>
    )
}

export default LayoutNavigation
