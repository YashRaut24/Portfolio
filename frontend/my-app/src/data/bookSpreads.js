export const bookSpreads = [
  {
    id: 0,
    left: { type: 'inside-cover' },
    right: {
      type: 'toc',
      title: 'Contents',
      entries: [
        { label: 'First Year', spreadIndex: 2 },
        { label: 'Second Year', spreadIndex: 2 },
        { label: 'Projects', spreadIndex: 3 },
        { label: "Let's Talk", spreadIndex: 4 },
      ],
    },
  },
{
    id: 1,
    left: { type: 'placeholder' },
    right: {
      type: 'intro',
      quote: 'Building scalable solutions, one line at a time.',
      description: 'A short line about who I am and what drives me goes here.',
    },
  },
  {
    id: 2,
    left: {
      type: 'timeline',
      year: '2023 - 2024',
      title: 'First Year', 
      keywords: ['C', 'C++', 'Java'],
      annotation: "still fixing this page at 2am lol",
      annotationPosition: "bottom-left", // or "top-right" (default)
    },
    right: {
      type: 'timeline',
      year: '2024 - 2025',
      title: 'Second Year',
      keywords: ['MERN Stack', 'DSA Basics'],
    },
  },
  {
    id: 3,
    left: {
      type: 'timeline',
      year: '2025 - 2026',
      title: 'Third Year',
      keywords: ['AI Engineering', 'FastAPI', 'React'],
    },
    right: {
      type: 'timeline',
      year: '2026 - Ongoing',
      title: 'Fourth Year',
      keywords: ['Placeholder'],
    },
  },
  {
    id: 4,
    left: { type: 'blank' },
    right: { type: 'cta' },
  },
];