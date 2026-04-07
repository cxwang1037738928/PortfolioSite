import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
    const sectionRef = useRef(null);
    const project1Ref = useRef(null);
    const project2Ref = useRef(null);
    const project3Ref = useRef(null);


    
    /* Make the projects fade in and out on scroll */
    useGSAP(() => {
        const projects = [project1Ref.current, project2Ref.current, project3Ref.current];
        projects.forEach((card, index) => {
            gsap.fromTo(
                card,
                {y:50, opacity: 0},
                {y:0, opacity:1, duration: 1, delay:0.3 * (index + 1), scrollTrigger: {trigger: card, start: 'top bottom-=100'}}
            )
        });
        gsap.fromTo(sectionRef.current, { opacity: 0}, {opacity: 1, duration: 1.5},
    )},

    []);

  return (
    <section 
    id="work" /* lets navigation bar to scroll to it later */
    ref={sectionRef}
    className="app-showcase"
    >
        <div
        className="w-full" /* takes full width of screen, index.css */
        >
            <div className="showcaselayout">
                {/* LEFT */}

                <div className="first-project-wrapper" ref={project1Ref}>

                    <div className="image-wrapper">
                        <img
                        src="/images/Labrador.jpg"
                        alt="Ryde"
                        />
                    </div>
                    <div>
                        <h2>
                            
                        </h2>
                        <p
                        className="text-white-50 md:text-xl"
                        >
                        An app that allows users to label images and package them into containers of data for feeding into CV models. The app also features a dashboard for users to view and manage their datasets,
                         as well as a hierarchy system for cashiers and managers to manage users and ensure quality control.
                        </p>
                    </div>

                </div>

                {/* RIGHT */}
                
                <div
                className="project-list-wrapper overflow-hidden"
                >
                    <div
                    className="project"
                    ref={project2Ref}
                    >
                        <div
                        className="image-wrapper" // background color for project image
                        >
                            <img
                            src="/images/Galaxy_Finder.png"
                            alt="Library Management"
                            />
                        </div>
                        <h2>An application that uses the Ultralytics YOLO model to segment and identify galaxy types, trained on augmented data from the Galaxy Zoo project.</h2>

                    </div>

                    <div
                    className="project"
                    ref={project3Ref}
                    >
                        <div
                        className="image-wrapper" // background color for project image
                        >
                            <img
                            src="/images/Greyscale_AI.png"
                            alt="YC directory"
                            />
                        </div>
                        <h2>A greyscale image colorization AI that I made as part of a course which uses two convolutional neural network architectures, PoolUpsampleNet and ConvTransposeNet, to predict pixel-wise colors from grayscale images</h2>

                    </div>

                </div>


            </div>


        </div>
    
    </section>
  )
}

export default ShowcaseSection