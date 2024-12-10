import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Token dihapus" });
    // Set cookie yang sudah kadaluarsa
    response.headers.set(
        "Set-Cookie",
        "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure;",
    );
    return response;
}
