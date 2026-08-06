import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import TitleHeader from "../components/TitleHeader";
import SkillPill from "../components/SkillPill";
import { education } from "../constants";

gsap.registerPlugin(ScrollTrigger);

/*
  Education used to be a plain div nested at the bottom of SkillsSection, which
  meant the "Education" nav link scrolled to something that was not a section.
  It is now its own section so #Education resolves to a real target, and it
  reuses SkillPill for coursework so it reads as a pair with the skills grid.
  Content comes from the education array in constants/index.js.
*/
const EducationSection = () => {

    /* the whole card list fades in together, there is only one card so far */
    const listRef = useRef(null);

    /* Same scroll reveal the project cards and skill groups use, so the section
       does not appear differently to the rest of the page */
    useGSAP(() => {
        gsap.fromTo(
            listRef.current,
            { y: 30, opacity: 0 }, /* start slightly low and invisible */
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                /* fire once the card is 80px above the bottom of the viewport */
                scrollTrigger: { trigger: listRef.current, start: 'top bottom-=80' }
            }
        );
    }, []);

    return (
        <section
        id="Education" /* target of the Education link in the navigation bar */
        className="education-section section-padding"
        >
            <div className="w-full h-full md:px-20 px-5">

                <TitleHeader title="Education" />

                <div className="education-list" ref={listRef}>
                    {education.map(item => (

                        /* keyed by school, degrees at the same school would need a
                           different key if a second entry is ever added */
                        <div className="education-card" key={item.school}>

                            {/* degree and school on the left, dates pushed to the right */}
                            <div className="education-head">
                                <div>
                                    <h3>{item.degree}</h3>
                                    <p>
                                        {item.school} · {item.location}
                                        {/* focus is optional, so only render the separator when it exists */}
                                        {item.focus && <> · Focus in {item.focus}</>}
                                    </p>
                                </div>

                                <span className="education-date">{item.date}</span>
                            </div>

                            {/* coursework is optional too: skip the row entirely rather
                                than leaving an empty gap under the heading */}
                            {item.coursework.length > 0 && (
                                <div className="pill-row">
                                    {item.coursework.map(course => (
                                        /* level defaults to 1 (outline) since proficiency
                                           does not apply to a course */
                                        <SkillPill key={course} label={course} />
                                    ))}
                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default EducationSection;
