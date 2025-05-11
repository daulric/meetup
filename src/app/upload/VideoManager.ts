"use server"

import { writeFile, unlink } from "fs/promises"
import path from "path"
import ffmpeg from "fluent-ffmpeg"
import ffmpeg_static from "ffmpeg-static"
import { randomUUID } from "crypto"
import { createClient } from "@/lib/supabase/server"

ffmpeg.setFfmpegPath(ffmpeg_static as string);

export async function compressAndUpload(formData: FormData) {
    const file = formData.get("video_file") as File;
    if (!file) throw "No File Provided";

    const buffer = Buffer.from( await file.arrayBuffer() );
    const temp_id = randomUUID();
    const input_path = `/temp/${temp_id}-${file.name}`;
    const output_path = input_path.replace(path.extname(file.name), ".mp4");

    await writeFile(input_path, buffer);
}