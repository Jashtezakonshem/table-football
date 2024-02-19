import { Router, WebApp } from 'https://deno.land/x/denorest@v3.1/mod.ts'
import { defaultHeaders } from './utils/constants.ts'

const app = new WebApp()
app.headers(defaultHeaders)
const router = new Router()
export { app, router }
