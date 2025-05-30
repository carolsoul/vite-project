import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './' // mantém caminhos relativos para funcionar no deploy estático
})
