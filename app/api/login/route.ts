import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import mysql from 'mysql2/promise';
import { NextRequest, NextResponse } from 'next/server';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lms_crack',
};

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    const connection = await mysql.createConnection(dbConfig);
    try {
        const hashedPassword = createHash('sha256').update(password).digest('hex');
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, hashedPassword]);
        //@ts-ignore
        if (rows.length > 0) {
            //@ts-ignore
            const userId = rows[0].id; // Ambil ID pengguna
            const token = createHash('sha256').update(`${username}:${password}:${Date.now()}`).digest('hex');
            return NextResponse.json(
                { token, id: userId }, // Kirim ID pengguna dalam respons
                {
                    status: 200,
                    headers: {
                        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
                    },
                }
            );
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Database error', error }, { status: 500 });
    } finally {
        await connection.end();
    }
}