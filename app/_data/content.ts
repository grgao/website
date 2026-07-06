export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  status: "ACTIVE" | "ARCHIVED";
  highlights: string[];
  accent: "primary" | "accent" | "danger";
};

// A scroll destination in the 3D city. Each stop gets its own snap section;
// the camera flies to worldPos and the stop's box expands when settled.
export type Stop = {
  id: string;
  kind: "dossier" | "experience" | "loadout";
  worldPos: [number, number, number];
  accent: "primary" | "accent";
  label: string;
  sublabel: string;
};

export const STOPS: Stop[] = [
  {
    id: "loadout",
    kind: "loadout",
    worldPos: [3, 6, 3],
    accent: "accent",
    label: "LOADOUT",
    sublabel: "Languages & platforms",
  },
  {
    id: "firetiger",
    kind: "experience",
    worldPos: [-2, 6, -8],
    accent: "primary",
    label: "FIRETIGER",
    sublabel: "Systems Engineer",
  },
  {
    id: "uline",
    kind: "experience",
    worldPos: [14, 5, -22],
    accent: "accent",
    label: "ULINE",
    sublabel: "Software Developer Intern",
  },
  {
    id: "thomson-reuters",
    kind: "experience",
    worldPos: [-16, 4, -28],
    accent: "accent",
    label: "THOMSON REUTERS",
    sublabel: "Software Engineer Intern",
  },
  {
    id: "pitt",
    kind: "experience",
    worldPos: [8, 3, -42],
    accent: "accent",
    label: "UNIV. OF PITTSBURGH",
    sublabel: "Research Intern",
  },
  {
    id: "dossier",
    kind: "dossier",
    worldPos: [-4, 8, -54],
    accent: "accent",
    label: "DOSSIER",
    sublabel: "Pilot profile",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "firetiger",
    company: "FIRETIGER",
    role: "Systems Engineer",
    location: "San Francisco, CA",
    start: "2025-06",
    end: "PRESENT",
    status: "ACTIVE",
    accent: "primary",
    highlights: [
      "Built Go backend services for an LLM-powered investigation agent that analyzes telemetry and detects data issues.",
      "Designed session/state coordination logic; defined RPC contracts with protobuf and ConnectRPC.",
      "Deployed ECS services and Docker sidecar images across AWS + GCP via Terraform.",
      "Instrumented systems with OpenTelemetry, shipping metrics to Grafana Cloud and internal sinks.",
      "Cut Grafana Cloud costs by 90% by mitigating high-cardinality metric explosion.",
      "Optimized a search query 94% (17s → <1s) via parallelism and HEAD-request swaps.",
    ],
  },
  {
    id: "uline",
    company: "ULINE",
    role: "Software Developer Intern",
    location: "Kenosha, WI",
    start: "2024-05",
    end: "2024-08",
    status: "ARCHIVED",
    accent: "accent",
    highlights: [
      "Migrated data service from LUW tables to Apache Cassandra for continuous availability and scale.",
      "Reduced tech debt by retiring LaunchDarkly flags and modernizing legacy code paths.",
      "Eliminated formula-injection risk across 30k+ shopping lists with SQL sanitization + input rejection.",
      "Shipped weekly C#/.NET, SQL, and Java sprint work: bugfixes, features, APIs.",
    ],
  },
  {
    id: "thomson-reuters",
    company: "THOMSON REUTERS",
    role: "Software Engineer Intern",
    location: "Remote",
    start: "2023-06",
    end: "2023-12",
    status: "ARCHIVED",
    accent: "accent",
    highlights: [
      "Built IaC with AWS CDK to deploy weekly Lambda report jobs.",
      "Created a central monorepo (Python/Java) for predictable, repeatable infrastructure constructs.",
      "Queried Snowflake data cloud with SQL; wrote unit tests for new features.",
      "Built business-analytics dashboards in Power BI; automated GitHub → ADO connections.",
      "Rotated across 3 teams: Development, Embedded Engagements, Enablements.",
    ],
  },
  {
    id: "pitt",
    company: "UNIV. OF PITTSBURGH",
    role: "Research Intern",
    location: "Pittsburgh, PA",
    start: "2019-07",
    end: "2019-08",
    status: "ARCHIVED",
    accent: "accent",
    highlights: [
      "Performed data analysis and uploaded research datasets.",
      "Assisted an engineering research project; reviewed scientific literature.",
    ],
  },
];

export const SKILLS = {
  languages: [
    "TypeScript",
    "JavaScript",
    "Go",
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "SQL",
    "Verilog",
    "HTML",
    "CSS",
    "Terraform",
  ],
  platforms: [
    "AWS",
    "GCP",
    "Docker",
    "ECS",
    "Terraform",
    "Datadog",
    "Grafana Cloud",
    "OpenTelemetry",
    "ConnectRPC",
    "protobuf",
    "LaunchDarkly",
    "Azure DevOps",
    "PowerBI",
    ".NET",
    "React",
    "Next.js",
  ],
};

export const EDUCATION = {
  school: "University of Wisconsin-Madison",
  degree: "BS Computer Engineering · BS Computer Science",
  range: "SEP 2021 - MAY 2025",
};

export const CONTACT = {
  name: "Grace Elizabeth Gao",
  location: "San Francisco, CA",
  email: "gaograce301@gmail.com",
  workEmail: "grace@firetiger.com",
  phone: "+1 (724) 472-5001",
  linkedin: "https://www.linkedin.com/in/grace-gao-6b9321293/",
  github: "https://github.com/grgao",
};
