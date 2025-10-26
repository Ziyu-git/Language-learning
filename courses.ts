import { db } from '@/db';
import { courses } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    const existingCourses = await db.select().from(courses);
    
    if (existingCourses.length > 0) {
        console.log('⚠️ Courses already exist, skipping seeding');
        return;
    }

    const sampleCourses = [
        {
            title: 'English Basics',
            description: 'Learn fundamental English words and phrases for everyday communication',
            language: 'English',
            level: 'Beginner',
            imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'Travel Spanish',
            description: 'Essential Spanish vocabulary and phrases for travelers exploring Spanish-speaking countries',
            language: 'Spanish',
            level: 'Beginner',
            imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'Business French',
            description: 'Professional French vocabulary and expressions for business environments',
            language: 'French',
            level: 'Intermediate',
            imageUrl: 'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc',
            createdAt: new Date().toISOString(),
        },
        {
            title: 'Japanese for Beginners',
            description: 'Start your Japanese journey with basic hiragana, katakana, and common phrases',
            language: 'Japanese',
            level: 'Beginner',
            imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(courses).values(sampleCourses);
    
    console.log('✅ Courses seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});