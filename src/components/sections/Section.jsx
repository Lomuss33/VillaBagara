import "./Section.scss"
import React, {useEffect, useState} from 'react'
import {useScheduler} from "/src/hooks/scheduler.js"
import Scrollable from "/src/components/capabilities/Scrollable.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import SectionContent from "/src/components/sections/SectionContent.jsx"
import NavToolFullscreenToggle from "/src/components/nav/tools/NavToolFullscreenToggle.jsx"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"
import {useFeedbacks} from "/src/providers/FeedbacksProvider.jsx"

function Section({ section, visible, shouldTransition }) {
    const [status, setStatus] = useState(Section.Status.HIDDEN)
    const [shouldResetScroll, setShouldResetScroll] = useState(false)
    const navigation = useNavigation()

    const isHidden = status === Section.Status.HIDDEN
    const willShow = status === Section.Status.WILL_SHOW

    useEffect(() => {
        if(!willShow)
            return
        setShouldResetScroll(true)
    }, [willShow])

    useEffect(() => {
        setShouldResetScroll(true)
    }, [navigation.shouldForceScrollToTopCount])

    return (
        <>
            <SectionTransitionManager section={section}
                                      visible={visible}
                                      shouldTransition={shouldTransition}
                                      status={status}
                                      setStatus={setStatus}/>

            {!isHidden && (
                <>
                    <SectionRenderer section={section}
                                     status={status}
                                     shouldResetScroll={shouldResetScroll}
                                     setShouldResetScroll={setShouldResetScroll}/>

                    <SectionFocusManager section={section}
                                         status={status}/>
                </>
            )}
        </>
    )
}

function SectionRenderer({ section, status, shouldResetScroll, setShouldResetScroll}) {
    const viewport = useViewport()
    const layoutConstraints = viewport.getLayoutConstraints()
    const canToggleFullscreen = layoutConstraints.canToggleFullscreen

    const statusClassName = `section-${status}`

    return (
        <section className={`section ${statusClassName}`}
                 id={`section-${section.id}`}
                 aria-labelledby={'section-heading-' + section.id}
                 aria-hidden={status !== Section.Status.SHOWN ? true : undefined}
                 inert={status !== Section.Status.SHOWN ? "" : undefined}>
            {canToggleFullscreen && (
                <NavToolFullscreenToggle className={`section-fullscreen-toggle`}/>
            )}

            <Scrollable id={`scrollable-${section.id}`}
                        className={`section-scrollable`}
                        labelledBy={'section-heading-' + section.id}
                        shouldResetScroll={shouldResetScroll}
                        setShouldResetScroll={setShouldResetScroll}>
                <SectionContent section={section}/>
            </Scrollable>
        </section>
    )
}

function SectionTransitionManager({ section, visible, shouldTransition, status, setStatus }) {
    const scheduler = useScheduler()

    const schedulerTag = section?.id + "-transition"

    useEffect(() => {
        if(!shouldTransition || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
            if(visible) _showInstantly()
            else _hideInstantly()
        }
        else {
            if(visible) _tweenIn()
            else _tweenOut()
        }
    }, [visible])

    const _hideInstantly = () => {
        scheduler.clearAllWithTag(schedulerTag)
        setStatus(Section.Status.HIDDEN)
    }

    const _showInstantly = () => {
        scheduler.clearAllWithTag(schedulerTag)
        setStatus(Section.Status.SHOWN)
    }

    const _tweenOut = () => {
        scheduler.clearAllWithTag(schedulerTag)
        setStatus(Section.Status.WILL_HIDE)
        scheduler.schedule(() => { setStatus(Section.Status.HIDING) }, 50, schedulerTag)
        scheduler.schedule(() => { setStatus(Section.Status.HIDDEN) }, 950, schedulerTag)
    }

    const _tweenIn = () => {
        scheduler.clearAllWithTag(schedulerTag)
        setStatus(Section.Status.WILL_SHOW)
        scheduler.schedule(() => { setStatus(Section.Status.SHOWING) }, 250, schedulerTag)
        scheduler.schedule(() => { setStatus(Section.Status.SHOWN) }, 750, schedulerTag)
    }
}

function SectionFocusManager({ section, status }) {
    const navigation = useNavigation()
    const feedbacks = useFeedbacks()
    const overlayBlocked = feedbacks.isBlockedByOverlay()

    useEffect(() => {
        if(status !== Section.Status.SHOWN) return
        const frame = requestAnimationFrame(() => navigation.focusPendingSection(section.id))
        return () => cancelAnimationFrame(frame)
    }, [status, navigation.transitionStatus, navigation.shouldForceScrollToTopCount, overlayBlocked])
}

Section.Status = {
    SHOWING: "showing",
    SHOWN: "shown",
    HIDING: "hiding",
    HIDDEN: "hidden",
    WILL_HIDE: "will-hide",
    WILL_SHOW: "will-show"
}

export default Section
