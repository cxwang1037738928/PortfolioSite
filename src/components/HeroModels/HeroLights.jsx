import React from 'react'

const HeroLights = () => {
  return (
    <>
        <ambientLight /* Lighting of the model */
        intensity={0.2} color="#1a1a40"/>
        <directionalLight /* can modify intensity of the light with intensity */
        position={[5, 5, 5]} intensity={1}/>
    </>
  )
}

export default HeroLights