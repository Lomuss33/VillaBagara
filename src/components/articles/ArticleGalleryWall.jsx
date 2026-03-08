import "./ArticleGalleryWall.scss"
import React, {useState} from "react"
import Article from "/src/components/articles/base/Article.jsx"
import Link from "/src/components/generic/Link.jsx"
import ImageView from "/src/components/generic/ImageView.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"

function ArticleGalleryWall({ dataWrapper }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

    return (
        <Article id={dataWrapper.uniqueId}
                 type={Article.Types.SPACING_DEFAULT}
                 dataWrapper={dataWrapper}
                 className={`article-gallery-wall`}
                 selectedItemCategoryId={selectedItemCategoryId}
                 setSelectedItemCategoryId={setSelectedItemCategoryId}>
            <ArticleGalleryWallItems dataWrapper={dataWrapper}
                                     selectedItemCategoryId={selectedItemCategoryId}/>
        </Article>
    )
}

function ArticleGalleryWallItems({ dataWrapper, selectedItemCategoryId }) {
    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)

    return (
        <div className={`article-gallery-wall-grid`}>
            {filteredItems.map((itemWrapper, key) => (
                <ArticleGalleryWallItem itemWrapper={itemWrapper}
                                        key={key}/>
            ))}
        </div>
    )
}

function ArticleGalleryWallItem({ itemWrapper }) {
    const language = useLanguage()
    const screenshots = itemWrapper.preview?.screenshots?.length ?
        itemWrapper.preview.screenshots :
        [itemWrapper.img].filter(Boolean)

    const metadata = {
        title: itemWrapper.locales.title || itemWrapper.imageAlt,
        images: screenshots,
        aspectRatio: itemWrapper.preview?.screenshotsAspectRatio || "16:9"
    }

    return (
        <Link href={`#gallery:open`}
              metadata={metadata}
              tooltip={language.getString("open_gallery")}
              className={`article-gallery-wall-item`}>
            <ImageView src={itemWrapper.img}
                       alt={itemWrapper.imageAlt}
                       className={`article-gallery-wall-image-view`}/>

            {itemWrapper.locales.title && (
                <div className={`article-gallery-wall-caption text-3`}
                     dangerouslySetInnerHTML={{__html: itemWrapper.locales.title}}/>
            )}
        </Link>
    )
}

export default ArticleGalleryWall
