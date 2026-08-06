import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import RotatingImage from "../components/RotatingImage";

gsap.registerPlugin(ScrollTrigger);

/* Screenshots each project card cycles through, in display order.
   Add new files to public/images and append them here.

   Declared at module level on purpose: RotatingImage lists `images` as an effect
   dependency, so an array built inside the component would be a new reference on
   every render and would restart the rotation timer each time. */
const OPENCRAWL_IMAGES = [
    "/images/OpenCrawl.png",
    "/images/OpenCrawl_2.png",
    "/images/OpenCrawl_3.png",
    "/images/OpenCrawl_4.png",
    "/images/OpenCrawl_5.png",
];

/* only one screenshot so far, so this card stays static until more are added */
const CANADA_MAPPED_IMAGES = [
    "/images/Canada_Mapped.png",
];

/* starts from Labrador_fixed.png, not Labrador.jpg: those two are the same login
   screen and would show as a duplicate slide */
const LABRADOR_IMAGES = [
    "/images/Labrador_fixed.png",
    "/images/Labrador_2.jpg",
    "/images/Labrador_3.jpg",
    "/images/Labrador_4.jpg",
    "/images/Labrador_5.jpg",
];

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
                        <a
                        href="https://opencrawl-demo.onrender.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        /* block + relative + full size so the stacked, absolutely
                           positioned images inside have something to size against,
                           while still respecting the wrapper's padding */
                        className="block relative w-full h-full"
                        >
                            <RotatingImage
                            images={OPENCRAWL_IMAGES}
                            alt="OpenCrawl"
                            />
                        </a>
                    </div>
                    <div>
                        <h2>OpenCrawl</h2>
                        <p
                        className="text-white-50 md:text-xl"
                        >
                        A self-hosted document intelligence and RAG platform where research PDFs are OCR'd, chunked, embedded, clustered, ranked, and assembled into a knowledge graph. Every answer in chat cites its source, and clicking a citation opens the PDF with the supporting sentences highlighted. Retrieval blends BM25 with dense cosine similarity and 2-hop graph traversal, and each citation is re-checked against the retrieved text so quotes must match verbatim and paraphrases must clear a lexical or semantic bar.
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
                            <a
                            href="https://canadamapped.ca"
                            target="_blank"
                            rel="noopener noreferrer"
                            /* positioning context for the stacked images, see the
                               featured card above */
                            className="block relative w-full h-full"
                            >
                                <RotatingImage
                                images={CANADA_MAPPED_IMAGES}
                                alt="Canada Mapped"
                                delay={1200}
                                />
                            </a>

                        </div>
                        <h2>A full-stack web application that finds Statistics Canada data tables from natural language queries and visualizes them as a choropleth map of the provinces, using semantic search over 3,600+ indexed cubes with an MLP subject classifier and TF-IDF keyword re-ranking.</h2>

                    </div>

                    <div
                    className="project"
                    ref={project3Ref}
                    >
                        <div
                        className="image-wrapper"
                        >
                            <a
                            href="https://github.com/cxwang1037738928/Labrador"
                            target="_blank"
                            rel="noopener noreferrer"
                            /* positioning context for the stacked images, see the
                               featured card above */
                            className="block relative w-full h-full"
                            >
                                <RotatingImage
                                images={LABRADOR_IMAGES}
                                alt="Labrador"
                                delay={2400}
                                />
                            </a>
                        </div>
                        <h2>An app that allows users to label images and package them into containers of data for feeding into CV models, with a dashboard and a hierarchy system for quality control.</h2>

                    </div>

                </div>


            </div>


        </div>
    
    </section>
  )
}

export default ShowcaseSection