import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const formData = await req.formData();
        
        // Get the file from FormData
        const file = formData.get("image");

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        // Create upload directory if it doesnt exist
        const uploadDir = path.join(process.cwd(), "public/uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        // Read file buffer and save it
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(uploadDir, file.name);
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({ success: true, imageUrl: `/uploads/${file.name}` });
    } catch (error) {
        console.error("File Upload Error:", error);
        return NextResponse.json({ success: false, message: "Error uploading file", error: error.message }, { status: 500 });
    }
}
