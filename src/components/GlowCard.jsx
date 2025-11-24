import React from 'react'

const GlowCard = ({card, children}) => {
  return (
    <div
    className="card card-boardr timeline-card rounded-xl p-10"
    >
        <div
        className="glow" /* cool outline that shows up when hovering over card */
        /* div wrapping the stars */
        >
        <div className="flex items-center gap-1 mb-5" 
        >
            {/* {Array.from({length: 5}, (_, i) => (
                <img
                src="/images/star.png" key={i} alt="star" className="size-5"
                />
            ))} */}
        </div>
        </div> 
        <div
        className="mb-5">
            <p className="text-white-50 text-lg">{card.review /* words inside the cards */}</p>

        </div>
        {children /* logos beneath the card */}
    </div>

  )
}

export default GlowCard