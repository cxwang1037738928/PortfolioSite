import React from 'react'
import { navLinks } from '../constants'
import { useEffect, useState } from 'react';

const Navbar = () => {

    const [scrolled, setScrolled] = useState(false);

    /* Make it so nav bar gets a distinguishing background as user scrolls to other sections */

    useEffect(
        () => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => window.removeEventListener('scroll', handleScroll);
    
    
    },

    [])

  return (
    <header
    className= {`navbar ${scrolled ? 'scrolled' : 'not-scrolled'}`}
    >
        <div
        className="inner"
        >
            <a
            className="logo" href="#hero"
            >
            Eric | Chuxuan
            </a>
            <nav
            className="desktop"
            >
                <ul>
                    {
                     navLinks.map(({link, name})=>(
                        <li
                        key= {name}
                        className="group"
                        >
                            <a
                            href={link}
                            >
                                <span>{name}</span>
                                <span className="underline"/>
                            </a>
                        </li>
                     ))
                    }
                </ul>

            </nav>
            <a
            href="#contact" className="contact-btn group"
            >
                <div
                className="inner"
                >
                    <span>
                        Contact Me
                    </span>

                </div>

            </a>
        </div>
    </header>
  )
}

export default Navbar