import React from 'react'

const TitleHeader = ({title, subtitle}) => {
  return (
    <div
    className="flex flex-col items-center gap-5"
    >
        {/* <div className="hero-badge">
            <p>{subtitle}</p>
        </div> Badge above title */}
        <div
        className="font-semibold md:text-5xl text-3xl text-center"
        >
            {title}

        </div>

    </div>
  )
}

export default TitleHeader
