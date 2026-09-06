/**
 * Content for the Mangalam Vidya Vihar site.
 *
 * `verified: true` entries come from the school's existing public website
 * (name, address, email, phone, page structure, event labels).
 * Everything else is clearly labelled demo/placeholder content and must be
 * replaced with school-approved copy before production.
 */

export const school = {
  name: "Mangalam Vidya Vihar",
  shortName: "MVV",
  location: "Morak, Kota, Rajasthan",
  foundation: "Mangalam Pragati Foundation",
  address: "Basant Vihar, Aditya Nager, Morak, District Kota (Rajasthan), PIN 326520",
  email: "mvvmorak@gmail.com",
  phones: ["9461811678", "704433502"],
  officeHours: "Monday – Saturday · 09:00 – 15:00 (verify with school)",
};

export type NavLink = { label: string; to: string; params?: Record<string, string> };

export const primaryNav: NavLink[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Admissions", to: "/admissions" },
  { label: "Campus", to: "/campus" },
  { label: "Activities", to: "/activities" },
  { label: "Achievements", to: "/achievements" },
  { label: "Faculty", to: "/faculty" },
  { label: "Notices", to: "/notices" },
  { label: "Events", to: "/events" },
  { label: "Gallery", to: "/gallery" },
  { label: "Resources", to: "/resources" },
  { label: "Contact", to: "/contact" },
];

export const aboutPages: NavLink[] = [
  { label: "About School", to: "/about" },
  { label: "Vision & Mission", to: "/about/vision" },
  { label: "Principal's Message", to: "/about/principal" },
  { label: "Management", to: "/about/management" },
  { label: "Mandatory Public Disclosure", to: "/about/disclosure" },
];

export type Notice = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  summary: string;
  category: "Circular" | "Examination" | "Admission" | "General" | "PTM";
  verified?: boolean;
  file?: string;
};

export const notices: Notice[] = [
  {
    id: "n-1",
    title: "Notification for Admission 2025-26",
    date: "2025-04-02",
    dateLabel: "02 Apr",
    summary:
      "Admission notification published on the school notice board. Verify the current admission cycle with the school office.",
    category: "Admission",
    verified: true,
    file: "Notification for Admission 2025-26.pdf",
  },
  {
    id: "n-2",
    title: "Almanac 2025-26 (Nursery to Class XII)",
    date: "2025-04-01",
    dateLabel: "01 Apr",
    summary: "Full academic almanac available as a download in Resources.",
    category: "Circular",
    verified: true,
    file: "Almanac 2025-26 NUR TO XII.pdf",
  },
  {
    id: "n-3",
    title: "Parent–teacher meeting for all classes",
    date: "2026-03-02",
    dateLabel: "02 Mar",
    summary: "Discussion of mid-term progress and co-curricular plans.",
    category: "PTM",
  },
  {
    id: "n-4",
    title: "Computer lab timings revised for Classes IX & X",
    date: "2026-02-28",
    dateLabel: "28 Feb",
    summary: "Updated session blocks posted on the notice board.",
    category: "General",
  },
  {
    id: "n-5",
    title: "Library reading week opens",
    date: "2026-02-24",
    dateLabel: "24 Feb",
    summary: "Special hours and a new shelf of regional titles.",
    category: "General",
  },
  {
    id: "n-6",
    title: "Term fee reminder",
    date: "2026-02-20",
    dateLabel: "20 Feb",
    summary: "Please clear dues at the school office before month end.",
    category: "Circular",
  },
  {
    id: "n-7",
    title: "Periodic test schedule circulated",
    date: "2026-02-12",
    dateLabel: "12 Feb",
    summary: "Datesheet shared with class teachers for distribution.",
    category: "Examination",
  },
];

export type SchoolEvent = {
  id: string;
  title: string;
  day: string;
  month: string;
  where: string;
  time: string;
  category: "Cultural" | "Sports" | "Academic" | "Parents";
};

