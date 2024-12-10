import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        // Ambil userId dari query parameters
        const userId = request.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required." }, { status: 400 });
        }

        const query = `
            SELECT 
                u.username, 
                u.email, 
                p.name, 
                p.photo_profile, 
                p.bio
            FROM 
                users AS u
            LEFT JOIN 
                profile AS p ON u.id = p.user_id
            WHERE 
                u.id = ?;
        `;

        const results: any = await new Promise((resolve, reject) => {
            db.query(query, [userId], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        if (results.length > 0) {
            return NextResponse.json(results[0], { status: 200 });
        } else {
            return NextResponse.json({ message: "No profile data found." }, { status: 404 });
        }
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}