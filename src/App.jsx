import React from 'react'
import Hero from './sections/Hero.jsx'
import ShowcaseSection from './sections/ShowcaseSection.jsx'
import Navbar from './components/Navbar.jsx'
import SkillsSection from './sections/SkillsSection.jsx'
import ChatbotWidget from './components/ChatbotModels/ChatbotWidget.jsx'
import EducationSection from './sections/EducationSection.jsx'


const App = () => {
  return (
    <main>
        {/* Page order matches the navigation bar: Projects (#work), Skills
            (#skills), then Education (#Education). Education is its own section
            rather than part of Skills so that last link has a real target.
            ChatbotWidget is last but position: fixed, so it floats over the rest. */}
        <Navbar/>
        <Hero/>
        <ShowcaseSection/>
        <SkillsSection/>
        <EducationSection/>
        <ChatbotWidget/>
    </main>
  )
}

export default App