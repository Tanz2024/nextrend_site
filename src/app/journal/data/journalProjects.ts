import { buildJournalUrl, buildJournalImageUrl } from "@/lib/assets";

export type JournalProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type JournalProject = {
  slug: string;
  projectNumber: string;
  title: string;
  description: string;
  category: string;
  timeline: string;
  topics: string[];
  heroImage: string;
  heroAlt: string;
  readTime: string;
  images: JournalProjectImage[];
  content: {
    overview: string[];
    insights: string[];
    methodology?: string[];
    story: string[];
  };
  relatedProjects?: string[];
};

export const journalProjects: JournalProject[] = [
  {
    slug: 'speaker-placement-5-sound-advice',
    projectNumber: '01',
    title: '5 Sound Advice for a Well-Placed Speaker System',
    description:
      'Five placement principles to help you decide between absolute fidelity and seamless aesthetics—so your system sounds right and looks invisible.',
    category: 'Architectural Sound',
    timeline: '2025 · KL Atelier',
    topics: ['Placement', 'Acoustics', 'Aesthetics', 'Calibration'],
    heroImage: buildJournalImageUrl('Journal.png'),
    heroAlt: 'Minimal living space with concealed slim speakers',
    readTime: '7 min read',
    images: [
      { src: buildJournalUrl('Journal_project_image.png'), alt: 'Front stage layout sketch' },
      { src: buildJournalUrl('Journal_project_image2.png'), alt: 'Listening triangle diagram' },
      { src: buildJournalUrl('Journal_project_image3.png'), alt: 'Reflections and absorption map' },
    ],
content: {
  overview: [
    "Great sound is a placement problem first. Decide if you value studio-grade imaging or low-visibility aesthetics—then place for both.",
    "Before mounting anything, assess noise and reflections, lock the listening area, and size the system to the room."
  ],
  insights: [
    "Assess acoustics & noise: identify outside noise, tame early reflections with curtains, rugs, millwork; small changes matter.",
    "Match speakers to room size: measure; define the listening position; scale quantity/output to coverage—not just SPL.",
    "Clarify function: cinema, stereo, or background music dictates pattern control, height, and dispersion targets.",
    "Positioning basics: aim mains at ear height; keep reasonable spacing (small rooms ~6 ft triangle, large rooms 8–10 ft+).",
    "Open plans: widen spacing (20–24 ft) and raise height (≈10–12 ft) to maintain coverage.",
    "Subwoofers: avoid corners; start near the mains facing the listening area; consider multiple subs for smoother bass.",
    "Background music: even coverage > loudness; avoid firing directly at guests; eliminate dead spots.",
    "Integration: choose slim/hidden forms; coordinate finishes (RAL, metals) so hardware visually disappears."
  ],
  methodology: [
    "Sketch room + mark listening area → quick noise/reflection audit.",
    "Mock placement with temporary stands; move in ≤3 cm steps; level-match A/B.",
    "Set toe-in, verify imaging with pink noise + music; document final angles, spacing, EQ deltas."
  ],
  story: [
    "Most rooms don’t need bigger speakers—just better placement. With slim arrays and disciplined setup, the stage locks in while the hardware blends into the architecture.",
    "Nextrend pairs K-array/KGear (slim & finish-matched) and Amina (invisible) to achieve low-visibility systems that still feel luxurious."
  ]
},  
    relatedProjects: ['karray-aurum-cinema', 'karray-top-10-commercial'],
  },
  {
    slug: 'karray-aurum-cinema',
    projectNumber: '02',
    title: 'K-array: A Gold Class Cinema & Karaoke Experience for Aurum Theatre',
    description:
      'Behind the scenes of a boutique cinema where ultra-slim arrays deliver both film-grade dynamics and private-suite karaoke energy.',
    category: 'Case Study',
    timeline: '2024 · Aurum Theatre',
    topics: ['Cinema', 'K-array', 'Karaoke', 'Integration'],
    heroImage: buildJournalImageUrl('Journal 2.png'),
    heroAlt: 'Aurum Theatre luxury cinema suite with slim speaker arrays',
    readTime: '6 min read',
    images: [
      { src: buildJournalUrl('Journal_project2_image1.jpg'), alt: 'Reclining seats with integrated audio' },
      { src: buildJournalUrl('Journal_project2_image2.jpg'), alt: 'Slim line array near screen wall' },
    ],
    content: {
      overview: [
        'Luxury seating meets discreet, high-output sound reinforcement.',
        'K-array’s profile enables premium sightlines without sacrificing SPL headroom.',
      ],
      insights: [
        'Tuning for cinema + karaoke requires dual-mode presets and gain-structure discipline.',
        'Low visual impact improves audience immersion and perceived luxury.',
        'Seat-to-seat consistency matters more than raw peak SPL in boutique rooms.',
      ],
      methodology: [
        'Separate film and karaoke voicings with locked recall scenes.',
        'Seat map sweeps for level variance; target ±2 dB across rows.',
      ],
      story: [
        'Guests remember the effortless feel: dialogue intelligibility by day, private lounge energy by night—same room, two rituals.',
      ],
    },
    relatedProjects: ['speaker-placement-5-sound-advice', 'karray-top-10-commercial'],
  },
  {
    slug: 'karray-top-10-commercial',
    projectNumber: '03',
    title: 'Top 10 K-array Commercial Projects',
    description:
      'A curated roundup of K-array installations across hospitality, retail, residential, and commercial spaces.',
    category: 'Roundup',
    timeline: '2024 · Global',
    topics: ['K-array', 'Commercial', 'Hospitality', 'Retail'],
    heroImage: buildJournalImageUrl('Journal 2.png'),
    heroAlt: 'Collage of ten commercial venues using K-array',
    readTime: '5 min read',
    images: [
      { src: buildJournalUrl('Journal_project3_image1.jpg'), alt: 'Retail atrium with column arrays' },
      { src: buildJournalUrl('Journal_project3_image2.jpg'), alt: 'Hotel bar with invisible audio' },
    ],
    content: {
      overview: [
        'K-array’s architecture-friendly format adapts to diverse typologies.',
        'These ten picks show how form and function coexist in public spaces.',
      ],
      insights: [
        'Slim profiles protect sightlines and brand visuals.',
        'Consistent voicing across product families simplifies multi-zone projects.',
        'Scalable accessories reduce install time and visual clutter.',
      ],
      story: [
        'From quiet retail galleries to energetic lounges, the thread is the same: sound that belongs to the room—not the rack.',
      ],
    },
    relatedProjects: ['karray-aurum-cinema', 'architectural-sound-solutions'],
  },
  {
    slug: 'architectural-sound-solutions',
    projectNumber: '04',
    title: 'What is Architectural Sound Solutions?',
    description:
      'Designing for form, function, and feeling—how we deliver low-visibility sound systems that elevate everyday environments.',
    category: 'Architectural Sound',
    timeline: '2025 · Practice Notes',
    topics: ['Integration', 'Low-Visibility', 'System Design'],
    heroImage: buildJournalImageUrl('Journal 3.png'),
    heroAlt: 'Architectural plan with integrated audio zones',
    readTime: '8 min read',
    images: [
      { src: buildJournalUrl('Journal_project4_image1.jpg'), alt: 'Plan view of audio zones with finishes' },
    ],
    content: {
      overview: [
        'Architecture today expects sensory performance, not just structure.',
        'We design systems that are felt, not seen—aligned to spatial intent.',
      ],
      insights: [
        'Early alignment with architects prevents late-stage compromises.',
        'Material palettes can act as passive acoustic tools.',
        '“Invisible” doesn’t mean inaudible—headroom is still sacred.',
      ],
      methodology: [
        'Discovery on intent → acoustic modeling → finish coordination → commissioning.',
      ],
      story: [
        'When systems harmonise with millwork and light, visitors remember atmosphere over equipment. That’s the point.',
      ],
    },
    relatedProjects: ['speaker-placement-5-sound-advice'],
  },
  {
    slug: 'karray-sound-solution-inspiration',
    projectNumber: '05',
    title: 'K-array Sound Solution Inspiration',
    description:
      'A lookbook for designers and homeowners seeking modern, space-conscious speakers that upgrade any environment.',
    category: 'Inspiration',
    timeline: '2024 · Lookbook',
    topics: ['Lookbook', 'Residential', 'Commercial', 'K-array'],
    heroImage: buildJournalImageUrl('Journal 4.png'),
    heroAlt: 'Lookbook spread showing slim speakers in modern interiors',
    readTime: '4 min read',
    images: [
      { src: buildJournalUrl('Journal_project5_image.png'), alt: 'Home living space with micro-arrays' },
      { src: buildJournalUrl('Journal_project5_image2.png'), alt: 'Cafe counter with discreet speakers' },
    ],
    content: {
      overview: [
        'Modern rooms deserve modern sound—clean lines, compact forms, confident performance.',
        'This roundup highlights placements that respect both design and acoustics.',
      ],
      insights: [
        'Slim columns excel near glazing and artwork where bulk kills the vibe.',
        'Matching finishes to metalwork and stone keeps systems visually coherent.',
      ],
      story: [
        'Whether it’s a private lounge or a boutique retail floor, inspiration starts with seeing what’s possible in real spaces.',
      ],
    },
    relatedProjects: ['karray-top-10-commercial', 'architectural-sound-solutions'],
  },
];
