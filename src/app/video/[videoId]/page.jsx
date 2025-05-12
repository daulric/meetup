import VideoPage from "./VideoPage"
import { GetVideoDetails } from "@/serverActions/GetVideoDetails"
import { notFound as NotFound } from "next/navigation";

export default async function PAGE({params}) {
    const id = (await params).videoId;
    console.log(id);

    const data = await GetVideoDetails(id);

    if (!data) return (<NotFound />)

    return (<VideoPage videoData={data}/>)
}