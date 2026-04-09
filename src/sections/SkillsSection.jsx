import React from 'react';
import { skills } from '../constants';
import { useEffect } from "react";
import gsap from "gsap";

const getSize=(level) => {
    switch(level) {
        case 1:
            return 60;
        case 2:
            return 100;
        case 3:
            return 140;
        default:
            return 100;
    }
};

const SkillsSection = () => {
    const [activeCategory, setActiveCategory] = React.useState(null);
    const [activeSort, setActiveSort] = React.useState(null);
    const [SortedSkills, setSortedSkills] = React.useState(null);

    const categories = [...new Set(skills.map(skill => skill.category))];


    return(
        <>
    <section
    id="skills" className="skills-section">
      <h2 className="skills-title">Use the buttons below to categorize skills, large bubbles represent higher proficiency</h2>

      <div style={{marginBottom: '20px'}}>
        {categories.map(category => (
            <button 
                key={category}
                onClick={() => setActiveCategory(activeCategory === category ? null : category)} /* toggle category on click */
                style={{
                    marginRight: 10,
                    opacity: activeCategory && activeCategory !== category ? 0.5: 1, /* */
                }}
            >
                {category}
            </button>
        ))}

      </div>

      <div className="bubble-container">
        {(activeSort && SortedSkills ? SortedSkills : skills).map((skill) => (
          <div
            key={skill.name}
            className="bubble"
            style={{
                width: getSize(skill.level),
                height: getSize(skill.level),
                opacity: !activeCategory || skill.category === activeCategory? 1: 0.3,
                transition: "opacity 0.3s",
            }}
          >
            {skill.name}
          </div>
        ))}
      </div>

      <button
      key={"Sort by proficiency"}
        onClick = {() => {setSortedSkills([...skills].sort((a,b) => b.level - a.level))
        setActiveSort(activeSort === true ? null : true)
        }}
        style={{
            marginTop: 20,
            opacity: activeSort === true ? 1 : 0.5,
        }}
      >

        Sort by Proficiency
      </button>
      
    
    <div id="Education" className="education-section max-w-xl mx-auto mt-20">

        <div className="education-item bg-gray-800 bg-opacity-20 p-6 rounded shadow-inner">
          <h3 className="text-xl font-semibold">University of Toronto</h3>
          <span className="text-gray-300">Expected June 2027</span>
          <p className="mt-2 text-gray-200">
            Honors Bachelor of Science: Computer Science Specialist | Toronto, Canada
          </p>
        </div>
      </div>

    </section>



    
    </>
    
    )
};


export default SkillsSection;