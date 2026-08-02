import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import TitleHeader from "../components/TitleHeader";
import SkillPill from "../components/SkillPill";
import { education } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const EducationSection = () => {
    const listRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            listRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: listRef.current, start: 'top bottom-=80' } }
        );
    }, []);

    return (
        <section id="Education" className="education-section section-padding">
            <div className="w-full h-full md:px-20 px-5">

                <TitleHeader title="Education" />

                <div className="education-list" ref={listRef}>
                    {education.map(item => (
                        <div className="education-card" key={item.school}>

                            <div className="education-head">
                                <div>
                                    <h3>{item.degree}</h3>
                                    <p>
                                        {item.school} · {item.location}
                                        {item.focus && <> · Focus in {item.focus}</>}
                                    </p>
                                </div>

                                <span className="education-date">{item.date}</span>
                            </div>

                            {item.coursework.length > 0 && (
                                <div className="pill-row">
                                    {item.coursework.map(course => (
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
