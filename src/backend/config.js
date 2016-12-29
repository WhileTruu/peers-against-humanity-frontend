import fs from 'fs'
import path from 'path'

export const PORT = process.env.PORT || 8080

export const SECRET = fs.readFileSync(path.join(__dirname, 'secret'))
