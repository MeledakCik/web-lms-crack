import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { createHash } from 'crypto';

// Konfigurasi database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lms_crack',
};

export async function POST(req: NextRequest) {
    try {
        // Mengambil data dari FormData
        const formData = await req.formData();
        const username = formData.get("username")?.toString();
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        const name = formData.get("name")?.toString();
        const bio = formData.get("bio")?.toString();
        const photoProfile = formData.get("photo_profile")?.toString();
        if (!photoProfile || !photoProfile.startsWith("data:image/")) {
            return NextResponse.json({ message: "Foto profil tidak valid" }, { status: 400 });
        }
        if (!username || !email || !password || !name) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }
        const hashedPassword = createHash('sha256').update(password).digest('hex');
        const connection = await mysql.createConnection(dbConfig);
        try {
            await connection.beginTransaction();
            const [userResult]: any = await connection.execute(
                `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
                [username, email, hashedPassword]
            );
            const userId = userResult.insertId;
            await connection.execute(
                `INSERT INTO profile (user_id, bio, photo_profile, name) VALUES (?, ?, ? , ?)`,
                [userId, bio, photoProfile, name || null]
            );
            await connection.commit();
            return NextResponse.json({ message: "User and profile created successfully" }, { status: 201 });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error("Error:", error.message);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
