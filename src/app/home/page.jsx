import { GetPublicVideos } from "@/serverActions/GetVideoDetails"
import { notFound as NotFound } from "next/navigation";
import HomePage from "./home_page"

export default async function HOMEPAGE() {
    const public_videos = await GetPublicVideos();

    if (!public_videos) return (<NotFound /> );
    return (<HomePage videos={public_videos} />)
}