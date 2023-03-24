import { AxiosError } from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import { ThreeDot } from "../../../../../loader/Spinner"
import Audio from './Audio'
import Image from './Image'
import PDF from './PDF'
import Video from './Video'
const imageType: string[] = ["jpg", "jpeg", "png"]
const videoType: string[] = ["mp4", "mkv", "mid", "mov", "webm", "avi", "wmp", "mpg"]
const audioType: string[] = ["mp3", "m4a", "opus", "ogg", "flac", "wav", "amr"]
const pdftype: string[] = ["pdf"]
type propType = {
    filePath: { url: string, type: string }
}
// const URL= process.env.REACT_APP_BACKEND_DOMAIN
function GroupFile({ filePath }: propType) {
    const [loader, setLoader] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [basee64, setFileBase64] = useState<string | ArrayBuffer | null>(null)
    useEffect(() => {
        (async function () {
            if (filePath !== undefined) {
                try {
                    setLoader(true)
                    const res = await fetch("/api/v1/resources/file", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            filePath: filePath.url,
                        }
                    })
                    const result = await res.blob()
                    const reader = new FileReader()
                    reader.onload = () => {
                        setFileBase64(reader.result)
                    }
                    reader.readAsDataURL(new Blob([result]))
                    setLoader(false)
                } catch (err: unknown) {
                    const error = err as AxiosError
                    setError("image not load")
                }
            }
        })()
        return () => {
            setError("")
        }
    }, [filePath])
    return (
        <div className="flex justify-center">
            {
                loader ? <div className="loader w-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-md">
                    <div className="image_shallow_copy w-[8rem] md:w-[15rem] h-[10rem] flex justify-center items-center align-middle">
                        <ThreeDot />
                    </div>
                </div> :
                    (error ? error :
                        typeof basee64 === "string" &&
                        (
                            (imageType.some(item => item === filePath.type))
                                ?
                                <Image basee64={basee64} />
                                :
                                videoType.some(item => item === filePath.type)
                                    ?
                                    <Video base={basee64} type={filePath.type} />
                                    :
                                    audioType.some(item => item === filePath.type)
                                    &&
                                    <Audio base={basee64} type={filePath.type} />
                            // TODO:add PDF file 
                            // :
                            // pdftype.some(item => item === filePath.type) &&
                            // <PDF base={basee64} type={filePath.type} />
                        )
                    )
            }
        </div >
    )
}
export default React.memo(GroupFile)