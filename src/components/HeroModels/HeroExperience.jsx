import React from 'react'

const HeroExperience = () => {
    /* uses react-responsive to detect tablet/mobile */
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)'}); 
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});
  return (
    <Canvas /* Three.js Canvas */
    camera={{ position: [0, 0, 15], fox: 45}} >
        <ambientLight /* Lighting of the model */
        intensity={0.2} color="#1a1a40"/>
        <directionalLight /* can modify intensity of the light with intensity */
        position={[5, 5, 5]} intensity={1}/>
        <OrbitControls /* allows user to move around 3D model */    
        enablePan={false} /* disallow user from panning from the model */
        enableZoom={!isTablet} /* disallow zoom on tablet since it prevents scrolling */
        maxDistance={20} /* maximum distance the camera can zoom out */
        minDistance={5} /* min distance user can zoom in */
        minpolarAngle={Math.PI / 2} /* Limit camera rotation to y plain */
        />
        <mesh>
            <boxGeometry args={[1, 1, 1]} /* size of box *//>
            <meshStandardMaterial color="teal"/>
        </mesh>

    </Canvas>
  )
}

export default HeroExperience