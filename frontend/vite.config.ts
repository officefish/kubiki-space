import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default (({ mode } : { mode: string }) => {

  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  
  return defineConfig({
      base: '/community/',
      plugins: [react(),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'), 
         
        },
      },
      build: {
        minify: true,
        cssMinify: true,
      }
    
  })
})
