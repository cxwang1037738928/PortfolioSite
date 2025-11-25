import React from 'react'

const GlowCard = ({card, children}) => {
  return (
    <div
    className="border-red-200 border-2"
    >
        <img src = {card.logoPath} alt="Life Pics"/>
    </div>

  )
}

export default GlowCard