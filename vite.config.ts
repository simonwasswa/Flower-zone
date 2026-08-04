import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendContactEmail, type ContactPayload } from './server/contact-mail.js'

function contactApiPlugin(apiKey?: string, fromEmail?: string): Plugin {
  return {
    name: 'flower-zone-contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        const chunks: Uint8Array[] = []
        request.on('data', (chunk: Uint8Array) => chunks.push(chunk))
        request.on('end', async () => {
          response.setHeader('Content-Type', 'application/json')
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString()) as ContactPayload
            const result = await sendContactEmail(body, { apiKey, fromEmail })
            response.statusCode = result.ok ? 200 : result.status
            response.end(JSON.stringify(result.ok ? { success: true } : { error: result.error }))
          } catch (error) {
            console.error('Local contact API error:', error)
            response.statusCode = 500
            response.end(JSON.stringify({ error: 'An unexpected error occurred.' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), contactApiPlugin(env.RESEND_API_KEY, env.CONTACT_FROM_EMAIL)],
    server: {
      host: '0.0.0.0',
    },
  }
})
