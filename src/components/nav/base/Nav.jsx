import React from 'react'
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import {navigationFocusIndex} from "/src/hooks/navigationAccessibility.js"

function Nav({ links, itemComponent: Component, id = null, className = "", data = {}, ariaLabel,
    orientation = "horizontal" }) {
    const navigation = useNavigation()
    const onKeyDown = event => {
        if(event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
            return
        const controls = [...event.currentTarget.querySelectorAll('[data-navigation-link]')]
            .filter(link => link.getClientRects().length && !link.closest('[inert]') && link.getAttribute('aria-disabled') !== 'true')
        const index = controls.indexOf(event.target)
        const nextIndex = navigationFocusIndex(event.key, orientation, index, controls.length)
        if(nextIndex === null) return
        event.preventDefault()
        controls[nextIndex].focus()
    }

    return (
        <nav className={'nav-base ' + className} id={id} aria-label={ariaLabel} onKeyDown={onKeyDown}>
            {links.map(link => (
                <Component key={link.id} link={link} active={link.active} data={data}
                           onClick={() => navigation.navigateToSectionWithLink(link.href)}/>
            ))}
        </nav>
    )
}

export default Nav
