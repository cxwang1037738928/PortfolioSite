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