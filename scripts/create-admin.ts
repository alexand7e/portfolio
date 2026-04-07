import bcrypt from 'bcryptjs'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file before anything else so process.env is populated
config({ path: resolve(process.cwd(), '.env') })

import { prisma } from '../lib/prisma'

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@portfolio.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn('Warning: ADMIN_EMAIL or ADMIN_PASSWORD not found in .env — using fallback defaults.')
  }

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Administrator',
        role: 'ADMIN'
      }
    })

    console.log('Admin user created successfully!')
    console.log('Email:', admin.email)
    console.log('Password:', password)

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
