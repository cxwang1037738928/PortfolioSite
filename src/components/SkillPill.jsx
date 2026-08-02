import React from 'react'

/*
  A single labelled pill, shared by the skills grid and the education coursework list.
  Proficiency is carried by the fill (level-3 solid, level-2 muted, level-1 outline)
  instead of by size, so every pill lines up on the same baseline.

  Passing onClick turns the pill into a toggle button (used by the proficiency
  legend); without it the pill is static text. Styling lives in index.css.
*/
const SkillPill = ({ label, level = 1, onClick, active = false, dimmed = false }) => {

  const className = [
    "skill-pill",
    `level-${level}`,
    dimmed ? "is-dimmed" : "",
    active ? "is-active" : "",
  ].filter(Boolean).join(" ");

  if (!onClick) {
    return (
        <span className={className}>{label}</span>
    )
  }

  return (
    <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={className}
    >
        {label}
    </button>
  )
}

export default SkillPill
