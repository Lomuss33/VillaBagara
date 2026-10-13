import "./VillaBagaraLoaderScene.scss"
import React from "react"

const trailCurves = [
    [[0, 245], [62, 245], [136, 245], [198, 245]],
    [[198, 245], [250, 245], [297, 262], [342, 278]],
    [[342, 278], [402, 299], [453, 260], [508, 230]],
    [[508, 230], [550, 206], [578, 177], [600, 151]],
    [[600, 151], [644, 121], [708, 77], [764, 77]],
]

const landscapeTrees = [
    {left: "5%", bottom: "27%", width: "clamp(20px, 2.7vw, 38px)", height: "clamp(35px, 5.2vw, 74px)", distant: true},
    {left: "12%", bottom: "24%", width: "clamp(24px, 3.2vw, 46px)", height: "clamp(46px, 6.5vw, 94px)"},
    {left: "18%", bottom: "29%", width: "clamp(18px, 2.1vw, 30px)", height: "clamp(30px, 4vw, 58px)", distant: true},
    {left: "24%", bottom: "23%", width: "clamp(26px, 3.6vw, 52px)", height: "clamp(54px, 7.8vw, 112px)"},
    {left: "31%", bottom: "26%", width: "clamp(20px, 2.5vw, 36px)", height: "clamp(36px, 4.9vw, 70px)", distant: true},
    {left: "44%", bottom: "26%", width: "clamp(18px, 2.4vw, 34px)", height: "clamp(34px, 4.7vw, 68px)", distant: true},
    {left: "51%", bottom: "24%", width: "clamp(16px, 2.1vw, 30px)", height: "clamp(28px, 3.9vw, 56px)", distant: true},
    {left: "66%", bottom: "33%", width: "clamp(16px, 1.9vw, 28px)", height: "clamp(28px, 3.8vw, 54px)", distant: true},
    {left: "72%", bottom: "29%", width: "clamp(22px, 2.8vw, 40px)", height: "clamp(38px, 5.4vw, 78px)"},
    {left: "87%", bottom: "21%", width: "clamp(26px, 3.5vw, 50px)", height: "clamp(50px, 7.2vw, 104px)"},
    {left: "93%", bottom: "14%", width: "clamp(28px, 4vw, 58px)", height: "clamp(58px, 8.6vw, 124px)"},
    {left: "80%", bottom: "15%", width: "clamp(28px, 4vw, 58px)", height: "clamp(58px, 8.5vw, 122px)"},
]

function createTrailRibbon(radii) {
    const points = []

    trailCurves.forEach((curve, segment) => {
        for(let step = 0; step <= 16; step++) {
            if(segment > 0 && step === 0) continue

            const t = step / 16
            const inverse = 1 - t
            const [start, controlOne, controlTwo, end] = curve
            const blend = (a, b, c, d) => inverse ** 3 * a + 3 * inverse ** 2 * t * b + 3 * inverse * t ** 2 * c + t ** 3 * d
            points.push({
                x: blend(start[0], controlOne[0], controlTwo[0], end[0]),
                y: blend(start[1], controlOne[1], controlTwo[1], end[1]),
                radius: radii[segment] + (radii[segment + 1] - radii[segment]) * t,
            })
        }
    })

    const left = []
    const right = []
    points.forEach((point, index) => {
        const previous = points[Math.max(0, index - 1)]
        const next = points[Math.min(points.length - 1, index + 1)]
        const dx = next.x - previous.x
        const dy = next.y - previous.y
        const length = Math.hypot(dx, dy) || 1
        const normalX = -dy / length
        const normalY = dx / length
        left.push([point.x + normalX * point.radius, point.y + normalY * point.radius])
        right.push([point.x - normalX * point.radius, point.y - normalY * point.radius])
    })

    const pathPoints = [...left, ...right.reverse()]
    return `M ${pathPoints.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`
}

const trailEdgePath = createTrailRibbon([20, 20, 20, 15, 9, 7])
const trailSurfacePath = createTrailRibbon([16, 16, 16, 11, 6.5, 5])
const trailGravelPath = createTrailRibbon([15, 15, 15, 10, 5.5, 4])

function VillaBagaraLoaderScene({ title = "Villa <b>Bagara</b>", subtitle = "", status = "" }) {
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
                <div className="villa-loader-sea-horizon">
                    <span className="villa-loader-island island-one"/>
                    <span className="villa-loader-island island-two"/>
                    <span className="villa-loader-island island-three"/>
                </div>
                <div className={`villa-loader-ground`}/>
                <div className="villa-loader-mist"/>
                <div className="villa-loader-hill villa-loader-hill-left"/>
                <div className="villa-loader-hill villa-loader-hill-right"/>
                <svg className="villa-loader-trail" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                        <pattern id="loaderRoadGravel" width="26" height="22" patternUnits="userSpaceOnUse">
                            <circle cx="4" cy="5" r="1.1" fill="#e3d6b5" fillOpacity=".3"/>
                            <circle cx="17" cy="13" r=".8" fill="#554f40" fillOpacity=".25"/>
                            <circle cx="10" cy="19" r=".6" fill="#e3d6b5" fillOpacity=".22"/>
                        </pattern>
                    </defs>
                    <path className="villa-loader-trail-edge" d={trailEdgePath}/>
                    <path className="villa-loader-trail-surface" d={trailSurfacePath}/>
                    <path className="villa-loader-trail-gravel" d={trailGravelPath}/>
                    <path className="villa-loader-trail-light" d="M 0 237 C 62 237 136 237 201 237 C 253 238 297 254 345 270 C 404 290 453 252 503 223 C 554 194 574 169 593 145 C 632 108 704 72 760 71"/>
                </svg>
                <div className="villa-loader-village">
                    <span className="villa-loader-village-house village-house-one"/>
                    <span className="villa-loader-village-house village-house-two"/>
                    <span className="villa-loader-village-house village-house-three"/>
                </div>
                <div className="villa-loader-field"/>
                <div className="villa-loader-ruins">
                    <span className="ruin-one"/>
                    <span className="ruin-two"/>
                    <span className="ruin-three"/>
                </div>
                <div className="villa-loader-meadow villa-loader-meadow-left"/>
                <div className="villa-loader-meadow villa-loader-meadow-right"/>

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

                {landscapeTrees.map(({distant, ...position}) => (
                    <div key={position.left}
                         className={`villa-loader-tree ${distant ? "villa-loader-tree-distant" : ""}`}
                         style={position}>
                        <span/>
                        <span/>
                        <span/>
                    </div>
                ))}

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
            {status && <p className="villa-loader-status" role="status">{status}</p>}
        </div>
    )
}

export default VillaBagaraLoaderScene
