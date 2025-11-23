import React from 'react'
import { words } from '../constants/index.js'
import Button from '../components/Button.jsx'
import HeroExperience from '../components/HeroModels/HeroExperience.jsx'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AnimatedCounter from '../components/AnimatedCounter.jsx';

const Hero = () => {
    /* Animates the text in hero section on screen load */
    useGSAP(() => {
        gsap.fromTo('.hero-text h1, .hero-text h2, .hero-text h3', 
           {
            y: 50, /* element's starting point in y axis */
            opacity: 0 /* starting opacity of elements */
           },
           { 
            y: 0, /* bring element down onto screen (y 0) */
            opacity: 1,
            stagger: 0.2,    /* staggers rotation of each element by 0.2 seconds*/
            duration: 1, /* duration of the animation in seconds */
            ease: 'power2.inOut' /* easing function for smooth animation */
           } 
        )

    });
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
            <figure>
                <div className="hero-3d-layout" 
                /* 70% width on large devices, full width on small devices */>
                    <HeroExperience />
                </div>
            </figure>
        </div>
        <AnimatedCounter />
    </section>
  )
}

export default Hero