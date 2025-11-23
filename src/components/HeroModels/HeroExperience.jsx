import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";

import { Room } from "./Room";
import HeroLights from "./HeroLights";

const HeroExperience = () => {
    /* uses react-responsive to detect tablet/mobile */
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)'}); 
    const isMobile = useMediaQuery({ query: '(max-width: 768px)'});
  return (
    <Canvas /* Three.js Canvas */
    camera={{ position: [0, 0, 15], fov: 45}} >

        <OrbitControls /* allows user to move around 3D model */    
        enablePan={false} /* disallow user from panning from the model */
        enableZoom={!isTablet} /* disallow zoom on tablet since it prevents scrolling */
        maxDistance={20} /* maximum distance the camera can zoom out */
        minDistance={5} /* min distance user can zoom in */
        minPolarAngle={Math.PI / 5} /* Limit camera rotation in y plain, larger = smaller area of movement*/
        maxPolarAngle={Math.PI / 2} /* Limit camera rotation to y plain */
        />
        
        <HeroLights /* lighting for the model */ />

        <group 
            scale={isMobile? 0.7 : 1} /* scales down model on mobile devices */
            position={[0, -3.5, 0]} /* moves model down on y axis */
            rotation={[0, -Math.PI/4, 0]} /* rotate model on entering website */
        >
            <Room 
            /* Renders the room from the model */
            /* model comes from public/models, first convert to jsx from
            glb */ /> 
        </group>

    </Canvas>
  )
}

export default HeroExperience