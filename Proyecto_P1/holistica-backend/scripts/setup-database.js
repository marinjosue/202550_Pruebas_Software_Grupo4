require('dotenv').config();
const dbManager = require('../config/db');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    console.log('🌐 Backend should be running on http://localhost:3000');
    
    // Wait for database initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test query
    const [testResult] = await dbManager.query('SELECT 1 as test');
    console.log('✅ Database test successful:', testResult);
    
    // Create admin user if not exists
    const [existingAdmin] = await dbManager.query('SELECT * FROM users WHERE email = ?', ['admin@holistica.com']);
    
    if (!existingAdmin || existingAdmin.length === 0) {
      const bcrypt = require('bcrypt');
      const password_hash = await bcrypt.hash('admin123', 10);
      
      await dbManager.query(`
        INSERT INTO users (name, lastname, email, phone, dni, address, password_hash, role_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, ['Admin', 'System', 'admin@holistica.com', '0999999999', '0000000000', 'Sistema', password_hash, 1]);
      
      console.log('✅ Admin user created');
      console.log('📧 Email: admin@holistica.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('🔗 Test URLs:');
    console.log('   Frontend: http://localhost:3001');
    console.log('   Backend API: http://localhost:3000/api');
    console.log('   Login endpoint: http://localhost:3000/api/auth/login');
    console.log('   Profile endpoint: http://localhost:3000/api/users/me');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
