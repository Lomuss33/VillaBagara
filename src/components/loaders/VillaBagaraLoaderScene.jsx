import "./VillaBagaraLoaderScene.scss"
import React from "react"

function VillaBagaraLoaderScene({ title = "Villa <b>Bagara</b>", subtitle = "" }) {
    return (
        <div className={`villa-loader-scene-shell`}>
            <h1 className={`villa-loader-title`}
                dangerouslySetInnerHTML={{__html: title}}/>

            <div className={`villa-loader-scene`} aria-hidden="true">
                <div className={`villa-loader-sun`}/>
                <div className={`villa-loader-cloud villa-loader-cloud-left`}/>
                <div className={`villa-loader-cloud villa-loader-cloud-right`}/>

                <div className={`villa-loader-mountain villa-loader-mountain-back`}/>
                <div className={`villa-loader-mountain villa-loader-mountain-mid`}/>
                <div className={`villa-loader-ground`}/>
                <div className={`villa-loader-trail`}/>

                <div className={`villa-loader-tree villa-loader-tree-left`}>
                    <span/>
                    <span/>
                    <span/>
                </div>
                <div className={`villa-loader-tree villa-loader-tree-right`}>
                    <span/>
                    <span/>
                    <span/>
                </div>

                <div className={`villa-loader-house`}>
                    <div className={`villa-loader-house-roof`}/>
                    <div className={`villa-loader-house-body`}>
                        <div className={`villa-loader-house-door`}/>
                        <div className={`villa-loader-house-window villa-loader-house-window-left`}/>
                        <div className={`villa-loader-house-window villa-loader-house-window-right`}/>
                    </div>
                    <div className={`villa-loader-house-chimney`}/>
                    <span className={`villa-loader-smoke villa-loader-smoke-1`}/>
                    <span className={`villa-loader-smoke villa-loader-smoke-2`}/>
                    <span className={`villa-loader-smoke villa-loader-smoke-3`}/>
                </div>

                <div className={`villa-loader-hiker-track`}>
                    <i className={`fa-solid fa-person-hiking villa-loader-hiker`}/>
                </div>
            </div>

            {subtitle && (
                <p className={`villa-loader-subtitle`}
                   dangerouslySetInnerHTML={{__html: subtitle}}/>
            )}
        </div>
    )
}

export default VillaBagaraLoaderScene
