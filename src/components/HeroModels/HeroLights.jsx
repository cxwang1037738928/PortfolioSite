import React from 'react'

const HeroLights = () => {
  return (
    <>
        <spotLight /* desk lamp */
        position={[2, 5, 6]} /* Postion of the spotlight within mesh*/
        angle={0.15}         /* Angle of the spotlight */
        intensity={100}      /* Intensity of the spotlight */
        penumbra={0.7}     /* Softness of the spotlight edge, highter = softer */
        color="white"
        />
        <spotLight 
        position={[4, 5, 4]} 
        angle={0.3}     
        intensity={40}    
        penumbra={1}     
        color="white"
        />
        <spotLight /* fill light */
        position={[4, 7, 4]} 
        angle={0.6}     
        intensity={60}    
        penumbra={1}     
        color="white"
        />             
    </>
  )
}

export default HeroLights