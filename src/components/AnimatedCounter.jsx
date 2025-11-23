import React from 'react'
import { counterItems } from '../constants'
import CountUp from 'react-countup';

const AnimatedCounter = () => {
  return (
    <div id="counter" className="padding-x-lg xl:mt-0 mt-32">
        <div className="mx-auto grid-4-cols">
            {counterItems.map((items) => (
                
                <div /* displays the numbers on the home page */
                className="bg-zinc-900 rounded-lg p-10 flex flex-col justify-center"
                > 
                    <div key={counterItems.label} className="counter-number text-white text-5xl font-bold mb-2">
                         
                        <CountUp
                        /* Adds animated to statistics */
                        suffix={items.suffix}
                        end={items.value}
                        />

                    </div>
                <div className="text-white-50 text-lg"
                >{items.label}</div>
                </div>

            ))}
        </div>
    </div>
  )
}

export default AnimatedCounter