import React from 'react'
function Image({ basee64 }: { basee64: string }) {
    return <img src={basee64} alt="" className='rounded-md mb-1 w-full md:w-[15rem] cursor-pointer' />
}
export default Image