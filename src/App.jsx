import React from 'react'
import Hero from './sections/Hero.jsx'
import ShowcaseSection from './sections/ShowcaseSection.jsx'
import Navbar from './components/Navbar.jsx'
import ExperienceSection from './sections/ExperienceSection.jsx'
import SkillsSection from './sections/SkillsSection.jsx'
// import EducationSection from './sections/EducationSection.jsx'


const App = () => {
  return (
    <main>
        <Navbar/>
        <Hero/>
        <ShowcaseSection/>
        {/* <ExperienceSection/> */}
        <SkillsSection/>
        {/* <EducationSection/> */}
    </main>
  )
}

export default App