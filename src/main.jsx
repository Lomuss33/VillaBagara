import "/src/styles/app.scss"
import {StrictMode, useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {useApi} from "/src/hooks/api.js"
import {useConstants} from "/src/hooks/constants.js"
import {useUtils} from "/src/hooks/utils.js"
import Preloader from "/src/components/loaders/Preloader.jsx"
import StartupScreen from "/src/components/loaders/StartupScreen.jsx"
import DataProvider, {useData} from "/src/providers/DataProvider.jsx"
import LanguageProvider from "/src/providers/LanguageProvider.jsx"
import ViewportProvider from "/src/providers/ViewportProvider.jsx"
import ThemeProvider from "/src/providers/ThemeProvider.jsx"
import LocationProvider from "/src/providers/LocationProvider.jsx"
import FeedbacksProvider from "/src/providers/FeedbacksProvider.jsx"
import InputProvider from "/src/providers/InputProvider.jsx"
import NavigationProvider from "/src/providers/NavigationProvider.jsx"
import Portfolio from "/src/components/Portfolio.jsx"

/**
 * This is the main app component. It wraps the content of the app with AppEssentialsWrapper and AppCapabilitiesWrapper.
 * @return {JSX.Element}
 * @constructor
 */
const App = () => {
    return (
        <AppEssentialsWrapper>
            <AppCapabilitiesWrapper>
                <Portfolio/>
            </AppCapabilitiesWrapper>
        </AppEssentialsWrapper>
    )
}

/**
 * This stack will wrap the entire app - these are considered essential components for the app booting up.
 * @param children
 * @return {JSX.Element}
 * @constructor
 */
const AppEssentialsWrapper = ({children}) => {
    const api = useApi()
    const utils = useUtils()
    const constants = useConstants()

    const [settings, setSettings] = useState(null)
    const [startupError, setStartupError] = useState("")

    useEffect(() => {
        let isMounted = true

        const bootstrapApplication = async() => {
            const baseUrl = utils.file.BASE_URL || "/"
            if(window.location.pathname !== baseUrl) {
                window.history.replaceState({}, '', `${baseUrl}${window.location.search}${window.location.hash}`)
            }

            const response = await utils.file.loadJSON("data/settings.json")
            if(!isMounted)
                return

            if(!response) {
                setStartupError("The site settings could not be loaded. Check the deployed base path and the public data files.")
                return
            }

            const preparedSettings = _applyDeveloperSettings(response)
            setSettings(preparedSettings)

            const consoleMessageForDevelopers = preparedSettings?.consoleMessageForDevelopers
            if(consoleMessageForDevelopers) {
                const primaryColor = utils.css.getRootSCSSVariable('--bs-primary')
                utils.log.info(consoleMessageForDevelopers.title, consoleMessageForDevelopers.items, primaryColor)
            }
        }

        bootstrapApplication().catch(() => {
            if(!isMounted)
                return
            setStartupError("Villa Bagara could not finish booting.")
        })

        api.analytics.reportVisit().catch(() => {})

        return () => {
            isMounted = false
        }
    }, [])

    const _applyDeveloperSettings = (settings) => {
        const developerSettings = settings?.developerSettings
        const debugMode = developerSettings?.debugMode
        const fakeEmailRequests = developerSettings?.fakeEmailRequests
        const stayOnThePreloaderScreen = developerSettings?.stayOnThePreloaderScreen

        if(constants.PRODUCTION_MODE)
            return settings

        if(debugMode) {
            settings.preloaderSettings.enabled = stayOnThePreloaderScreen
            settings.templateSettings.backgroundStyle = "plain"
            utils.storage.setWindowVariable("suspendAnimations", true)
            utils.log.warn("DataProvider", "Debug Mode is enabled, so transitions and animated content—such as the preloader screen, background animations, and role text typing—will be skipped. You can disable it manually on settings.json or by running the app on PROD_MODE, which disables it by default.")
        }

        if(fakeEmailRequests) {
            utils.storage.setWindowVariable("fakeEmailRequests", true)
            utils.log.warn("DataProvider", "Fake email requests are enabled. This is only for development purposes and will be disabled automatically in production.")
        }

        if(stayOnThePreloaderScreen) {
            utils.storage.setWindowVariable("stayOnThePreloaderScreen", true)
            utils.log.warn("DataProvider", "Preloader screen will be displayed indefinitely because the developer flag 'stayOnThePreloaderScreen' is on. This is only for development purposes and will be disabled automatically in production.")
        }

        return settings
    }

    if(startupError) {
        return (
            <StartupScreen title={"Villa Bagara"}
                           errorMessage={startupError}/>
        )
    }

    if(!settings) {
        return (
            <StartupScreen title={"Villa Bagara"}
                           message={"Loading the site..."}/>
        )
    }

    return (
        <StrictMode>
            <Preloader preloaderSettings={settings["preloaderSettings"]}>
                <DataProvider settings={settings}
                              loadingFallback={<StartupScreen title={"Villa Bagara"}
                                                              message={"Preparing stay details..."} />}>
                    {children}
                </DataProvider>
            </Preloader>
        </StrictMode>
    )
}

/**
 * This stack will wrap the app capabilities - these will be initialized after the app has booted up and loaded its essential components.
 * @param children
 * @return {JSX.Element}
 * @constructor
 */
const AppCapabilitiesWrapper = ({ children }) => {
    const data = useData()

    const [selectedThemeId, setSelectedThemeId] = useState(null)

    const appSettings = data.getSettings()
    const appStrings = data.getStrings()
    const appSections = data.getSections()
    const appCategories = data.getCategories()

    const supportedLanguages = appSettings["supportedLanguages"]
    const supportedThemes = appSettings["supportedThemes"]
    const defaultLanguageId = appSettings["templateSettings"].defaultLanguageId
    const defaultThemeId = appSettings["templateSettings"].defaultThemeId
    const animatedCursorEnabled = appSettings["templateSettings"].animatedCursorEnabled
    const showSpinnerOnThemeChange = appSettings["templateSettings"].showSpinnerOnThemeChange

    return (
        <LanguageProvider supportedLanguages={supportedLanguages}
                          defaultLanguageId={defaultLanguageId}
                          appStrings={appStrings}
                          selectedThemeId={selectedThemeId}>
            <ViewportProvider>
                <InputProvider>
                    <FeedbacksProvider canHaveAnimatedCursor={animatedCursorEnabled}>
                        <ThemeProvider supportedThemes={supportedThemes}
                                       defaultThemeId={defaultThemeId}
                                       showSpinnerOnThemeChange={showSpinnerOnThemeChange}
                                       onThemeChanged={setSelectedThemeId}>
                            <LocationProvider sections={appSections}
                                              categories={appCategories}>
                                <NavigationProvider sections={appSections}
                                                    categories={appCategories}>
                                    {children}
                                </NavigationProvider>
                            </LocationProvider>
                        </ThemeProvider>
                    </FeedbacksProvider>
                </InputProvider>
            </ViewportProvider>
        </LanguageProvider>
    )
}

const container = document.getElementById('root')
if(container) {
    createRoot(container).render(<App/>)
}