export const events: SchoolEvent[] = [
  { id: "e-1", title: "Annual Science Exhibition", day: "21", month: "Mar", where: "Science block", time: "10:00", category: "Academic" },
  { id: "e-2", title: "Inter-house athletics", day: "04", month: "Apr", where: "School grounds", time: "09:30", category: "Sports" },
  { id: "e-3", title: "Spring recital — music & drama", day: "18", month: "Apr", where: "Assembly hall", time: "17:00", category: "Cultural" },
  { id: "e-4", title: "Parent open day", day: "09", month: "May", where: "Main campus", time: "09:00", category: "Parents" },
  { id: "e-5", title: "Investiture Ceremony", day: "24", month: "May", where: "Assembly hall", time: "08:30", category: "Cultural" },
  { id: "e-6", title: "Summer camp Umang — enrolment", day: "02", month: "Jun", where: "Activity block", time: "08:00", category: "Cultural" },
];

export type Achievement = { id: string; title: string; year: string; verified?: boolean };

export const achievements: Achievement[] = [
  { id: "a-1", title: "Cricket (Under-19 boys) — Champions at state level", year: "2024-25", verified: true },
  { id: "a-2", title: "Winner team at district level in cricket", year: "2024-25", verified: true },
  { id: "a-3", title: "Represented at the district level cricket tournament", year: "2024-25", verified: true },
  { id: "a-4", title: "Sports Meet — Runner Up", year: "2024-25", verified: true },
  { id: "a-5", title: "Distribution of certificates for Olympiad & cultural events", year: "2024-25", verified: true },
  { id: "a-6", title: "हिंदी वाद विवाद प्रतियोगिता — participation", year: "2025-26", verified: true },
];

export const resultAnalysis = [
  { label: "Class X — appeared", value: "—" },
  { label: "Class X — pass percentage", value: "—" },
  { label: "Class XII — appeared", value: "—" },
  { label: "Class XII — pass percentage", value: "—" },
];

export type Facility = {
  slug: string;
  name: string;
  index: string;
  blurb: string;
  detail: string[];
};

export const facilities: Facility[] = [
  {
    slug: "library",
    name: "Library",
    index: "01",
    blurb: "Reference shelves, reading tables and periodicals for all classes.",
    detail: [
      "The library serves as the school's quiet study space with reference sections for each stage.",
      "Detailed collection counts, borrowing rules and reading-period allocation are placeholder content pending school confirmation.",
    ],
  },
  {
    slug: "computer-lab",
    name: "Computer Lab",
    index: "02",
    blurb: "Practical computing sessions timetabled through the week.",
    detail: [
      "The computer lab supports the school's computer science and IT practical periods.",
      "System counts, software and internet provisioning details are placeholder content.",
    ],
  },
  {
    slug: "physics-lab",
    name: "Physics Lab",
    index: "03",
    blurb: "Apparatus for senior secondary practical work.",
    detail: [
      "The physics laboratory supports prescribed practical work for senior classes.",
      "Equipment inventory is placeholder content pending school confirmation.",
    ],
  },
  {
    slug: "chemistry-lab",
    name: "Chemistry Lab",
    index: "04",
    blurb: "Fume provision, reagent storage and experiment benches.",
    detail: [
      "The chemistry laboratory is used for prescribed experiments with supervised safety procedure.",
      "Safety protocol documentation is placeholder content.",
    ],
  },
  {
    slug: "biology-lab",
    name: "Biology Lab",
    index: "05",
    blurb: "Microscopes, models and specimen collection.",
    detail: [
      "The biology laboratory supports dissection-free practical work, models and slide study.",
      "Inventory details are placeholder content.",
    ],
  },
  {
    slug: "indoor-games",
    name: "Indoor Games",
    index: "06",
    blurb: "Indoor games hall used during activity periods.",
    detail: [
      "Indoor games are scheduled through games periods and inter-house activity weeks.",
      "Facility dimensions and equipment lists are placeholder content.",
    ],
  },
];

export type AcademicTopic = {
  slug: string;
  title: string;
  intro: string;
  verified?: boolean;
  sections: { heading: string; body: string[] }[];
};

