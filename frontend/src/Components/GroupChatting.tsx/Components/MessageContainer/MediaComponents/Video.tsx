import React from 'react'
function Video({ base, type }: { base: string, type: string }) {
    return <video width="500" height="281" controls>
        <source src={base} type={`video/${type}`} />
    </video>
}
export default Video