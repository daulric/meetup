"use server"

import { createClient } from "@/lib/supabase/server"

export async function GetVideoDetails(id) {
    const supabase = await createClient();
    const { data: {user} } = await supabase.auth.getUser();

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
        id: data.video_id,
        video: video_url,
        thumbnail: thumbnail_url,
        username: user_data.username,
        avatar_url,
        uploadDate: (new Date(data.created_at)).toDateString(),
        title: data.title,
        description: data.description,
        views: data.views
    }

    if (data.visibility === "private" && data.userid !== user.id) return null;
    return return_data;
}

export async function GetPublicVideos() {
    const supabase = await createClient();

    const { data, error } = await supabase.schema("meetup-app")
        .from("videos")
        .select("*")
        .eq("visibility", "public");

    if (error) return null;

    const public_videos = await Promise.all(data.map(async (video_data) => {

        const {data: user_data} = await supabase.schema("meetup-app")
            .from("profiles")
            .select("*")
            .eq("id", video_data.userid)
            .single();

        const [video_url, thumbnail_url, avatar_url] = await Promise.all([
            supabase.storage.from("videos").createSignedUrl(video_data.video_path, 10).then(({data}) => data.signedUrl),
            supabase.storage.from("images").createSignedUrl(video_data.thumbnail_path, 10).then(({data}) => data.signedUrl),
            user_data.avatar_url && supabase.storage.from("images").createSignedUrl(user_data.avatar_url, 10).then(({data}) => data.signedUrl),
        ]);

        return {
            id: video_data.video_id,
            video: video_url,
            thumbnail: thumbnail_url,
            username: user_data.username,
            avatar_url,
            uploadDate: (new Date(video_data.created_at)).toDateString(),
            title: video_data.title,
            description: video_data.description,
            views: video_data.views,
        }
    }));

    return public_videos;
}