export const academicTopics: AcademicTopic[] = [
  {
    slug: "school-hours",
    title: "School Hours",
    intro: "Daily timings for the school office, assembly and teaching periods.",
    sections: [
      {
        heading: "Timings",
        body: [
          "Placeholder timings: assembly 07:55, first period 08:10, dispersal 13:40. Winter and summer schedules differ.",
          "The school office is open Monday to Saturday. Confirm current timings with the office before publishing.",
        ],
      },
    ],
  },
  {
    slug: "rules-and-regulations",
    title: "Rules & Regulations",
    intro: "General conduct, uniform and attendance expectations.",
    sections: [
      {
        heading: "General conduct",
        body: [
          "Students are expected to attend in complete school uniform and carry the school diary daily.",
          "Full rules text should be transferred verbatim from the school's approved handbook.",
        ],
      },
      {
        heading: "Attendance",
        body: ["A minimum attendance requirement applies for promotion and board registration. Exact figures pending confirmation."],
      },
    ],
  },
  {
    slug: "admission-eligibility",
    title: "Admission Eligibility",
    intro: "Age and documentation requirements by entry class.",
    sections: [
      {
        heading: "Eligibility",
        body: [
          "Age criteria for entry classes, transfer certificate requirements and previous report card submission apply.",
          "Exact age cut-offs are placeholder content pending school confirmation.",
        ],
      },
    ],
  },
  {
    slug: "mode-of-selection",
    title: "Mode of Selection",
    intro: "How applications are assessed for each stage.",
    sections: [
      {
        heading: "Process",
        body: [
          "Interaction for pre-primary entry; written assessment for higher classes in core subjects.",
          "Weighting and assessment scope are placeholder content.",
        ],
      },
    ],
  },
  {
    slug: "examination-schedule",
    title: "Examination Schedule",
    intro: "Periodic tests, half-yearly and annual examination windows.",
    sections: [
      {
        heading: "Schedule",
        body: [
          "The existing website carries a legacy examination schedule. Treat all dates as historical until the school issues the current datesheet.",
          "The current-session datesheet will be published here and in Notices.",
        ],
      },
    ],
  },
  {
    slug: "note-to-parents",
    title: "Note to Parents",
    intro: "Guidance on supporting learning at home and staying in touch.",
    sections: [
      {
        heading: "Working with the school",
        body: [
          "Parents are requested to check the school diary daily, attend parent–teacher meetings and use the school office for all official communication.",
          "Full note text pending school confirmation.",
        ],
      },
    ],
  },
  {
    slug: "instructions-to-students",
    title: "Instructions to Students",
    intro: "Daily expectations for students on campus.",
    sections: [
      {
        heading: "On campus",
        body: [
          "Reach school before assembly, keep the campus clean, and hand over lost property at the office.",
          "Full instruction list pending school confirmation.",
        ],
      },
    ],
  },
  {
    slug: "fee-structure",
    title: "Fee Structure",
    intro: "Class-wise fee heads and payment schedule.",
    sections: [
      {
        heading: "Fees",
        body: [
          "Fee amounts are intentionally not published here. The school's approved fee schedule must be uploaded as an official document before this page goes live.",
          "Online fee deposit will be linked here once the school authorises a payment integration.",
        ],
      },
    ],
  },
];

export type Activity = { id: string; title: string; note: string; verified?: boolean };

export const activities: Activity[] = [
  { id: "ac-1", title: "Cultural Activities", note: "Annual cultural calendar including music, dance and drama.", verified: true },
  { id: "ac-2", title: "Mask Making Activity", note: "Art and craft activity for junior classes.", verified: true },
  { id: "ac-3", title: "Aerobic Exercise & Pyramid", note: "Fitness display performed at school functions.", verified: true },
  { id: "ac-4", title: "Nature Walk", note: "Outdoor environment awareness walk.", verified: true },
  { id: "ac-5", title: "Swachh Bharat Mission", note: "Cleanliness drive on campus and in the neighbourhood.", verified: true },
  { id: "ac-6", title: "Students Council Election", note: "Student council nomination, campaign and election.", verified: true },
  { id: "ac-7", title: "Summer Camp Umang", note: "Vacation activity camp for students.", verified: true },
  { id: "ac-8", title: "बाल कवि सम्मेलन", note: "Young poets' assembly.", verified: true },
];

