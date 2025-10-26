import bcrypt from 'bcrypt';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const testEmail = 'test@example.com';
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, testEmail)).limit(1);
    
    if (existingUser.length > 0) {
        console.log('✅ Test user already exists, skipping seeding');
        return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const sampleUsers = [
        {
            email: testEmail,
            password: hashedPassword,
            name: 'Test User',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});