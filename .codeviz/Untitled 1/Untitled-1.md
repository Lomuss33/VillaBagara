# Unnamed CodeViz Diagram

```mermaid
graph TD

    base.cv::user["**End User**<br>[External]"]
    base.cv::emailjs["**EmailJS**<br>package.json `@emailjs/browser`"]
    subgraph base.cv::frontend["**VillaBagara Frontend**<br>package.json `"name": "react-portfolio-by-lovro-music"`, src/main.jsx `ReactDOM.createRoot(document.getElementById('root'))`"]
        subgraph base.cv::webApp["**Browser Application**<br>index.html `<!DOCTYPE html>`, src/main.jsx `ReactDOM.createRoot(`"]
            base.cv::uiComponents["**UI Components**<br>src/components/Portfolio.jsx `const Portfolio = () => {`, src/components/buttons/StandardButton.jsx `const StandardButton = ({`"]
            base.cv::hooks["**Hooks**<br>src/hooks/api.js `import { useEffect, useState } from 'react';`, src/hooks/utils.js `export function useDebounce(value, delay) {`"]
            base.cv::providers["**Providers**<br>src/providers/DataProvider.jsx `const DataProvider = ({ children }) => {`, src/providers/LanguageProvider.jsx `const LanguageProvider = ({ children }) => {`"]
            %% Edges at this level (grouped by source)
            base.cv::providers["**Providers**<br>src/providers/DataProvider.jsx `const DataProvider = ({ children }) => {`, src/providers/LanguageProvider.jsx `const LanguageProvider = ({ children }) => {`"] -->|"Provides state/context to"| base.cv::uiComponents["**UI Components**<br>src/components/Portfolio.jsx `const Portfolio = () => {`, src/components/buttons/StandardButton.jsx `const StandardButton = ({`"]
            base.cv::providers["**Providers**<br>src/providers/DataProvider.jsx `const DataProvider = ({ children }) => {`, src/providers/LanguageProvider.jsx `const LanguageProvider = ({ children }) => {`"] -->|"Provides state/context to"| base.cv::hooks["**Hooks**<br>src/hooks/api.js `import { useEffect, useState } from 'react';`, src/hooks/utils.js `export function useDebounce(value, delay) {`"]
            base.cv::hooks["**Hooks**<br>src/hooks/api.js `import { useEffect, useState } from 'react';`, src/hooks/utils.js `export function useDebounce(value, delay) {`"] -->|"Provides reusable logic to"| base.cv::uiComponents["**UI Components**<br>src/components/Portfolio.jsx `const Portfolio = () => {`, src/components/buttons/StandardButton.jsx `const StandardButton = ({`"]
        end
        subgraph base.cv::webServer["**Web Server**<br>vite.config.js `export default defineConfig`"]
            base.cv::staticFileHandler["**Static File Handler**<br>vite.config.js `base: '/'`, index.html `<!DOCTYPE html>`"]
            base.cv::requestRouting["**Request Routing**<br>vite.config.js `server: {`"]
            %% Edges at this level (grouped by source)
            base.cv::requestRouting["**Request Routing**<br>vite.config.js `server: {`"] -->|"Directs requests to"| base.cv::staticFileHandler["**Static File Handler**<br>vite.config.js `base: '/'`, index.html `<!DOCTYPE html>`"]
        end
        %% Edges at this level (grouped by source)
        base.cv::staticFileHandler["**Static File Handler**<br>vite.config.js `base: '/'`, index.html `<!DOCTYPE html>`"] -->|"Serves"| base.cv::webApp["**Browser Application**<br>index.html `<!DOCTYPE html>`, src/main.jsx `ReactDOM.createRoot(`"]
    end
    subgraph base.cv::staticData["**Static Data Storage**<br>public/data/profile.json `{ "name": "Lovro" }`, public/data/sections.json `[ { "name": "home" } ]`, public/data/strings.json `"welcome": "Welcome to VillaBagara"`"]
        base.cv::imageAssets["**Image Assets**<br>public/images/flags/en-us.png, public/images/villa_bagara/hero/Midena.jpg"]
        subgraph base.cv::jsonFileRepo["**JSON File Repository**<br>public/data/ `categories.json`"]
            base.cv::rootJsonFiles["**Root JSON Files**<br>public/data/profile.json `{ "name": "Lovro" }`, public/data/settings.json `"theme": "light"`"]
            base.cv::sectionJsonFiles["**Section JSON Files**<br>public/data/sections/home.json `{ "hero": "welcome" }`, public/data/sections/book.json `"title": "Book Your Stay"`"]
        end
    end
    %% Edges at this level (grouped by source)
    base.cv::user["**End User**<br>[External]"] -->|"Accesses"| base.cv::requestRouting["**Request Routing**<br>vite.config.js `server: {`"]
    base.cv::staticFileHandler["**Static File Handler**<br>vite.config.js `base: '/'`, index.html `<!DOCTYPE html>`"] -->|"Serves content from"| base.cv::rootJsonFiles["**Root JSON Files**<br>public/data/profile.json `{ "name": "Lovro" }`, public/data/settings.json `"theme": "light"`"]
    base.cv::staticFileHandler["**Static File Handler**<br>vite.config.js `base: '/'`, index.html `<!DOCTYPE html>`"] -->|"Serves content from"| base.cv::sectionJsonFiles["**Section JSON Files**<br>public/data/sections/home.json `{ "hero": "welcome" }`, public/data/sections/book.json `"title": "Book Your Stay"`"]
    base.cv::staticFileHandler["**Static File Handler**<br>vite.config.js `base: '/'`, index.html `<!DOCTYPE html>`"] -->|"Serves content from"| base.cv::imageAssets["**Image Assets**<br>public/images/flags/en-us.png, public/images/villa_bagara/hero/Midena.jpg"]
    base.cv::providers["**Providers**<br>src/providers/DataProvider.jsx `const DataProvider = ({ children }) => {`, src/providers/LanguageProvider.jsx `const LanguageProvider = ({ children }) => {`"] -->|"Retrieves data from"| base.cv::rootJsonFiles["**Root JSON Files**<br>public/data/profile.json `{ "name": "Lovro" }`, public/data/settings.json `"theme": "light"`"]
    base.cv::providers["**Providers**<br>src/providers/DataProvider.jsx `const DataProvider = ({ children }) => {`, src/providers/LanguageProvider.jsx `const LanguageProvider = ({ children }) => {`"] -->|"Retrieves data from"| base.cv::sectionJsonFiles["**Section JSON Files**<br>public/data/sections/home.json `{ "hero": "welcome" }`, public/data/sections/book.json `"title": "Book Your Stay"`"]

```
---
*Generated by [CodeViz.ai](https://codeviz.ai) on 2/13/2026, 5:31:44 PM*
