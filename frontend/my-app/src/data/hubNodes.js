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
    accent: "#2563EB",
  },
  {
    id: "skills",
    label: "Skills",
    icon: BrainCircuit,
    accent: "#0D9488",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    accent: "#7C3AED",
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    accent: "#E8B23A",
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    accent: "#C2410C",
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    accent: "#DB2777",
  },
  {
    id: "stats",
    label: "GitHub",
    icon: FaGithub,
    accent: "#334155",
  },
  {
    id: "lab",
    label: "Lab",
    icon: FlaskConical,
    accent: "#FFD54F",
    hidden: true,
  },
];