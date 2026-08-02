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
 */

const PROJECTS = [
  {
    slug: "project-1",
    sheet: "A-01",
    title: "Project 1",
    location: "City, CA",
    year: "2024",
    category: "Full Renovation",
    image: "images/projects/project-01.jpg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project — the design intent, the scope of work, and anything about the client's brief worth telling a visitor.",
      "You can add a second paragraph here if there's more to say about materials, site constraints, or the process."
    ]
  },
  {
    slug: "project-2",
    sheet: "A-02",
    title: "Project 2",
    location: "City, CA",
    year: "2023",
    category: "Addition",
    image: "images/projects/placeholder-02.svg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  },
  {
    slug: "placeholder-project-three",
    sheet: "A-03",
    title: "Project Title Three",
    location: "City, CA",
    year: "2023",
    category: "New Construction",
    image: "images/projects/placeholder-03.svg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  },
  {
    slug: "placeholder-project-four",
    sheet: "A-04",
    title: "Project Title Four",
    location: "City, CA",
    year: "2022",
    category: "Kitchen + Bath",
    image: "images/projects/placeholder-04.svg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  },
  {
    slug: "placeholder-project-five",
    sheet: "A-05",
    title: "Project Title Five",
    location: "City, CA",
    year: "2022",
    category: "ADU",
    image: "images/projects/placeholder-05.svg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  },
  {
    slug: "placeholder-project-six",
    sheet: "A-06",
    title: "Project Title Six",
    location: "City, CA",
    year: "2021",
    category: "Full Renovation",
    image: "images/projects/placeholder-06.svg",
    summary: "A one-line description of this project goes here.",
    description: [
      "Replace this paragraph with a description of the project."
    ]
  }
];
