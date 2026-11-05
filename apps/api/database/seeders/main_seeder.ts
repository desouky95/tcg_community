import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

const users = [
  {
    email: 'admin@example.com',
    mobile: '1234567890',
    fullName: 'Admin User',
    username: 'admin',
    role: 'admin',
    password: 'password',
  }
]
export default class extends BaseSeeder {
  async run() {


    for (const u of users) {
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
