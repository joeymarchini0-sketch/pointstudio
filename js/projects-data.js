/**
 * PROJECTS DATA
 * =============
 * The only file to edit to add, remove, reorder or update a project. The
 * Selected Work gallery, every project page, and the Previous / Next links
 * are all built from this list. Order here = order on the site.
 *
 * TO ADD A PROJECT
 *   1. Make a folder for its photos: /project-images/<slug>/
 *      e.g. /project-images/glen-park-remodel/cover.jpg, 01.jpg, 02.jpg ...
 *   2. Copy the TEMPLATE below into the list where you want it to appear,
 *      fill it in, and delete any optional lines you don't need.
 *   3. Save. That's it — no HTML to touch.
 *
 * TEMPLATE
 *   {
 *     slug: "glen-park-remodel",          // URL name: lowercase, dashes, unique
 *     title: "Glen Park Remodel",
 *     cardTitle: "Glen Park<br />Remodel",// optional: hover title with line break
 *     card: "project-images/glen-park-remodel/01.jpg",   // gallery photo
 *     cover: "project-images/glen-park-remodel/cover.jpg",// full-width top photo
 *     scope: [                            // lines under the title
 *       "Kitchen remodel",
 *       "New rear deck"
 *     ],
 *     featureImage: "project-images/glen-park-remodel/01.jpg", // left of text
 *     description: [                      // one entry per paragraph
 *       "First paragraph…"
 *     ],
 *     photos: [                           // optional: 1–3 photos in a row,
 *       "project-images/glen-park-remodel/02.jpg"  // shown at matching heights
 *     ],
 *     credits: [                          // one line each; links allowed
 *       'Builder Name - GC',
 *       '<a href="https://example.com">Photographer</a> - Photography'
 *     ]
 *   },
 *
 * NOTES
 *   - Gallery photos are shown at a standard size: portrait photos 3:4,
 *     landscape photos 4:3 (cropped from the center if needed).
 *   - Use &amp; for "&" inside text.
 */

const PROJECTS = [
  {
    slug: "inner-richmond-addition",
    title: "Inner Richmond Addition",
    cardTitle: "Inner Richmond<br />Addition",
    card: "project-images/inner-richmond-addition/cover.jpg",
    cover: "project-images/inner-richmond-addition/cover.jpg",
    scope: [
      "3rd floor addition",
      "Select modifications of existing floorplan",
      "New interior stair",
      "Interior finishes coordination",
      "Exterior detailing"
    ],
    featureImage: "project-images/inner-richmond-addition/01.jpg",
    description: [
      "Our clients wanted to maximize function and breathe new life into their family gathering spaces with light and color, which drove every decision as we added a third floor to their two-story 1900s Edwardian. A light-filled stairway with floating oak treads and a glass-walled bridge now connects the existing bedrooms to the new primary suite. Skylights draw daylight into the shared rooms at the center of the home’s deep footprint. Ultimately, carefully targeted interventions improved how the house works, while interiors that reflect the family’s cheerful personality enhanced the charm they first loved about it."
    ],
    photos: [
      "project-images/inner-richmond-addition/02.jpg",
      "project-images/inner-richmond-addition/03.jpg"
    ],
    credits: [
      'Completed as Designer &amp; Project Manager while at <a href="http://johnlumarchitecture.com">John Lum Architecture</a>',
      "Bryce CB Construction - GC",
      '<a href="https://www.fletcherrhodes.com/">Fletcher Rhodes Design</a> - Interiors',
      "LX Engineering - Structural",
      '<a href="https://www.jessicaburke.com/">Jessica Burke</a> - Photography'
    ]
  },
  {
    slug: "hidden-suite",
    title: "Hidden Suite",
    card: "project-images/hidden-suite/01.jpg",
    cover: "project-images/hidden-suite/cover.jpg",
    scope: [
      "Exterior refresh",
      "Deck addition",
      "Select modifications of existing floorplan",
      "Kitchen and bathroom modernizations",
      "Maintain existing building footprint"
    ],
    featureImage: "project-images/hidden-suite/01.jpg",
    description: [
      "Part of an ongoing years-long renovation of our East Bay home that's been in the family for three generations. The tiny en-suite water closet became far more functional with the addition of a diagonal, wood-clad wall allowing for a roomy walk-in shower. Inside, the walls and ceiling are drenched in silky plaster, creating a calm cool retreat despite the small footprint."
    ],
    photos: [
      "project-images/hidden-suite/02.jpg"
    ],
    credits: [
      "Joey Marchini - DIY builder",
      "Edwin Camacho - Expert Builder"
    ]
  },

  // ---- Placeholders below: replace with real projects ----
  {
    slug: "project-3",
    sheet: "A-03",
    title: "Project 3",
    location: "City, CA",
    year: "2023",
    category: "New Construction",
    card: "images/projects/project-03.jpg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  },
  {
    slug: "project-4",
    sheet: "A-04",
    title: "Project 4",
    location: "City, CA",
    year: "2022",
    category: "Kitchen + Bath",
    card: "images/projects/project-04.jpg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  },
  {
    slug: "project-5",
    sheet: "A-05",
    title: "Project 5",
    location: "City, CA",
    year: "2022",
    category: "ADU",
    card: "images/projects/project-05.jpg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  }
];
