import { useSyncExternalStore } from "react";
import type { Role } from "@/data/portal";

export type HomeworkItem = {
  id: string;
  className: string;
  subject: string;
  title: string;
  detail: string;
  due: string;
  attachment?: string;
  postedBy: string;
};

export type ResourceItem = {
  id: string;
  title: string;
  kind: string;
  className: string;
  size: string;
};

export type AnnouncementItem = {
  id: string;
  title: string;
  body: string;
  audience: string;
  postedAt: string;
};

export type AttendanceRecord = {
  id: string;
  className: string;
  date: string;
  present: number;
  absent: number;
};

type PortalState = {
  role: Role | null;
  homework: HomeworkItem[];
  resources: ResourceItem[];
  announcements: AnnouncementItem[];
  attendance: AttendanceRecord[];
};

const STORAGE_KEY = "mvv-portal-demo";

const initialState: PortalState = {
  role: null,
  homework: [
    {
      id: "hw-1",
      className: "IX-B",
      subject: "Physics",
      title: "Numericals set 4",
      detail: "Chapter 5 · 8 questions. Show all working.",
      due: "Friday",
      attachment: "numericals-set-4.pdf",
      postedBy: "Demo Teacher",
    },
    {
      id: "hw-2",
      className: "IX-B",
      subject: "English",
      title: "Letter writing practice",
      detail: "One formal letter and one informal letter.",
      due: "Thursday",
      postedBy: "Demo Teacher",
    },
  ],
  resources: [
    { id: "res-1", title: "Physics — Chapter 5 notes", kind: "PDF", className: "IX-B", size: "1.2 MB" },
    { id: "res-2", title: "Chemistry — reaction chart", kind: "Image", className: "IX-B", size: "480 KB" },
  ],
  announcements: [
    {
      id: "an-1",
      title: "Periodic test datesheet shared",
      body: "The datesheet has been shared with class teachers. Please copy it into your diary.",
      audience: "Whole school",
      postedAt: "Today",
    },
  ],
  attendance: [{ id: "at-1", className: "IX-B", date: "Yesterday", present: 7, absent: 1 }],
};

let state: PortalState = initialState;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — demo state stays in memory */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

let hydrated = false;
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = { ...initialState, ...(JSON.parse(raw) as PortalState) };
      listeners.forEach((l) => l());
    }
  } catch {
    /* ignore malformed demo state */
  }
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePortalState<T>(selector: (s: PortalState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

const id = () => Math.random().toString(36).slice(2, 9);

export const portalActions = {
  signIn(role: Role) {
    state = { ...state, role };
    emit();
  },
  signOut() {
    state = { ...state, role: null };
    emit();
  },
  addHomework(item: Omit<HomeworkItem, "id">) {
    state = { ...state, homework: [{ ...item, id: id() }, ...state.homework] };
    emit();
  },
  addResource(item: Omit<ResourceItem, "id">) {
    state = { ...state, resources: [{ ...item, id: id() }, ...state.resources] };
    emit();
  },
  addAnnouncement(item: Omit<AnnouncementItem, "id">) {
    state = { ...state, announcements: [{ ...item, id: id() }, ...state.announcements] };
    emit();
  },
  recordAttendance(item: Omit<AttendanceRecord, "id">) {
    state = { ...state, attendance: [{ ...item, id: id() }, ...state.attendance] };
    emit();
  },
};
