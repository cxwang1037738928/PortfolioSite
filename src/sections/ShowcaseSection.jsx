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
                        <a href="https://canadamapped.ca" target="_blank" rel="noopener noreferrer">
                            <img
                            src="/images/Canada_Mapped.png"
                            alt="Canada Mapped"
                            />
                        </a>
                    </div>
                    <div>
                        <h2>Canada Mapped</h2>
                        <p
                        className="text-white-50 md:text-xl"
                        >
                        A full-stack web application that lets users find Statistics Canada data tables using natural language queries and visualizes the results as a choropleth map of Canadian provinces. The backend uses semantic search with sentence-transformer embeddings, a re-ranking pipeline with an MLP subject classifier, and TF-IDF keyword boosting to surface the most relevant StatCan table from over 3,600 indexed cubes.
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
                        className="image-wrapper"
                        >
                            <a href="https://github.com/cxwang1037738928/Labrador" target="_blank" rel="noopener noreferrer">
                                <img
                            src="/images/Labrador_fixed.png"
                            alt="Labrador"
                            />
                            </a>

                        </div>
                        <h2>An app that allows users to label images and package them into containers of data for feeding into CV models, with a dashboard and a hierarchy system for quality control.</h2>

                    </div>

                    <div
                    className="project"
                    ref={project3Ref}
                    >
                        <div
                        className="image-wrapper"
                        >
                            <a href="https://github.com/cxwang1037738928/Galaxy-Identifier" target="_blank" rel="noopener noreferrer">
                                <img
                                src="/images/Galaxy_Finder.png"
                                alt="Galaxy Finder"
                                />
                            </a>
                        </div>
                        <h2>An application that uses the Ultralytics YOLO model to segment and identify galaxy types, trained on augmented data from the Galaxy Zoo project.</h2>

                    </div>

                </div>


            </div>


        </div>
    
    </section>
  )
}

export default ShowcaseSection