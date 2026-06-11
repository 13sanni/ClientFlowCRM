import app from './app.js'
import { env } from './config/env.js'
import { prisma } from './lib/prisma.js'

const server = app.listen(env.PORT, () => {
  console.log(`🚀  API running on http://localhost:${env.PORT}  [${env.NODE_ENV}]`)
})

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
async function shutdown(signal: string) {
  console.log(`\n⚡ ${signal} received — shutting down gracefully…`)

  server.close(async () => {
    console.log('✅  HTTP server closed')
    await prisma.$disconnect()
    console.log('✅  Database connection closed')
    process.exit(0)
  })

  // Force kill after 10 seconds if something hangs
  setTimeout(() => {
    console.error('❌  Forced shutdown after timeout')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// ─── Unhandled Error Guards ───────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  shutdown('uncaughtException')
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
  shutdown('unhandledRejection')
})
