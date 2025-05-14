import UploadPage from "./page_client"

export const metadata = {
    title: "s2 - Upload",
    description: "Upload Yah Video"
}

export default async function PAGE(params) {
    return ( <UploadPage /> )
}