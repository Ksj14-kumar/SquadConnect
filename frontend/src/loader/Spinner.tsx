import { ColorRing, Circles, ThreeDots } from "react-loader-spinner"
export function Rainbow() {
    return (
        <ColorRing
            visible={true}
            height="29"
            width="29"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
    )
}
export function ThreeDot() {
    return (
        <Circles
            height="40"
            width="40"
            color="#0404FC"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    )
}
export function TypingLoader({ h, w }: { h: number, w: number }) {
    return (
        <ThreeDots
            height={h}
            width={w}
            radius="9"
            color="#fff"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            visible={true}
        />
    )
}
