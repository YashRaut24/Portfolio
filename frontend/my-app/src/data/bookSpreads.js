export const bookSpreads = [
  {
    id: 0,
    left: { type: 'inside-cover' },
    right: {
      type: 'toc',
      pageNumber: 1,
      title: 'Contents',
      entries: [
        { label: 'First Year', spreadIndex: 2, pageNumber: 4 },
        { label: 'Second Year', spreadIndex: 2, pageNumber: 5 },
        { label: 'Projects', spreadIndex: 3, pageNumber: 6 },
        { label: "Let's Talk", spreadIndex: 4, pageNumber: 9 },
      ],
    },
  },
  {
    id: 1,
    left: {
    type: 'quick-facts',
    pageNumber: 2,
    title: 'Quick Facts',
  facts: [
    { icon: 'pin', text: 'Based in India' },
    { icon: 'code', text: 'Currently building AI-powered apps' },
    { icon: 'clock', text: '2+ years of coding experience' },
    { icon: 'spark', text: 'Fun fact: debugs better with chai in hand' },
    { icon: 'rocket', text: 'Loves shipping side projects fast' },
    { icon: 'book', text: 'Always picking up something new to learn' },
    { icon: 'gamepad', text: 'Unwinds with a bit of gaming after long coding sessions' },
  ],
},
right: {
  type: 'intro',
  pageNumber: 3,
  quote: 'Still learning. Still shipping.',
  description: "I'm an AI Engineer and Full-Stack Developer who likes picking things apart to understand how they work, then building something new with that knowledge.",
  focusAreas: ['AI/ML', 'Full-Stack Dev', 'System Design'],
  currentlyExploring: 'Currently exploring: LLM agents & RAG pipelines',
},
  },
  {
    id: 2,
    left: {
      type: 'timeline',
      pageNumber: 4,
      year: '2023 - 2024',
      title: 'First Year',
      description: "Spent this year exploring different languages and fields, a bit of everything before figuring out what clicked.",
      keywords: ['C', 'HTML', 'CSS', 'JavaScript', 'Java (Certified)', 'Python Basics'],
    },
    right: {
      type: 'timeline',
      pageNumber: 5,
      year: '2024 - 2025',
      title: 'Second Year',
      description: "Moved from exploring to building, started real projects in Java and Python, and went deep into the MERN stack.",
      keywords: ['Java', 'Python', 'MongoDB', 'Express', 'React', 'Node.js', 'Basic DSA'],
      annotation: "tried learning DSA, still a work in progress lol",
      annotationPosition: "bottom-left", 
    },
  },
  {
    id: 3,
    left: {
      type: 'timeline',
      pageNumber: 6,
      year: '2025 - 2026',
      title: 'Third Year',
      keywords: ['AI Engineering', 'FastAPI', 'React'],
    },
    right: {
      type: 'timeline',
      pageNumber: 7,
      year: '2026 - Ongoing',
      title: 'Fourth Year',
      keywords: ['Placeholder'],
    },
  },
  {
    id: 4,
    left: { type: 'placeholder', pageNumber: 8 },
    right: { type: 'cta', pageNumber: 9 },
  },
];

export const hiddenSpread = {
  id: 'secret',
  left: { type: 'placeholder' },
  right: {
    type: 'intro',
    quote: "You actually found this. Respect.",
    description: "This page doesn't officially exist. Thanks for poking around — that kind of curiosity is basically half of engineering.",
  },
};