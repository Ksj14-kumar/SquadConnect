import React from 'react'
import { Vortex } from 'react-loader-spinner'
function Reconnect() {
    return (
        <div className="reconnect_user absolute w-screen h-[calc(100vh-0rem)] z-[1] bg-[#3943ce32]">
            <div className="wrapper flex justify-center pt-[5rem] h-full">
                <div className="loader flex items-center">
                    <div className='loader inner'>
                        <Vortex
                            visible={true}
                            height="35"
                            width="35"
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                        />
                    </div>
                    <p className='text-[1.5rem] mobile:text-[1.1rem] font-sans text-[#fff] tracking-wider'>
                        Reconnecting...
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Reconnect