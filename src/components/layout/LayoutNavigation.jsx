import "./LayoutNavigation.scss"
import React from 'react'
import NavSidebar from "/src/components/nav/NavSidebar.jsx"
import NavTabController from "/src/components/nav/NavTabController.jsx"
import NavHeaderMobile from "/src/components/nav/NavHeaderMobile.jsx"
import FloatingContactButton from "/src/components/nav/FloatingContactButton.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import NavLinkPillsFixed from "/src/components/nav/partials/NavLinkPillsFixed.jsx"

function LayoutNavigation({ children, profile = null, sectionLinks = [], categoryLinks = [] }) {
    const viewport = useViewport()
    const language = useLanguage()

    const isMobileLayout = viewport.isMobileLayout()
    const targetCategoryId = categoryLinks.find(link => link.active)?.id || categoryLinks[0]?.id
    const currentCategorySectionLinks = sectionLinks.filter(link => link.categoryId === targetCategoryId)
    const primarySectionLinks = sectionLinks.filter(link => link.id !== "contact")
    const contactLink = sectionLinks.find(link => link.id === "contact") || null
    const firstPageLabels = {
        en: "First page",
        de: "Startseite",
        hr: "Prva stranica",
        tr: "İlk sayfa"
    }
    const bottomNavLinkIds = ["home", "stay", "services", "story"]
    const bottomNavLinks = bottomNavLinkIds
        .map(id => primarySectionLinks.find(link => link.id === id))
        .filter(Boolean)
        .map(link => {
            if(link.id !== "home")
                return link

            return {
                ...link,
                label: firstPageLabels[language.selectedLanguageId] || firstPageLabels.en
            }
        })

    const shouldAddFooterOffset = viewport.getLayoutConstraints()?.shouldAddFooterOffset
    const offsetClass = shouldAddFooterOffset ? `layout-navigation-children-wrapper-with-offset` : ``

    return (
        <div className={`layout-navigation-wrapper`}>
            {!isMobileLayout && (
                <NavSidebar profile={profile}
                            links={primarySectionLinks}/>
            )}

            {isMobileLayout && (
                <>
                    <NavLinkPillsFixed links={currentCategorySectionLinks}/>
                    <NavHeaderMobile profile={profile}
                                     links={currentCategorySectionLinks}/>
                </>
            )}

            <div className={`layout-navigation-children-wrapper ${offsetClass}`}>
                {children}
            </div>

            {contactLink && (
                <FloatingContactButton link={contactLink}/>
            )}

            {isMobileLayout && (
                <NavTabController links={bottomNavLinks}/>
            )}
        </div>
    )
}

export default LayoutNavigation
