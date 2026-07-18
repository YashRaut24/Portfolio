import {
  User,
  BrainCircuit,
  FolderKanban,
  Trophy,
  Briefcase,
  Mail,
  FlaskConical,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

export const hubNodesData = [
  {
    id: "about",
    label: "About",
    icon: User,
    accent: "#60A5FA",
    planet: "earth",
  },
  {
    id: "skills",
    label: "Skills",
    icon: BrainCircuit,
    accent: "#8B5CF6",
    planet: "gas",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    accent: "#22C55E",
    planet: "forest",
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    accent: "#F59E0B",
    planet: "gold",
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    accent: "#06B6D4",
    planet: "ice",
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    accent: "#EC4899",
    planet: "lava",
  },
  {
    id: "stats",
    label: "GitHub",
    icon: FaGithub,
    accent: "#6366F1",
    planet: "moon",
  },
  {
    id: "lab",
    label: "Lab",
    icon: FlaskConical,
    accent: "#FFD54F",
    planet: "sun",
    hidden: true,
  },
];