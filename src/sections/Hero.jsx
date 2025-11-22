import React from 'react'
import { words } from '../constants/index.js'
import { Button } from '../components/Button.jsx'
const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 z-10">
            <img src="/images/bg.png" alt="background"/>
        </div>

        <div className="hero-layout">
            {/* LEFT: HERO CONTENT */}
            <header /* adjusts size based on screen size */ 
            className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
                <div className="flex flex-col gap-7">
                    <div className="hero-text"/* Main headline, consisting of 3 h1 elements*/> 
                        <h1>Shaping
                             <span className="slide" /* rotating slide, maps images from imgpath to rounded boxes*/> 
                                <span className="wrapper">
                                    {words.map((words)=> (
                                        <span key={words.text} className="flex items-center md: gap-3 gap-1 pb-2">
                                        <img 
                                            src={words.imgPath}
                                            alt={words.text}
                                            className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                                        />
                                        <span /* Animates the words alongside the icons*/>{words.text}</span>                                 
                                        </span>
                                    ))}
                                </span>
                             </span>
                        </h1>
                        <h2>Into Real Projects</h2>
                        <h3>That Deliver Results</h3>
                    </div>
                    <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
                        Hi, I'm Eric. A student studying Computer Science at the University of Toronto.
                    </p>
                    <Button
                        className="md:w-80 md:h-16 w-60 h-12"
                        id="button"
                        text="See my Work"
                    />
                </div>
            </header>
            
            {/* RIGHT: 3D MODEL */}
        </div>
    </section>
  )
}

export default Hero