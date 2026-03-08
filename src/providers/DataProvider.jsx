/**
 * @author Lovro Music
 * @date 2025-05-10
 * @description This provider is responsible for loading and providing the data for the application.
 */

import React, {createContext, useContext, useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"

function DataProvider({ children, settings }) {
    const utils = useUtils()

    const DataProviderStatus = {
        STATUS_IDLE: "data_provider_status_idle",
        STATUS_PREPARING_FOR_LOADING: "data_provider_status_preparing_for_loading",
        STATUS_LOADING: "data_provider_status_loading",
        STATUS_LOADED: "data_provider_status_loaded",
        STATUS_EVALUATED: "data_provider_status_evaluated",
        STATUS_FAILED: "data_provider_status_failed",
    }

    const [status, setStatus] = useState(DataProviderStatus.STATUS_IDLE)
    const [jsonData, setJsonData] = useState({})
    const [errorMessage, setErrorMessage] = useState(null)

    /** @constructs **/
    useEffect(() => {
        if(status !== DataProviderStatus.STATUS_IDLE)
            return

        setStatus(DataProviderStatus.STATUS_PREPARING_FOR_LOADING)
    }, [null])

    /** @listens DataProviderStatus.STATUS_PREPARING_FOR_LOADING **/
    useEffect(() => {
        if(status !== DataProviderStatus.STATUS_PREPARING_FOR_LOADING)
            return

        setJsonData({})

        setStatus(DataProviderStatus.STATUS_LOADING)
    }, [status === DataProviderStatus.STATUS_PREPARING_FOR_LOADING])

    /** @listens DataProviderStatus.STATUS_LOADING **/
    useEffect(() => {
        if(status !== DataProviderStatus.STATUS_LOADING)
            return

        _loadData().then(response => {
            if(!response?.success) {
                setErrorMessage(response?.message || "Failed to load application data.")
                setStatus(DataProviderStatus.STATUS_FAILED)
                return
            }

            setErrorMessage(null)
            setJsonData(response.data)
            setStatus(DataProviderStatus.STATUS_LOADED)
        })
    }, [status === DataProviderStatus.STATUS_LOADING])

    /** @listens DataProviderStatus.STATUS_LOADED **/
    useEffect(() => {
        if(status !== DataProviderStatus.STATUS_LOADED)
            return

        const validation = _validateData()
        if(!validation.success) {
            setErrorMessage(validation.message)
            setStatus(DataProviderStatus.STATUS_FAILED)
            return
        }

        setStatus(DataProviderStatus.STATUS_EVALUATED)
    }, [status === DataProviderStatus.STATUS_LOADED])

    const _loadData = async () => {
        const jStrings = await utils.file.loadJSON("/data/strings.json")
        const jProfile = await utils.file.loadJSON("/data/profile.json")
        const jCategories = await utils.file.loadJSON("/data/categories.json")
        const jSections = await utils.file.loadJSON("/data/sections.json")

        if(!jStrings || !jProfile || !jCategories || !jSections) {
            return {
                success: false,
                message: "Failed to load one or more required JSON data files."
            }
        }

        const categories = Array.isArray(jCategories.categories) ? jCategories.categories : null
        const sections = Array.isArray(jSections.sections) ? jSections.sections : null
        if(!categories || !sections) {
            return {
                success: false,
                message: "The categories.json or sections.json schema is invalid."
            }
        }

        const binding = _bindCategoriesAndSections(categories, sections)
        if(!binding.success) {
            return binding
        }

        const sectionDataLoad = await _loadSectionsData(sections)
        if(!sectionDataLoad.success) {
            return sectionDataLoad
        }

        return {
            success: true,
            data: {
                strings: jStrings,
                profile: jProfile,
                settings: settings,
                sections: sections,
                categories: categories
            }
        }
    }

    const _bindCategoriesAndSections = (categories, sections) => {
        for(const category of categories) {
            category.sections = []
        }

        for(const section of sections) {
            const sectionCategoryId = section["categoryId"]
            const sectionCategory = categories.find(category => category.id === sectionCategoryId)
            if(!sectionCategory) {
                return {
                    success: false,
                    message: `Section with id "${section.id}" has invalid category id "${sectionCategoryId}". Make sure the category exists within categories.json.`
                }
            }

            sectionCategory.sections.push(section)
            section.category = sectionCategory
        }

        return {success: true}
    }

    const _loadSectionsData = async (sections) => {
        for(const section of sections) {
            const sectionJsonPath = section.jsonPath
            if(sectionJsonPath) {
                const jSectionData = await utils.file.loadJSON(sectionJsonPath)
                if(!jSectionData) {
                    return {
                        success: false,
                        message: `Failed to load section data from "${sectionJsonPath}".`
                    }
                }

                section.data = jSectionData
            }
        }

        return {success: true}
    }

    const _validateData = () => {
        if(!Array.isArray(jsonData.categories) || !Array.isArray(jsonData.sections)) {
            return {
                success: false,
                message: "Loaded application data is incomplete."
            }
        }

        const emptyCategories = jsonData.categories.filter(category => category.sections.length === 0)
        const emptyCategoriesIds = emptyCategories.map(category => category.id)
        if(emptyCategories.length > 0) {
            return {
                success: false,
                message: `The following ${emptyCategories.length} categories are empty: "${emptyCategoriesIds}". Make sure all categories have at least one section.`
            }
        }

        return {success: true}
    }

    const getProfile = () => {
        return jsonData?.profile || {}
    }

    const getSettings = () => {
        return jsonData?.settings || {}
    }

    const getStrings = () => {
        return jsonData?.strings || {}
    }

    const getSections = () => {
        return jsonData?.sections || []
    }

    const getCategories = () => {
        return jsonData?.categories || []
    }

    return (
        <DataContext.Provider value={{
            getProfile,
            getSettings,
            getStrings,
            getSections,
            getCategories
        }}>
            {status === DataProviderStatus.STATUS_EVALUATED && (
                <>{children}</>
            )}

            {status === DataProviderStatus.STATUS_FAILED && (
                <div className={`layout-content d-flex align-items-center justify-content-center min-vh-100 p-4`}>
                    <div className={`text-center`}>
                        <h2 className={`mb-3`}>Villa Bagara</h2>
                        <p className={`mb-0`}>{errorMessage || "The site could not finish loading."}</p>
                    </div>
                </div>
            )}
        </DataContext.Provider>
    )
}

const DataContext = createContext(null)
/**
 * @return {{
 *    getProfile: Function,
 *    getSettings: Function,
 *    getStrings: Function,
 *    getSections: Function,
 *    getCategories: Function
 * }}
 */
export const useData = () => useContext(DataContext)

export default DataProvider
