import "./ModalWrapper.scss"
import React, {createContext, useContext, useEffect, useRef, useState} from 'react'
import Modal from 'bootstrap/js/src/modal'
import CircularButton from "/src/components/buttons/CircularButton.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"

const ModalTitleContext = createContext(null)
const openDialogs = new Set()
let backgroundWasInert = false

function setBackgroundInert(element, active) {
    const background = document.getElementById("react-portfolio")
    if(active) {
        if(!openDialogs.size) backgroundWasInert = background?.hasAttribute("inert") || false
        openDialogs.add(element)
        background?.setAttribute("inert", "")
    } else if(openDialogs.delete(element) && !openDialogs.size && !backgroundWasInert) {
        background?.removeAttribute("inert")
    }
}

function ModalWrapper({ children, id = "", shouldDismiss, onDismiss, onRequestClose = null,
    className = "", dialogClassName = "" }) {
    const elementRef = useRef(null)
    const instanceRef = useRef(null)
    const invokerRef = useRef(null)
    const callbacksRef = useRef({onDismiss, onRequestClose, shouldDismiss})
    const [open, setOpen] = useState(false)
    const titleId = id + "-title"
    // Bootstrap owns focus/backdrop; synchronous visibility avoids stale fade callbacks.
    const classes = className.split(" ").filter(name => name !== "fade").join(" ")

    useEffect(() => {
        callbacksRef.current = {onDismiss, onRequestClose, shouldDismiss}
    }, [onDismiss, onRequestClose, shouldDismiss])

    useEffect(() => {
        const element = elementRef.current
        if(!element) return
        if(!invokerRef.current) invokerRef.current = document.activeElement
        const savedScrollY = window.scrollY
        let disposing = false
        const instance = new Modal(element, {backdrop: true, keyboard: true, focus: true})
        instanceRef.current = instance

        const onShown = () => {
            if(disposing) return
            setOpen(true)
            const initialFocus = element.querySelector("[data-dialog-close]") || element
            initialFocus.focus({preventScroll: true})
        }
        const onHide = () => {
            if(element.contains(document.activeElement)) document.activeElement.blur()
            if(disposing) return
            setOpen(false)
            if(!callbacksRef.current.shouldDismiss) callbacksRef.current.onRequestClose?.()
        }
        const onHidden = () => {
            setBackgroundInert(element, false)
            if(disposing) return
            window.scrollTo({top: savedScrollY, behavior: "instant"})
            const invoker = invokerRef.current
            callbacksRef.current.onDismiss?.()
            requestAnimationFrame(() => {
                if(invoker?.isConnected && !invoker.closest("[inert]")) {
                    invoker.focus({preventScroll: true})
                } else if(!openDialogs.size) {
                    document.querySelector(".section-shown .section-header-title")?.focus({preventScroll: true})
                }
            })
        }

        const onKeyDown = event => {
            if(event.key !== "Tab") return
            const controls = [...element.querySelectorAll('a[href], button, input, select, textarea, iframe, [tabindex]')]
                .filter(control => control.tabIndex >= 0 && !control.disabled && !control.closest("[inert]") &&
                    control.getClientRects().length && getComputedStyle(control).visibility !== "hidden")
            const first = controls[0] || element
            const last = controls[controls.length - 1] || element
            const active = document.activeElement
            // Keep boundary Tab presses in the dialog, including a one-button photo viewer.
            if(!controls.length || !controls.includes(active) ||
                (event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
                event.preventDefault()
                const target = event.shiftKey ? last : first
                target.focus({preventScroll: true})
            }
        }

        element.addEventListener("shown.bs.modal", onShown)
        element.addEventListener("hide.bs.modal", onHide)
        element.addEventListener("hidden.bs.modal", onHidden)
        element.addEventListener("keydown", onKeyDown)
        setBackgroundInert(element, true)
        instance.show()

        return () => {
            disposing = true
            element.removeEventListener("shown.bs.modal", onShown)
            element.removeEventListener("hide.bs.modal", onHide)
            element.removeEventListener("hidden.bs.modal", onHidden)
            element.removeEventListener("keydown", onKeyDown)
            if(element.contains(document.activeElement)) document.activeElement.blur()
            instance.hide()
            instance.dispose()
            setBackgroundInert(element, false)
            instanceRef.current = null
        }
    }, [id])

    useEffect(() => {
        if(shouldDismiss) instanceRef.current?.hide()
    }, [shouldDismiss])

    useEffect(() => {
        if(!open || shouldDismiss) return
        // Responsive gallery layouts may remove the control that held focus.
        if(document.activeElement === document.body || document.activeElement === document.documentElement) {
            elementRef.current?.querySelector('[data-dialog-close]')?.focus({preventScroll: true})
        }
    }, [children, open, shouldDismiss])

    return (
        <ModalTitleContext.Provider value={titleId}>
            <div ref={elementRef} id={id} className={'modal ' + (open ? 'show ' : '') + classes}
                 role="dialog" aria-labelledby={titleId} tabIndex={-1}>
                <div className={'modal-dialog ' + dialogClassName}>
                    <div className="modal-content">{children}</div>
                </div>
            </div>
        </ModalTitleContext.Provider>
    )
}

function ModalWrapperTitle({ title, faIcon, onClose, tooltip }) {
    const language = useLanguage()
    const titleId = useContext(ModalTitleContext)

    return (
        <div className="modal-header">
            <h4 id={titleId} className="modal-title fw-bold">
                <i className={faIcon + ' me-2 me-xl-3 text-primary'} aria-hidden="true"/>
                <span dangerouslySetInnerHTML={{__html: title}}/>
            </h4>
            {onClose && (
                <CircularButton onClick={onClose} faIcon="fa-solid fa-xmark" data-dialog-close=""
                                size={CircularButton.Sizes.LARGE} variant={CircularButton.Variants.DEFAULT}
                                ariaLabel={language.getString("close_window")}
                                tooltip={tooltip || language.getString("close_window")}/>
            )}
        </div>
    )
}

function ModalWrapperBody({ children, className = "" }) {
    return <div className={'modal-body ' + className}>{children}</div>
}

function ModalWrapperFooterDescription({ title, description, faIcon }) {
    return (
        <div className="modal-footer">
            <h6 className="modal-footer-title text-default">
                <i className={faIcon + ' text-primary me-2 eq-h5'} aria-hidden="true"/>
                <span className="fw-bold" dangerouslySetInnerHTML={{__html: title}}/>
            </h6>
            <div className="modal-footer-description text-1" dangerouslySetInnerHTML={{__html: description}}/>
        </div>
    )
}

export {ModalWrapper, ModalWrapperTitle, ModalWrapperBody, ModalWrapperFooterDescription}
