export function isPlainActivation(event) {
    return (event.button === undefined || event.button === 0) &&
        !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
}

export function navigationFocusIndex(key, orientation, currentIndex, count) {
    if(count < 1 || currentIndex < 0 || currentIndex >= count)
        return null
    if(key === "Home") return 0
    if(key === "End") return count - 1
    const previous = orientation === "vertical" ? "ArrowUp" : "ArrowLeft"
    const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight"
    if(key === previous) return (currentIndex - 1 + count) % count
    if(key === next) return (currentIndex + 1) % count
    return null
}

export function focusSectionHeading(sectionId) {
    const heading = document.getElementById('section-heading-' + sectionId)
    if(!heading || heading.closest('[inert]') || !heading.closest('.section-shown'))
        return false
    heading.focus({preventScroll: true})
    heading.scrollIntoView({block: "start", behavior: "instant"})
    return document.activeElement === heading
}
