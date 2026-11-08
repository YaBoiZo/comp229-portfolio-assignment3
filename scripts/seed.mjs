import {
  connectDatabase,
  disconnectDatabase,
} from "../server/config/database.js";
import { User } from "../server/models/user.model.js";
import { Project } from "../server/models/project.model.js";
import { Qualification } from "../server/models/qualification.model.js";
const projects = [
  {
    number: "01",
    title: "TikTok Content Automation",
    type: "Content workflow",
    image: "/assets/projects/tiktok-content-automation.png",
    description:
      "An automated workflow for turning content ideas into a consistent short-form publishing pipeline, reducing repetitive production and scheduling work.",
    role: "I designed the automation flow, connected the content stages, and organized the process for repeatable publishing.",
    outcome:
      "A reusable system that makes content production more consistent and easier to manage.",
    tools: ["Automation", "AI content", "Workflow design"],
  },
  {
    number: "02",
    title: "Sales Lead Generation System",
    type: "Business automation",
    image: "/assets/projects/sales-lead-generation.png",
    description:
      "A lead-generation workflow created to discover, organize, and qualify potential customers before outreach.",
    role: "I mapped the prospecting process and built the logic for collecting, filtering, and prioritizing useful lead information.",
    outcome:
      "A clearer sales pipeline that reduces manual research and helps focus attention on stronger opportunities.",
    tools: ["Lead research", "Data enrichment", "Process automation"],
  },
  {
    number: "03",
    title: "Custom AI Chatbot for Websites",
    type: "AI implementation",
    image: "/assets/projects/website-ai-chatbot.png",
    description:
      "A customizable website assistant designed to answer visitor questions using a business's own information and support content.",
    role: "I shaped the conversation flow, knowledge structure, and website experience around practical customer questions.",
    outcome:
      "An always-available support experience that helps visitors find answers and connect with the business faster.",
    tools: ["AI chatbot", "Knowledge base", "Web integration"],
  },
];
await connectDatabase();
try {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12)
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in .env.",
    );
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (!existing)
    await User.create({
      name: "Zohaib Syed",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
  else if (existing.role !== "admin")
    throw new Error(
      "The configured email belongs to a regular user. Choose a separate admin email.",
    );
  const owner = {
    firstname: "Zohaib",
    lastname: "Syed",
    email: "zsyed26@my.centennialcollege.ca",
  };
  if (!(await Project.exists({})))
    await Project.insertMany(
      projects.map(({ role, ...project }) => ({
        ...project,
        ...owner,
        roleDescription: role,
        completion: "2026-10-01",
      })),
    );
  if (!(await Qualification.exists({})))
    await Qualification.insertMany([
      {
        ...owner,
        title: "Artificial Intelligence – Software Engineering Technology",
        institution: "Centennial College",
        start: "July 2025",
        completion: "2028-04-30",
        status: "In progress",
        description:
          "Developing practical skills in software development, web technologies, artificial intelligence, and building technology solutions for real-world needs.",
      },
      {
        ...owner,
        title: "Business Management Diploma",
        institution: "Oxford College of Arts, Business and Technology",
        start: "February 2022",
        completion: "2022-10-31",
        status: "Completed · 95% average",
        description:
          "Studied human resources, marketing, business law, small-business management, planning, bookkeeping, financial accounting, Microsoft Excel, QuickBooks, and Microsoft Access.",
      },
    ]);
  console.log(
    "Admin account and portfolio content are ready. Existing records were preserved.",
  );
} finally {
  await disconnectDatabase();
}
