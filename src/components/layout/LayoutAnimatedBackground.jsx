import "./LayoutAnimatedBackground.scss"
import React, {useEffect, useRef} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import Animable from "/src/components/capabilities/Animable.jsx"

function LayoutAnimatedBackground() {
    const utils = useUtils()
    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const circlesRef = useRef([])
    const viewportRef = useRef({
        width: window.innerWidth,
        height: window.innerHeight
    })

    const maxCircles = 24

    const visibilityClass = utils.device.isAndroid() && !utils.device.isChromeAndroid() ?
        `d-none` :
        ``

    useEffect(() => {
        contextRef.current = canvasRef.current?.getContext("2d") || null
        _resizeCanvas()
        circlesRef.current = Array.from(
            { length: maxCircles },
            () => new CircleData(() => viewportRef.current, utils)
        )

        const onResize = () => {
            viewportRef.current = {
                width: window.innerWidth,
                height: window.innerHeight
            }
            _resizeCanvas()
        }

        window.addEventListener("resize", onResize)
        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [])

    const _resizeCanvas = () => {
        const canvas = canvasRef.current
        const context = contextRef.current || canvas?.getContext("2d")
        if(!canvas || !context)
            return

        const { width, height } = viewportRef.current
        const pixelRatio = window.devicePixelRatio || 1
        const scaledWidth = Math.max(Math.floor(width * pixelRatio), 1)
        const scaledHeight = Math.max(Math.floor(height * pixelRatio), 1)

        if(canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
            canvas.width = scaledWidth
            canvas.height = scaledHeight
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
        }

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        contextRef.current = context
    }

    const _step = (event) => {
        const circles = circlesRef.current
        if(!circles.length)
            return

        for(const circle of circles) {
            circle.update(event.currentTickElapsed / 0.017)
        }

        _draw(circles)
    }

    const _draw = (updatedCircles) => {
        const canvas = canvasRef.current
        const context = contextRef.current
        if(!canvas || !context)
            return

        const { width, height } = viewportRef.current
        const backgroundColor = utils.css.getRootSCSSVariable("--theme-background")
        const circleColorLight = utils.css.getRootSCSSVariable("--theme-background-contrast")
        const circleColorDark = utils.css.getRootSCSSVariable("--theme-background-contrast-darken")

        context.clearRect(0, 0, width, height)
        context.fillStyle = utils.css.hexToRgba(backgroundColor, 1)
        context.fillRect(0, 0, width, height)

        updatedCircles
            .filter(circle => circle.color === "dark")
            .forEach(circle => {
                context.beginPath()
                context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
                context.fillStyle = utils.css.hexToRgba(circleColorDark, circle.opacity / 2)
                context.fill()
            })

        updatedCircles
            .filter(circle => circle.color !== "dark")
            .forEach(circle => {
                context.beginPath()
                context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
                context.fillStyle = utils.css.hexToRgba(circleColorLight, circle.opacity / 2)
                context.fill()
            })
    }

    return (
        <Animable className={`layout-animated-background ${visibilityClass}`}
                  animationId={`layout-animated-background`}
                  onEnterFrame={_step}>
            <canvas ref={canvasRef}
                    id={`layout-animated-background-canvas`}/>
        </Animable>
    )
}

class CircleData {
    constructor(getViewport, utils) {
        this.getViewport = getViewport
        this.utils = utils
        this.reset()
        this.didEnter = true
    }

    randomizeProps() {
        const { width, height } = this.getViewport()
        const baseSize = Math.max(width, height, 1)
        this.radius = this.utils.number.random(baseSize / 24, baseSize / 8)
        this.speedX = this.utils.number.random(3, 10, true)
        this.speedY = this.utils.number.random(2, 5, true)
        this.color = Math.random() > 0.5 ? "dark" : "light"
        this.opacity = 0.1 + Math.random() * 0.9
    }

    update(dt) {
        this.x += this.speedX / 2 * dt
        this.y += this.speedY / 2 * dt

        const outOfBounds = this.isOutOfBounds()
        if(!this.didEnter) {
            this.didEnter = outOfBounds
        }
        else if(outOfBounds) {
            this.reset()
        }
    }

    isOutOfBounds() {
        const { width, height } = this.getViewport()
        return (
            this.x + this.radius * 2 < 0 ||
            this.x - this.radius * 2 > width ||
            this.y + this.radius * 2 < 0 ||
            this.y - this.radius * 2 > height
        )
    }

    reset() {
        this.randomizeProps()

        const { width, height } = this.getViewport()
        const direction = this.utils.number.random(0, 3)

        switch (direction) {
            case 0:
                this.x = -this.radius * 2
                this.y = this.utils.number.random(0, height)
                this.speedX = Math.abs(this.speedX)
                break
            case 1:
                this.x = width + this.radius * 2
                this.y = this.utils.number.random(0, height)
                this.speedX = -1 * Math.abs(this.speedX)
                break
            case 2:
                this.x = this.utils.number.random(0, width)
                this.y = -this.radius * 2
                this.speedY = Math.abs(this.speedY)
                break
            default:
                this.x = this.utils.number.random(0, width)
                this.y = height + this.radius * 2
                this.speedY = -1 * Math.abs(this.speedY)
                break
        }

        this.didEnter = false
    }
}

export default LayoutAnimatedBackground
