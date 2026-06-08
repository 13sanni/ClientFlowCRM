import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'
import authRoutes from './modules/auth/auth.routes.js'
import clientRoutes from './modules/clients/client.routes.js'
import dealRoutes from './modules/deals/deal.routes.js'
import invoiceRoutes from './modules/invoices/invoice.routes.js'
import taskRoutes from './modules/tasks/task.routes.js'
import healthRoutes from './routes/health.routes.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.use('/api/auth', authRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/deals', dealRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/health', healthRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
