import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import WindiCSS from 'vite-plugin-windicss'

const config = defineConfig({
    resolve: {
        alias: {
            '@': `${path.resolve(__dirname, 'src')}`,
            '~api': `${path.resolve(__dirname, 'src/api/index-client.js')}`
        }
    },

    build: {
        minify: true
    },

    plugins: [createVuePlugin(), WindiCSS()],

    server: {
        port: 7770,
        host: '0.0.0.0',
        hot: true,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    }
})

export default config
