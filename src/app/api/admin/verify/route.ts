import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Get password from environment variable (server-side only)
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.error('ADMIN_PASSWORD environment variable not set');
            return NextResponse.json({ success: false }, { status: 500 });
        }

        const isValid = password === adminPassword;

        return NextResponse.json({ success: isValid });
    } catch {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}
