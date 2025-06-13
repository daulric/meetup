import { createClient } from "@/lib/supabase/client";

export default async function GetSearchVideos(search: string) {
  if (!search) return null;

  try {
    const supabase = createClient();

    // Step 1: Find profiles with matching username
    const { data: profiles, error: profilesError } = await supabase
      .schema("meetup-app")
      .from("profiles")
      .select("id")
      .like("username", `%${search}%`);

    if (profilesError) throw profilesError;

    const profileIds = profiles?.map(p => p.id) || [];

    // Step 2: Query videos filtered by profile_ids or title/description/category matching
    const query = supabase
      .schema("meetup-app")
      .from("videos")
      .select("*, profiles(username)");

    // Run parallel queries for videos matching text fields
    const [title_query, description_query, category_query] = await Promise.all([
      query.like("title", `%${search}%`),
      query.like("description", `%${search}%`),
      query.like("category", `%${search}%`),
    ]);

    // Query videos that belong to profiles matching username
    const { data: profile_videos, error: profileVideosError } = await supabase
      .schema("meetup-app")
      .from("videos")
      .select("*, profiles(username)")
      .in("profile_id", profileIds);

    if (
      title_query.error ||
      description_query.error ||
      category_query.error ||
      profileVideosError
    ) {
      throw (
        title_query.error ||
        description_query.error ||
        category_query.error ||
        profileVideosError
      );
    }

    // Combine all videos
    const combined = [
      ...(title_query.data || []),
      ...(description_query.data || []),
      ...(category_query.data || []),
      ...(profile_videos || []),
    ];

    // Remove duplicates by video id
    const merged = Object.values(
      combined.reduce<Record<string, typeof combined[0]>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {})
    );

    return merged;
  } catch (error) {
    console.error("Search error:", error);
    return null;
  }
}