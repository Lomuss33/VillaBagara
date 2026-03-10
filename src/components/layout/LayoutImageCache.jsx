import "./LayoutImageCache.scss"
import React, {useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"

function LayoutImageCache({ profile, settings, sections }) {
    const utils = useUtils()
    const [isCacheReady, setIsCacheReady] = useState(false)

    useEffect(() => {
        if(typeof window.requestIdleCallback === "function") {
            const idleId = window.requestIdleCallback(() => {
                setIsCacheReady(true)
            }, {timeout: 1500})

            return () => {
                window.cancelIdleCallback?.(idleId)
            }
        }

        const timeoutId = window.setTimeout(() => {
            setIsCacheReady(true)
        }, 1200)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [])

    const imagesToCache = new Set([
        profile.profileCardLogoUrl,
        profile.profileCardLogoUrlLight,
        profile.profilePictureUrl
    ])

    const settingsImagesToCache = settings.imagesToCache || []
    for(const image of settingsImagesToCache) {
        imagesToCache.add(image)
    }

    for(const language of settings.supportedLanguages) {
        imagesToCache.add(language.flagUrl)
    }

    for(const section of sections) {
        const articles = section.data?.articles || []
        articles.forEach(article => {
            const items = article.items || []
            items.forEach(item => {
                imagesToCache.add(item.img)
            })
        })
    }

    const filtered = [...imagesToCache].filter(image => image && !image.includes('{theme}'))

    if(!isCacheReady || filtered.length === 0)
        return null

    return (
        <div className={`layout-image-cache`}>
            {filtered.map((src, key) => (
                <img key={key}
                     src={utils.file.resolvePath(src)}
                     className={`cache-image`}
                     loading={`lazy`}
                     decoding={`async`}
                     fetchPriority={`low`}
                     alt={`Preloaded image ${key + 1}`}
                     aria-hidden="true"/>
            ))}
        </div>
    )
}

export default LayoutImageCache
