// src/constants/index.js

// A file to hold all the constants across the website so
// they can be easily modifiable and not clogg up space

const navLinks = [
  {
    name: "Projects",
    link: "#work",
  },
  // {
  //   name: "About Me",
  //   link: "#AboutMe",
  // },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Education",
    link: "#Education",
  },
];

// words that appear at the top of the home page alongside their icons
// duplicated list to make transition smooth
const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [

];

const logoIconsList = [

];

const abilities = [

];

const techStackImgs = [

];

const techStackIcons = [

];


// Data for card section, used in ExperienceSection.jsx
const expCards = [

];

const expLogos = [

];

const testimonials = [

];

const socialImgs = [

];

// display order and headings for the skill groups in SkillsSection
// key matches the "category" field on each skill below
const skillCategories = [
  { key: "language", label: "Languages" },
  { key: "framework", label: "Frameworks" },
  { key: "library", label: "Libraries & Data" },
  { key: "tool", label: "Tools" },
];

// what each proficiency level means, used for the legend and pill styling
const skillLevels = [
  { level: 3, label: "Advanced" },
  { level: 2, label: "Proficient" },
  { level: 1, label: "Familiar" },
];

const skills = [
  // Languages
  { name: "JavaScript", level: 3, category: "language" },
  { name: "Python", level: 3, category: "language" },
  { name: "Java", level: 2, category: "language" },
  { name: "SQL", level: 2, category: "language" },
  { name: "HTML", level: 2, category: "language" },
  { name: "CSS", level: 2, category: "language" },
  { name: "C", level: 1, category: "language" },
  { name: "R", level: 1, category: "language" },
  { name: "Assembly", level: 1, category: "language" },

  // Developer Tools
  { name: "Git", level: 3, category: "tool" },
  { name: "Jupyter Notebook", level: 3, category: "tool" },
  { name: "VS Code", level: 3, category: "tool" },

  // Libraries / DB
  { name: "PyTorch", level: 3, category: "library" },
  { name: "MySQL", level: 2, category: "library" },
  { name: "PostgreSQL", level: 2, category: "library" },
  { name: "Scikit-learn", level: 2, category: "library" },
  { name: "TensorFlow", level: 2, category: "library" },

  // Frameworks
  { name: "React", level: 2, category: "framework" },
  { name: "React Native", level: 1, category: "framework" },
  { name: "JavaFX", level: 1, category: "framework" },
];

// Data for EducationSection.jsx
const education = [
  {
    degree: "Honours Bachelor of Science, Computer Science Specialist",
    focus: "Artificial Intelligence",
    school: "University of Toronto",
    location: "Toronto, Canada",
    date: "Expected June 2027",
    coursework: [
      "CSC413 — Neural Networks & Deep Learning",
      "CSC311 — Machine Learning",
      "CSC384 — Artificial Intelligence",
      "CSC373 — Algorithm Design",
      "CSC343 — Database Systems",
      "CSC209 — Systems Programming",
      "CSC263 — Data Structures",
      "CSC309 — Web Programming",
    ],
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
  skills,
  skillCategories,
  skillLevels,
  education,
};