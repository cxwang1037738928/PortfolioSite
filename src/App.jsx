import React from 'react'
import Hero from './sections/Hero.jsx'
import ShowcaseSection from './sections/ShowcaseSection.jsx'
import Navbar from './components/Navbar.jsx'
import ExperienceSection from './sections/ExperienceSection.jsx'


const App = () => {
  return (
    <main>
        <Navbar/>
        <Hero/>
        <ShowcaseSection/>
        <ExperienceSection/>
    </main>
  )
}

export default App