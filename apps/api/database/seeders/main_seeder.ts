import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import fs from 'node:fs'
import path from 'node:path'

export default class extends BaseSeeder {
  async run() {
    const dbPath = path.join(process.cwd(), '..', 'mock-server', 'db.json')
    if (!fs.existsSync(dbPath)) {
      console.error('db.json not found at', dbPath)
      return
    }

    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))

    for (const u of data.users) {
      await User.create({
        email: u.email || `${u.username}@example.com`,
        mobile: u.mobile,
        fullName: u.fullName,
        username: u.username,
        role: u.role,
        isVerified: true,
        blocked: false,
        password: u.password,
      })
    }
  }
}
