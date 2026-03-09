import "./NavProfileCard.scss"
import React, { useEffect, useRef, useState } from 'react'
import { Card } from "react-bootstrap"
import { useLanguage } from "/src/providers/LanguageProvider.jsx"
import { useNavigation } from "/src/providers/NavigationProvider.jsx"
import { useUtils } from "/src/hooks/utils.js"
import StatusCircle from "/src/components/generic/StatusCircle.jsx"
import ActivityTicker from "/src/components/generic/ActivityTicker.jsx"
import AudioButton from "/src/components/buttons/AudioButton.jsx"

function NavProfileCard({ profile, expanded, stackName = false }) {
    const language = useLanguage()
    const navigation = useNavigation()
    const utils = useUtils()
    const suspendAnimations = utils.storage.getWindowVariable("suspendAnimations")
    const infoRef = useRef(null)
    const nameRef = useRef(null)

    const expandedClass = expanded ? "" : "nav-profile-card-shrink"
    const [nameScale, setNameScale] = useState(1)

    const name = profile.name
    const localizedName =
        language.getTranslation(profile.locales, "localized_name", null) ||
        name
    const stylizedName =
        language.getTranslation(profile.locales, "localized_name_stylized", null) ||
        localizedName ||
        name
    const localizedNameParts = localizedName.split(/\s+/).filter(Boolean)
    const canStackName = stackName && localizedNameParts.length > 1
    const shouldShowCompactEmoji = stackName && !expanded
    const firstNameLine = canStackName ? localizedNameParts[0] : localizedName
    const secondNameLine = canStackName ? localizedNameParts.slice(1).join(" ") : ""

    const roles = language.getTranslation(profile.locales, "roles", [])
    const staticRoleLine = roles.join(" - ")

    const statusCircleVisible = Boolean(profile.statusCircleVisible)
    const statusCircleVariant = statusCircleVisible ? profile.statusCircleVariant : ""
    const statusCircleHoverMessage = statusCircleVisible
        ? language.getTranslation(profile.locales, profile.statusCircleHoverMessage)
        : null

    const statusCircleSize = expanded
        ? StatusCircle.Sizes.DEFAULT
        : StatusCircle.Sizes.SMALL

    const namePronunciationIpa = language.getTranslation(profile.locales, "name_pronunciation_ipa", null)
    const namePronunciationAudioUrl = language.getTranslation(profile.locales, "name_pronunciation_audio_url", null)
    const namePronunciationButtonVisible = namePronunciationIpa || namePronunciationAudioUrl

    const navProfileCardNameClass = namePronunciationButtonVisible
        ? "nav-profile-card-name-with-audio-button"
        : ""

    useEffect(() => {
        let frameId = 0

        const updateNameScale = () => {
            const infoElement = infoRef.current
            const nameElement = nameRef.current

            if(!infoElement || !nameElement) {
                setNameScale(1)
                return
            }

            const availableWidth = infoElement.clientWidth
            const requiredWidth = nameElement.scrollWidth

            if(!availableWidth || !requiredWidth) {
                setNameScale(1)
                return
            }

            const nextScale = Math.min(1, Math.max(0.52, availableWidth / requiredWidth))
            setNameScale(previousScale => Math.abs(previousScale - nextScale) < 0.01 ? previousScale : nextScale)
        }

        const scheduleScaleUpdate = () => {
            window.cancelAnimationFrame(frameId)
            frameId = window.requestAnimationFrame(updateNameScale)
        }

        const resizeObserver = typeof ResizeObserver === "undefined" ?
            null :
            new ResizeObserver(scheduleScaleUpdate)

        scheduleScaleUpdate()

        if(infoRef.current)
            resizeObserver?.observe(infoRef.current)

        if(nameRef.current)
            resizeObserver?.observe(nameRef.current)

        window.addEventListener("resize", scheduleScaleUpdate)
        document.fonts?.ready?.then(scheduleScaleUpdate)

        return () => {
            window.cancelAnimationFrame(frameId)
            window.removeEventListener("resize", scheduleScaleUpdate)
            resizeObserver?.disconnect()
        }
    }, [expanded, stylizedName, statusCircleVisible, namePronunciationButtonVisible])

    const _onStatusBadgeClicked = () => {
        const preferredSectionId = ["contact", "home", "stay"]
            .find(sectionId => navigation.sectionLinks?.some(link => link.id === sectionId))
        const fallbackSectionId = preferredSectionId || navigation.sectionLinks?.[0]?.id
        if(fallbackSectionId) {
            navigation.navigateToSectionWithId(fallbackSectionId)
        }
    }

    return (
        <Card className={`nav-profile-card ${expandedClass}`}>
            <div className="nav-profile-card-info" ref={infoRef}>
                <h1 className={`nav-profile-card-name ${navProfileCardNameClass} ${canStackName ? "nav-profile-card-name-stacked" : ""}`}
                    ref={nameRef}
                    style={canStackName ? undefined : { "--nav-profile-card-name-scale": nameScale }}>
                    {shouldShowCompactEmoji ? (
                        <span className="nav-profile-card-name-emoji" aria-label={localizedName} title={localizedName}>🏡🌄🏕️</span>
                    ) : canStackName ? (
                        <>
                            <span className="nav-profile-card-name-line">
                                {firstNameLine}
                            </span>

                            <span className="nav-profile-card-name-line nav-profile-card-name-line-emphasis">
                                <span>{secondNameLine}</span>

                                {statusCircleVisible && (
                                    <StatusCircle
                                        className="nav-profile-card-status-circle"
                                        variant={statusCircleVariant}
                                        message={statusCircleHoverMessage}
                                        size={statusCircleSize}
                                        onClick={_onStatusBadgeClicked}
                                    />
                                )}

                                {namePronunciationButtonVisible && (
                                    <AudioButton
                                        url={namePronunciationAudioUrl}
                                        tooltip={namePronunciationIpa}
                                        size={AudioButton.Sizes.DYNAMIC_FOR_NAV_TITLE}
                                    />
                                )}
                            </span>
                        </>
                    ) : (
                        <>
                            <span dangerouslySetInnerHTML={{ __html: stylizedName }} />

                            {statusCircleVisible && (
                                <StatusCircle
                                    className="nav-profile-card-status-circle"
                                    variant={statusCircleVariant}
                                    message={statusCircleHoverMessage}
                                    size={statusCircleSize}
                                    onClick={_onStatusBadgeClicked}
                                />
                            )}

                            {namePronunciationButtonVisible && (
                                <AudioButton
                                    url={namePronunciationAudioUrl}
                                    tooltip={namePronunciationIpa}
                                    size={AudioButton.Sizes.DYNAMIC_FOR_NAV_TITLE}
                                />
                            )}
                        </>
                    )}
                </h1>

                {!suspendAnimations && roles?.length > 0 && (
                    <div className="nav-profile-card-role">
                        <ActivityTicker strings={roles}/>
                    </div>
                )}

                {suspendAnimations && staticRoleLine && (
                    <div
                        className="nav-profile-card-role"
                        dangerouslySetInnerHTML={{ __html: staticRoleLine }}
                    />
                )}
            </div>
        </Card>
    )
}

export default NavProfileCard
