import "./GalleryModal.scss"
import React, {useEffect, useState} from 'react'
import {ModalWrapper, ModalWrapperTitle, ModalWrapperBody} from "/src/components/modals/base/ModalWrapper"
import { Swiper, SwiperSlide } from 'swiper/react'
import {A11y, Pagination} from "swiper/modules"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useScheduler} from "/src/hooks/scheduler.js"
import {Spinner} from "react-bootstrap"

function GalleryModal({ target, onDismiss }) {
    const utils = useUtils()
    const viewport = useViewport()
    const scheduler = useScheduler()

    const tag = "gallery-modal"
    const images = target?.images
    const type = target?.type
    const title = target?.title
    const isMobile = !viewport.isBreakpoint("lg")

    const [didLoadAllImages, setDidLoadAllImages] = useState(false)
    const [shouldDismiss, setShouldDismiss] = useState(false)

    const modalCustomClass = !didLoadAllImages ? `gallery-modal-loading` : ``

    useEffect(() => {
        setDidLoadAllImages(false)
        if(!images || !images.length) {
            scheduler.clearAllWithTag(tag)
            return
        }

        scheduler.clearAllWithTag(tag)
        scheduler.interval(() => {
            const isReady = utils.dom.didLoadImagesWithQuerySelector(".swiper-image")
            if(!isReady)
                return

            scheduler.clearAllWithTag(tag)
            setDidLoadAllImages(true)
        }, 500, tag)
    }, [images])

    useEffect(() => {
        setShouldDismiss(false)
    }, [target])

    if(!target)
        return <></>

    const parameters = utils.array.withId([
        { id: "9:16",   suffix: "portrait",     direction: "horizontal" },
        { id: "16:9",   suffix: "landscape",    direction: isMobile ? "vertical" : "horizontal" },
        { id: "1:1",    suffix: "default",      direction: isMobile ? "vertical" : "horizontal" },
    ], type, "default")

    const visibilityClassName = didLoadAllImages ?
        `visible` :
        `invisible`

    const _onClose = () => {
        setShouldDismiss(true)
    }

    return (
        <ModalWrapper id={`gallery-modal`}
                      className={`${modalCustomClass} gallery-modal-${parameters.direction}`}
                      dialogClassName={`modal-fullscreen`}
                      shouldDismiss={shouldDismiss}
                      onDismiss={onDismiss}>
            <ModalWrapperTitle title={title}
                               faIcon={`fa-regular fa-image`}
                               onClose={_onClose}/>

            <ModalWrapperBody className={`gallery-modal-body`}>
                {parameters.direction === "horizontal" && (
                    <GalleryModalSwiper className={visibilityClassName}
                                        images={images}
                                        title={title}
                                        type={parameters.suffix}/>
                )}

                {parameters.direction === "vertical" && (
                    <GalleryModalImageStack className={visibilityClassName}
                                            title={title}
                                            images={images}/>
                )}

                {!didLoadAllImages && (
                    <GalleryModalSpinner/>
                )}
            </ModalWrapperBody>
        </ModalWrapper>
    )
}

function GalleryModalSwiper({ className, images, type, title }) {
    const utils = useUtils()
    const language = useLanguage()
    const [swiper, setSwiper] = useState(null)
    const [index, setIndex] = useState(0)
    const [edges, setEdges] = useState({beginning: true, end: true})
    const syncEdges = instance => setEdges(previous => {
        const next = {beginning: instance.isBeginning, end: instance.isEnd}
        return previous.beginning === next.beginning && previous.end === next.end ? previous : next
    })
    const photoLabel = key => language.getString("photo_position")
        .replace('{title}', utils.string.stripHTMLTags(title || language.getString("gallery")))
        .replace('{x}', key + 1).replace('{total}', images.length)

    return (
        <>
        {images.length > 1 && (
            <div className="gallery-keyboard-controls">
                <button type="button" onClick={() => {if(swiper && !swiper.isBeginning) swiper.slidePrev()}} aria-disabled={!swiper || edges.beginning}
                        aria-label={language.getString("previous_photo")}>
                    <i className="fa-solid fa-chevron-left" aria-hidden="true"/>
                </button>
                <span role="status" aria-live="polite" aria-atomic="true">
                    {language.getString("gallery_position").replace('{x}', index + 1).replace('{total}', images.length)}
                </span>
                <button type="button" onClick={() => {if(swiper && !swiper.isEnd) swiper.slideNext()}} aria-disabled={!swiper || edges.end}
                        aria-label={language.getString("next_photo")}>
                    <i className="fa-solid fa-chevron-right" aria-hidden="true"/>
                </button>
            </div>
        )}
        <Swiper slidesPerView={"auto"}
                speed={window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 300}
                onSwiper={instance => {setSwiper(instance); syncEdges(instance)}}
                onSlideChange={instance => {setIndex(instance.activeIndex); syncEdges(instance)}}
                onResize={syncEdges}
                onUpdate={syncEdges}
                a11y={{enabled: true, paginationBulletMessage: language.getString("gallery_position").replace('{x}', '{{index}}').replace('{total}', images.length)}}
                direction={"horizontal"}
                spaceBetween={15}
                pagination={{ clickable: true }}
                modules={[Pagination, A11y]}
                className={`gallery-swiper gallery-swiper-${type} ${className}`}>
            {images.map((image, key) => (
                <SwiperSlide key={key}
                             className={`gallery-swiper-slide`}>
                    <img className={`swiper-image`}
                         alt={photoLabel(key)}
                         src={utils.file.resolvePath(image)}/>
                </SwiperSlide>
            ))}
        </Swiper>
        </>
    )
}

function GalleryModalImageStack({ className, images, title }) {
    const utils = useUtils()
    const language = useLanguage()

    return (
        <div className={`gallery-modal-image-stack ${className}`}>
            {images.map((image, key) => (
                <div key={key}
                     className={`gallery-modal-image-stack-item`}>
                    <img className={`swiper-image`}
                         alt={language.getString("photo_position")
                             .replace('{title}', utils.string.stripHTMLTags(title || language.getString("gallery")))
                             .replace('{x}', key + 1).replace('{total}', images.length)}
                         src={utils.file.resolvePath(image)}/>
                </div>
            ))}
        </div>
    )
}

function GalleryModalSpinner() {
    const language = useLanguage()
    return (
        <div className={`gallery-modal-spinner`}>
            <Spinner role="status"><span className="visually-hidden">{language.getString("loading")}</span></Spinner>
        </div>
    )
}

export default GalleryModal
