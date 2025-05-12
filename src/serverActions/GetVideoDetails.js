"use server"

import { createClient } from "@/lib/supabase/server"

export async function GetVideoDetails(id) {
    const supabase = await createClient();

    const {data, error} = await supabase.schema("meetup-app")
        .from("videos")
        .select("*")
        .eq("video_id", id)
        .single();

    if (error) return null;
    
    const {data: user_data} = await supabase.schema("meetup-app")
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", data.userid)
        .single();
    
    const [video_url, thumbnail_url, avatar_url] = await Promise.all([
        supabase.storage.from("videos").createSignedUrl(data.video_path, 10).then(({data}) => data.signedUrl),
        supabase.storage.from("images").createSignedUrl(data.thumbnail_path, 10).then(({data}) => data.signedUrl),
        user_data.avatar_url && supabase.storage.from("images").createSignedUrl(user_data.avatar_url, 10).then(({data}) => data.signedUrl),
    ]);

    const return_data = {
        video: video_url,
        thumbnail: thumbnail_url,
        username: user_data.username,
        avatar_url,
        uploadDate: (new Date(data.created_at)).toDateString(),
        title: data.title,
        description: data.description,
    }

    return return_data;
}