import classroom from "@/assets/gallery-classroom.jpg";
import assembly from "@/assets/gallery-assembly.jpg";
import experiment from "@/assets/gallery-experiment.jpg";
import sportsImg from "@/assets/gallery-sports.jpg";
import cultural from "@/assets/gallery-cultural.jpg";
import library from "@/assets/facility-library.jpg";
import computer from "@/assets/facility-computer.jpg";
import physics from "@/assets/facility-physics.jpg";
import chemistry from "@/assets/facility-chemistry.jpg";
import biology from "@/assets/facility-biology.jpg";
import indoor from "@/assets/facility-indoor.jpg";
import hero from "@/assets/campus-hero.jpg";
import type { GalleryItem } from "./school";

export const heroImage = { src: hero, width: 1024, height: 1280 };

export type ImageRef = { src: string; width: number; height: number };

export const facilityImages: Record<string, ImageRef> = {
  library: { src: library, width: 768, height: 768 },
  "computer-lab": { src: computer, width: 768, height: 768 },
  "physics-lab": { src: physics, width: 768, height: 768 },
  "chemistry-lab": { src: chemistry, width: 768, height: 768 },
  "biology-lab": { src: biology, width: 768, height: 768 },
  "indoor-games": { src: indoor, width: 768, height: 768 },
};

/** Falls back to the hero photograph when a facility has no image yet. */
export function facilityImage(slug: string): ImageRef {
  return facilityImages[slug] ?? { src: hero, width: 1024, height: 1280 };
}

/** Placeholder photography until the school's own optimised photo set is added. */
export const galleryItems: GalleryItem[] = [
  { id: "g-1", title: "Classroom session", category: "Academic", src: classroom, width: 800, height: 1000, alt: "Students seated at desks in a classroom during a lesson" },
  { id: "g-2", title: "Morning assembly", category: "Campus", src: assembly, width: 1024, height: 768, alt: "Students standing in rows for morning assembly in a covered courtyard" },
  { id: "g-3", title: "Science practical", category: "Academic", src: experiment, width: 768, height: 768, alt: "Students' hands handling a beaker during a science experiment" },
  { id: "g-4", title: "Sports meet", category: "Sports", src: sportsImg, width: 800, height: 1000, alt: "Students running on a dusty athletics track during a sports meet" },
  { id: "g-5", title: "Cultural performance", category: "Cultural", src: cultural, width: 1024, height: 768, alt: "Students in colourful costumes performing on a decorated school stage" },
  { id: "g-6", title: "Library reading room", category: "Campus", src: library, width: 768, height: 768, alt: "Library reading room with wooden shelves and long tables" },
  { id: "g-7", title: "Computer lab", category: "Academic", src: computer, width: 768, height: 768, alt: "Rows of desktop computers in the school computer lab" },
  { id: "g-8", title: "Physics lab", category: "Academic", src: physics, width: 768, height: 768, alt: "Physics laboratory benches with apparatus and a blackboard" },
  { id: "g-9", title: "Indoor games hall", category: "Sports", src: indoor, width: 768, height: 768, alt: "Indoor games hall with table tennis tables" },
  { id: "g-10", title: "Chemistry lab", category: "Academic", src: chemistry, width: 768, height: 768, alt: "Chemistry laboratory glassware in front of a periodic table chart" },
  { id: "g-11", title: "Biology lab", category: "Academic", src: biology, width: 768, height: 768, alt: "Biology laboratory with microscopes and specimen jars" },
  { id: "g-12", title: "School courtyard", category: "Campus", src: hero, width: 1024, height: 1280, alt: "School courtyard in early morning light with students walking" },
];

export const galleryCategories = ["All", "Academic", "Cultural", "Sports", "Campus"] as const;
