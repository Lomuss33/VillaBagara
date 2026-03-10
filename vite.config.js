import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''
const isUserPagesRepository = repositoryName.toLowerCase().endsWith('.github.io')
const base = process.env.VITE_BASE_PATH
    || (process.env.GITHUB_ACTIONS
        ? (isUserPagesRepository ? '/' : `/${repositoryName}/`)
        : '/')

// https://vitejs.dev/config/
export default defineConfig({
    base,
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Split the swiper plugin library into a separate chunk to avoid a large chunk size on index.js
                        if (id.includes('swiper'))
                            return 'swiper';
                        return;
                    }
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["mixed-decls", "color-functions", "global-builtin", "import"],
            },
        },
    },
})
