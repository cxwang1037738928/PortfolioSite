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
                        src="/images/project1.png"
                        alt="Ryde"
                        />
                    </div>
                    <div>
                        <h2>
                            Project 1 description
                        </h2>
                        <p
                        className="text-white-50 md:text-xl"
                        >
                        More about the description of Project 1 and tech stack used + obstacles encountered
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
                            src="/images/project2.png"
                            alt="Library Management"
                            />
                        </div>
                        <h2>Project 2 title + description</h2>

                    </div>

                    <div
                    className="project"
                    ref={project3Ref}
                    >
                        <div
                        className="image-wrapper" // background color for project image
                        >
                            <img
                            src="/images/project3.png"
                            alt="YC directory"
                            />
                        </div>
                        <h2>Project 3 title + description</h2>

                    </div>

                </div>


            </div>


        </div>
    
    </section>
  )
}

export default ShowcaseSection