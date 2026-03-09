import "./ActivityTicker.scss"
import React from "react"

function ActivityTicker({ strings = [], className = "" }) {
    const items = Array.isArray(strings) ? strings.filter(Boolean) : []

    if(items.length === 0)
        return <></>

    const content = items.join(" - ")
    const durationSeconds = Math.max(16, Math.min(34, Math.round(content.length * 0.22)))

    return (
        <div
            className={`activity-ticker ${className}`}
            style={{ "--activity-ticker-duration": `${durationSeconds}s` }}>
            <div className="activity-ticker-mask">
                <div className="activity-ticker-track">
                    <span className="activity-ticker-line">{content} - </span>
                    <span className="activity-ticker-line" aria-hidden="true">{content} - </span>
                </div>
            </div>
        </div>
    )
}

export default ActivityTicker
