import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In production Vercel runs api/*.js as serverless functions. The dev server doesn't,
// so this plugin mounts the same handler at the same path — one code path, no drift,
// and no need for the Vercel CLI just to test locally.
function apiRoutes(env) {
  return {
    name: 'ecoscan-api-routes',
    configureServer(server) {
      server.middlewares.use('/api/identify', async (req, res) => {
        // The handler reads the key from process.env; in dev that comes from .env via
        // loadEnv, which (unlike import.meta.env) never reaches the client bundle.
        // Guard the assignment: process.env stringifies values, so setting it from an
        // absent var yields the truthy string "undefined" and defeats the missing-key check.
        if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY

        const send = (status, payload) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}

          // Re-import each time so edits to the handler hot-reload in dev.
          const { default: handler } = await server.ssrLoadModule('/api/identify.js')

          await handler(
            { method: req.method, body },
            { status: (code) => ({ json: (payload) => send(code, payload) }) },
          )
        } catch (error) {
          console.error('[dev api]', error)
          send(500, { error: 'Local API handler crashed. See the terminal for details.' })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Third arg '' loads every var, not just VITE_-prefixed ones. These stay server-side.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiRoutes(env)],
  }
})
