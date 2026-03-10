import "./StartupScreen.scss"
import React from 'react'
import VillaBagaraLoaderScene from "/src/components/loaders/VillaBagaraLoaderScene.jsx"

function StartupScreen({ title = "Villa Bagara", message = "Loading...", errorMessage = "" }) {
    const isError = Boolean(errorMessage)
    const loaderTitle = title.includes("<") ? title : `${title.split(" ")[0] || "Villa"} <b>${title.split(" ").slice(1).join(" ") || "Bagara"}</b>`

    return (
        <div className={`startup-screen`}>
            <div className={`startup-screen-card`}>
                <VillaBagaraLoaderScene title={loaderTitle}/>

                <p className={`startup-screen-message`}>
                    {isError ? errorMessage : message}
                </p>
            </div>
        </div>
    )
}

export default StartupScreen
