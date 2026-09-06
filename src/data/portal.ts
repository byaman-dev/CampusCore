/** Demo data for the portal prototype. No real student information. */

export type Role = "student" | "teacher" | "admin" | "parent";

export const roleLabels: Record<Role, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Administrator",
  parent: "Parent",
};

export const demoAccounts: Record<Role, { name: string; detail: string }> = {
  student: { name: "Demo Student", detail: "Class IX · Section B" },
  teacher: { name: "Demo Teacher", detail: "Science · Classes VIII–X" },
  admin: { name: "Demo Administrator", detail: "School office" },
  parent: { name: "Demo Parent", detail: "Guardian of one student" },
};

export type Period = { period: string; subject: string; time: string; room: string; done?: boolean };

export const studentTimetable: Period[] = [
  { period: "01", subject: "Mathematics", time: "08:10", room: "IX-B", done: true },
  { period: "02", subject: "Physics", time: "09:00", room: "Physics lab", done: true },
  { period: "03", subject: "English", time: "09:50", room: "IX-B" },
  { period: "04", subject: "Chemistry", time: "10:55", room: "Chemistry lab" },
  { period: "05", subject: "Hindi", time: "11:45", room: "IX-B" },
  { period: "06", subject: "Games", time: "12:35", room: "Indoor hall" },
];

export const teacherTimetable: Period[] = [
  { period: "01", subject: "Science · VIII-A", time: "08:10", room: "VIII-A", done: true },
  { period: "02", subject: "Physics · IX-B", time: "09:00", room: "Physics lab", done: true },
  { period: "03", subject: "Free period", time: "09:50", room: "Staff room" },
  { period: "04", subject: "Chemistry · X-A", time: "10:55", room: "Chemistry lab" },
  { period: "05", subject: "Science · IX-A", time: "11:45", room: "IX-A" },
];

export const classes = ["VIII-A", "VIII-B", "IX-A", "IX-B", "X-A", "X-B"];
export const subjects = ["Science", "Physics", "Chemistry", "Biology", "Mathematics", "English", "Hindi", "Social Science"];

export type RosterStudent = { id: string; roll: string; name: string };

/** Roster uses invented demo names — never real student records. */
export const roster: Record<string, RosterStudent[]> = {
  "IX-B": [
    { id: "s1", roll: "01", name: "Demo Student A" },
    { id: "s2", roll: "02", name: "Demo Student B" },
    { id: "s3", roll: "03", name: "Demo Student C" },
    { id: "s4", roll: "04", name: "Demo Student D" },
    { id: "s5", roll: "05", name: "Demo Student E" },
    { id: "s6", roll: "06", name: "Demo Student F" },
    { id: "s7", roll: "07", name: "Demo Student G" },
    { id: "s8", roll: "08", name: "Demo Student H" },
  ],
};

export function rosterFor(className: string): RosterStudent[] {
  return (
    roster[className] ??
    Array.from({ length: 10 }, (_, i) => ({
      id: `${className}-${i}`,
      roll: String(i + 1).padStart(2, "0"),
      name: `Demo Student ${String.fromCharCode(65 + i)}`,
    }))
  );
}

export const attendanceTrend = [
  { month: "Oct", present: 94 },
  { month: "Nov", present: 91 },
  { month: "Dec", present: 96 },
  { month: "Jan", present: 89 },
  { month: "Feb", present: 92 },
];

export const studentResults = [
  { subject: "Mathematics", term1: 78, term2: 84 },
  { subject: "Physics", term1: 72, term2: 80 },
  { subject: "Chemistry", term1: 81, term2: 79 },
  { subject: "English", term1: 88, term2: 90 },
  { subject: "Hindi", term1: 85, term2: 87 },
];

export const adminStats = [
  { label: "Students on roll", value: "—", note: "Awaiting school data" },
  { label: "Teaching staff", value: "—", note: "Awaiting school data" },
  { label: "Classes", value: "12", note: "Demo" },
  { label: "Open admission enquiries", value: "8", note: "Demo" },
];

export const adminSections = [
  { label: "Overview", note: "Daily snapshot of attendance, notices and enquiries." },
  { label: "Students", note: "Roll lists, class allotment and records." },
  { label: "Teachers", note: "Staff directory, subjects and timetable load." },
  { label: "Classes", note: "Sections, class teachers and subject mapping." },
  { label: "Attendance", note: "Daily and monthly attendance registers." },
  { label: "Results", note: "Marks entry, report cards and result analysis." },
  { label: "Notices", note: "Create and publish notices to chosen audiences." },
  { label: "Events", note: "Academic calendar and event publishing." },
  { label: "Documents", note: "Circulars, almanac and compliance uploads." },
  { label: "Gallery", note: "Event albums and homepage photography." },
  { label: "Admissions", note: "Enquiries, eligibility checks and follow-up." },
  { label: "Website Content", note: "Edit public pages without touching code." },
  { label: "Reports", note: "Attendance, results and fee summaries." },
  { label: "Settings", note: "Roles, permissions and school profile." },
];
