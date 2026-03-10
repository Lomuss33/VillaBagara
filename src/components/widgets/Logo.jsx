import "./Logo.scss"
import React, {useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"

function Logo({ className = "", style = {}, size, setDidLoad }) {
    const utils = useUtils()
    const [didFailToLoad, setDidFailToLoad] = useState(false)

    className = className || ``
    size = utils.number.forceIntoBounds(size, 0, 3, 3)

    const sizeClass = `logo-wrapper-size-${size}`
    const logoSrc = utils.file.resolvePath(`/images/svg/logo.svg`)

    useEffect(() => {
        if(!didFailToLoad)
            return

        setDidLoad && setDidLoad(true)
    }, [didFailToLoad, setDidLoad])

    return (
        <div className={`logo-wrapper ${sizeClass} ${className}`}
             style={style}>
            {!didFailToLoad && (
                <img src={logoSrc}
                     onLoad={() => { setDidLoad && setDidLoad(true) }}
                     onError={() => { setDidLoad && setDidLoad(true); setDidFailToLoad(true) }}
                     alt={`Villa Bagara logo`}/>
            )}

            {didFailToLoad && (
                <div className={`logo-fallback`}
                     aria-label={`Villa Bagara logo`}>
                    VB
                </div>
            )}
        </div>
    )
}

export default Logo
