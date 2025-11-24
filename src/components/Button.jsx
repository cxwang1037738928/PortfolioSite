import React from 'react'

const Button = ({ text, className, id }) => {
  return (
    <a
    onClick={(e) => {
      e.preventDefault(); /* Prevents default anchor behavior (it reloads browser on click) */
      const target = document.getElementById('work') /* find the section with id work */

      if(target && id) {
        /* Set offset of space at top of screen after scrolling to target */
        const offset = window.innerHeight * 0.15;
        
        /* Calculate the top position to scroll to, accounting for the offset */
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({ top, behavior: 'smooth' }); /* Smooth scroll to target element */
      }
    }} 
    className={`${className ?? ''} cta-wrapper`}>
        <div className="cta-button group">
            <div className="bg-circle"/>
            <p className="text">{text}</p>
            <div className="arrow-wrapper">
                <img src="/images/arrow-down.svg" alt="arrow"/>
            </div>
            
        </div>
    </a>
  );
};

export default Button;