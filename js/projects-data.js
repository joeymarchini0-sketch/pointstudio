/**
 * PROJECTS DATA
 * =============
 * This is the only file you need to touch to add, remove, or update a
 * project. The home page gallery and every individual project page are
 * generated from this list automatically — no HTML editing required.
 *
 * To add a new project:
 *   1. Drop the image file into /images/projects/
 *   2. Copy one of the objects below, paste it as a new entry, and edit
 *      the fields.
 *   3. Make sure `slug` is unique — it becomes the project's URL,
 *      e.g. slug: "oak-street-residence" -> project.html?slug=oak-street-residence
 *
 * Field guide:
 *   sheet      - architectural sheet number shown as a small label (e.g. "A-01")
 *   title      - project name shown on the card and detail page
 *   location   - city / neighborhood
 *   year       - completion year (or "In progress")
 *   category   - short type label, e.g. "Full Renovation", "New Construction"
 *   image      - path to the hero/card image
 *   summary    - one sentence shown on the home page card (kept short)
 *   description- one or more paragraphs shown on the project detail page
 *
 * Optional fields for the full project page layout (see Inner Richmond):
 *   cardTitle    - gallery hover title with line breaks (<br />)
 *   cardWide     - true = gallery card shown wide at full height (landscape photos)
 *   cover        - full-width photo at the top of the project page
 *   scope        - list of scope lines shown under the title
 *   featureImage - photo shown left of the description
 *   pair         - two photos shown side by side
 *   credits      - collaborator lines (links allowed)
 * Put each project's photos in its own folder in /project-images/.
 */

const PROJECTS = [
  {
    slug: "inner-richmond-addition",
    title: "Inner Richmond Addition",
    // Title shown over the photo on hover in the gallery (<br /> = line break)
    cardTitle: "Inner Richmond<br />Addition",
    // Gallery card photo (same as the project page cover)
    image: "project-images/inner-richmond-addition/cover.jpg",
    // Show this card wide, at the full gallery height, in the photo's own shape
    cardWide: true,
    // Project page
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
    // Photos shown side by side, at matching heights
    pair: [
      "project-images/inner-richmond-addition/02.jpg",
      "project-images/inner-richmond-addition/03.jpg"
    ],
    // One line each. Links use <a href="...">name</a>.
    credits: [
      'Completed as Designer &amp; Project Manager while at <a href="http://johnlumarchitecture.com">John Lum Architecture</a>',
      "Bryce CB Construction - GC",
      '<a href="https://www.fletcherrhodes.com/">Fletcher Rhodes Design</a> - Interiors',
      "LX Engineering - Structural",
      '<a href="https://www.jessicaburke.com/">Jessica Burke</a> - Photography'
    ]
  },
  {
    slug: "project-2",
    sheet: "A-02",
    title: "Project 2",
    location: "City, CA",
    year: "2023",
    category: "Addition",
    image: "images/projects/project-02.jpg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  },
  {
    slug: "project-3",
    sheet: "A-03",
    title: "Project 3",
    location: "City, CA",
    year: "2023",
    category: "New Construction",
    image: "images/projects/project-03.jpg",
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
    image: "images/projects/project-04.jpg",
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
    image: "images/projects/project-05.jpg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  }
];
