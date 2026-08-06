import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import TitleHeader from "../components/TitleHeader";
import SkillPill from "../components/SkillPill";
import { skills, skillCategories, skillLevels } from "../constants";

gsap.registerPlugin(ScrollTrigger);

/*
  Skills grouped into labelled rows of pills. Proficiency is carried by the pill
  fill rather than by size, which was the problem with the old bubbles: a 60px
  circle could not hold a name like "Jupyter Notebook", and size is hard to
  compare across a gap. Because the categories are now visible as rows, the old
  category filter buttons were dropped; the proficiency legend is the only
  control, and it highlights in place rather than reordering so the grouping
  never moves under the reader.
  Skills, category labels and level labels all come from constants/index.js.
*/
const SkillsSection = () => {

    /* one ref per category row so each can be revealed on scroll independently */
    const groupRefs = useRef([]);

    // null = nothing selected, everything shown at full strength
    const [activeLevel, setActiveLevel] = useState(null);

    // clicking the selected level again clears the filter
    const toggleLevel = (level) => setActiveLevel(current => current === level ? null : level);

    /* Fade each group in as it scrolls into view, same treatment as the project cards */
    useGSAP(() => {
        groupRefs.current.forEach((group, index) => {
            gsap.fromTo(
                group,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, delay: 0.15 * index, scrollTrigger: { trigger: group, start: 'top bottom-=80' } }
            );
        });
    }, []);

    return (
        <section id="skills" className="skills-section section-padding">
            <div className="w-full h-full md:px-20 px-5">

                <TitleHeader title="Skills" />

                {/* Doubles as a style key and as the filter: each entry is rendered in
                    the same pill style the skills of that level use, and clicking one
                    highlights those skills below */}
                <div className="skills-legend">
                    <span>Filter by proficiency</span>
                    {skillLevels.map(({ level, label }) => (
                        <SkillPill
                        key={level}
                        label={label}
                        level={level}
                        onClick={() => toggleLevel(level)}
                        active={activeLevel === level}
                        dimmed={activeLevel !== null && activeLevel !== level}
                        />
                    ))}
                </div>

                <div className="skill-groups">
                    {/* driven by skillCategories rather than by the skills themselves so
                        the row order is fixed and does not depend on data ordering */}
                    {skillCategories.map(({ key, label }, index) => {

                        // strongest skills first so each row leads with the solid pills
                        const group = skills
                            .filter(skill => skill.category === key)
                            .sort((a, b) => b.level - a.level);

                        // a category with no skills yet renders nothing at all
                        if (group.length === 0) return null;

                        // fade the heading too when nothing in the group matches the filter
                        const groupMatches = activeLevel === null
                            || group.some(skill => skill.level === activeLevel);

                        return (
                            <div
                            className="skill-group"
                            key={key}
                            ref={el => (groupRefs.current[index] = el)}
                            >
                                <h3 className={groupMatches ? "" : "is-dimmed"}>{label}</h3>

                                <div className="pill-row">
                                    {group.map(skill => (
                                        <SkillPill
                                        key={skill.name}
                                        label={skill.name}
                                        level={skill.level}
                                        dimmed={activeLevel !== null && skill.level !== activeLevel}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default SkillsSection;