export const competitions = [
  { id: "cp-1", title: "हिंदी वाद विवाद प्रतियोगिता", note: "Hindi debate competition.", verified: true },
  { id: "cp-2", title: "Olympiad & cultural event certification", note: "Certificates distributed at assembly.", verified: true },
  { id: "cp-3", title: "Inter-house quiz", note: "Placeholder — house-wise general knowledge quiz." },
];

export const sports = [
  { id: "sp-1", title: "Cricket academy", note: "Cricket academy inaugurated in 2025.", verified: true },
  { id: "sp-2", title: "Annual sports meet", note: "House-wise track and field meet.", verified: true },
  { id: "sp-3", title: "Indoor games", note: "Games periods and inter-house indoor fixtures." },
];

export type StaffGroup = {
  slug: string;
  title: string;
  note: string;
  rows: { role: string; qualification: string; name: string }[];
};

export const staffGroups: StaffGroup[] = [
  {
    slug: "administrative",
    title: "Administrative Staff",
    note: "Names withheld until the school supplies an approved staff list.",
    rows: [
      { role: "Principal", qualification: "—", name: "To be published" },
      { role: "Vice Principal", qualification: "—", name: "To be published" },
      { role: "Office Superintendent", qualification: "—", name: "To be published" },
    ],
  },
  {
    slug: "teaching",
    title: "Teaching Staff",
    note: "Subject-wise teaching staff list pending school confirmation.",
    rows: [
      { role: "Mathematics", qualification: "—", name: "To be published" },
      { role: "Physics", qualification: "—", name: "To be published" },
      { role: "Chemistry", qualification: "—", name: "To be published" },
      { role: "Biology", qualification: "—", name: "To be published" },
      { role: "English", qualification: "—", name: "To be published" },
      { role: "Hindi", qualification: "—", name: "To be published" },
      { role: "Social Science", qualification: "—", name: "To be published" },
      { role: "Computer Science", qualification: "—", name: "To be published" },
    ],
  },
  {
    slug: "non-teaching",
    title: "Non-Teaching Staff",
    note: "Support staff list pending school confirmation.",
    rows: [
      { role: "Librarian", qualification: "—", name: "To be published" },
      { role: "Lab Attendant", qualification: "—", name: "To be published" },
      { role: "Transport", qualification: "—", name: "To be published" },
    ],
  },
];

export type Resource = {
  id: string;
  title: string;
  kind: "PDF" | "DOC" | "Form";
  group: "Admissions" | "Academics" | "Compliance" | "Careers" | "Student services";
  note: string;
  verified?: boolean;
};

export const resources: Resource[] = [
  { id: "r-1", title: "Almanac 2025-26 (Nursery to Class XII)", kind: "PDF", group: "Academics", note: "Existing school download — verify freshness.", verified: true },
  { id: "r-2", title: "Notification for Admission 2025-26", kind: "PDF", group: "Admissions", note: "Existing school download — verify current cycle.", verified: true },
  { id: "r-3", title: "Affiliation 2023-28", kind: "PDF", group: "Compliance", note: "Existing school download — affiliation document.", verified: true },
  { id: "r-4", title: "Job Application Form", kind: "DOC", group: "Careers", note: "Existing school download — recruitment form.", verified: true },
  { id: "r-5", title: "Transfer Certificate request", kind: "Form", group: "Student services", note: "Placeholder request form for TC issue." },
  { id: "r-6", title: "School circulars archive", kind: "PDF", group: "Academics", note: "Placeholder — circular archive by session." },
];

export const disclosureRows = [
  { label: "Name of school", value: school.name },
  { label: "Address", value: school.address },
  { label: "Email", value: school.email },
  { label: "Contact", value: school.phones.join(" · ") },
  { label: "Affiliation document", value: "Affiliation 2023-28 (see Resources)" },
  { label: "Affiliation number", value: "To be published" },
  { label: "School code", value: "To be published" },
  { label: "Trust / society", value: school.foundation },
  { label: "Principal", value: "To be published" },
  { label: "Total teaching staff", value: "To be published" },
  { label: "Infrastructure details", value: "To be published" },
];

export type GalleryItem = {
  id: string;
  title: string;
  category: "Cultural" | "Sports" | "Academic" | "Campus";
  src: string;
  width: number;
  height: number;
  alt: string;
};
