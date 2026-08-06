import React from 'react'

/*
  A single labelled pill, shared by the skills grid and the education coursework
  list so the two sections read as one design.

  Proficiency is carried by the fill (level-3 solid, level-2 muted, level-1
  outline) rather than by size, so every pill sits on the same baseline and long
  names like "Jupyter Notebook" always fit. Styling lives in index.css under
  .skill-pill, keeping the level variants next to the rest of the theme.

  props:
    label   - text shown in the pill.
    level   - 1, 2 or 3. Picks the fill; defaults to the outline style, which is
              what coursework uses since proficiency does not apply to a course.
    onClick - when given, the pill renders as a <button> instead of a <span>.
              Only the proficiency legend passes this.
    active  - this pill is the selected filter (adds a ring).
    dimmed  - this pill is filtered out (drops to 25% opacity).
*/
const SkillPill = ({ label, level = 1, onClick, active = false, dimmed = false }) => {

  /* filter(Boolean) drops the empty strings so no double spaces end up in the
     class attribute when active/dimmed are false */
  const className = [
    "skill-pill",
    `level-${level}`,
    dimmed ? "is-dimmed" : "",
    active ? "is-active" : "",
  ].filter(Boolean).join(" ");

  // static pill: plain text, not focusable or clickable
  if (!onClick) {
    return (
        <span className={className}>{label}</span>
    )
  }

  /* interactive pill: a real button so it is reachable by keyboard, with
     aria-pressed announcing whether this filter is currently on */
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
