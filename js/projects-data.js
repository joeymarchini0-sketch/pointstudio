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
 *      (Older entries may use featureImage / photos instead of blocks;
 *      both still work.)
 *   3. Save. That's it — no HTML to touch.
 *
 * TEMPLATE
 *   {
 *     slug: "glen-park-remodel",          // URL name: lowercase, dashes, unique
 *     title: "Glen Park Remodel",
 *     cardTitle: "Glen Park<br />Remodel",// optional: hover title with line break
 *     card: "project-images/glen-park-remodel/card.jpg",  // gallery photo
 *     cover: "project-images/glen-park-remodel/cover.jpg",// full-width top photo
 *     coverPosition: "center 70%",        // optional: move the cover crop
 *                                         // (0% = show top, 100% = show bottom)
 *     scope: [                            // lines under the title
 *       "Kitchen remodel",
 *       "New rear deck"
 *     ],
 *     description: [                      // one entry per paragraph
 *       "First paragraph…"
 *     ],
 *     blocks: [                           // the page body, top to bottom
 *       { type: "feature", side: "left", photos: ["project-images/glen-park-remodel/01.jpg"] },
 *       { type: "row", photos: ["project-images/glen-park-remodel/02.jpg",
 *                               "project-images/glen-park-remodel/03.jpg"] }
 *     ],
 *     credits: [                          // one line each; links allowed
 *       'Builder Name - GC',
 *       '<a href="https://example.com">Photographer</a> - Photography'
 *     ]
 *   },
 *
 * BLOCKS (any number, any order)
 *   feature – 1 or 2 photos side by side, with text beside them.
 *             side: "left" (photos left of text) or "right".
 *             text: optional; defaults to the project's description. Give a
 *             block its own text: ["Paragraph…"] for a second text section.
 *   row     – 1 to 3 photos side by side at matching heights. A single tall
 *             photo is centered and kept within the screen height.
 *   text    – a text section on its own (text: [...], or the description).
 *   On phones, every photo stacks on its own line, photos before their text.
 *
 * NOTES
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
    description: [
      "Our clients wanted to maximize function and breathe new life into their family gathering spaces with light and color, which drove every decision as we added a third floor to their two-story 1900s Edwardian. A light-filled stairway with floating oak treads and a glass-walled bridge now connects the existing bedrooms to the new primary suite. Skylights draw daylight into the shared rooms at the center of the home’s deep footprint. Ultimately, carefully targeted interventions improved how the house works, while interiors that reflect the family’s cheerful personality enhanced the charm they first loved about it."
    ],
    blocks: [
      { type: "feature", side: "left", photos: ["project-images/inner-richmond-addition/01.jpg"] },
      { type: "row", photos: [
        "project-images/inner-richmond-addition/02.jpg",
        "project-images/inner-richmond-addition/03.jpg"
      ] }
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
    coverPosition: "center 78%", // shift the crop down to show the bed
    scope: [
      "Exterior refresh",
      "Deck addition",
      "Select modifications of existing floorplan",
      "Kitchen and bathroom modernizations",
      "Maintain existing building footprint"
    ],
    description: [
      "Part of an ongoing years-long renovation of our East Bay home that's been in the family for three generations. The tiny en-suite water closet became far more functional with the addition of a diagonal, wood-clad wall allowing for a roomy walk-in shower. Inside, the walls and ceiling are drenched in silky plaster, creating a calm cool retreat despite the small footprint."
    ],
    blocks: [
      { type: "feature", side: "left", photos: [
        "project-images/hidden-suite/01.jpg",
        "project-images/hidden-suite/02.jpg"
      ] }
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

// Lets the deploy build (build.js) read this list. Keep this as the last line.
if (typeof module !== "undefined" && module.exports) module.exports = PROJECTS;
