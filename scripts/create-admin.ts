import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@portfolio.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingAdmin) {
      console.log('Admin user already exists!')
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