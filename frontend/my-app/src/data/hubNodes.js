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
    accent: '#60A5FA',
  },
  {
    id: "skills",
    label: "Skills",
    icon: BrainCircuit,
    accent: '#8B5CF6',
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    accent: '#22C55E',
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
     accent: '#F59E0B',
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    accent: '#06B6D4',
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    accent: '#EC4899',
  },
  {
    id: "stats",
    label: "GitHub",
    icon: FaGithub,
    accent: '#6366F1',
  },
  {
    id: "lab",
    label: "Lab",
    icon: FlaskConical,
    accent: "#FFD54F",
    hidden: true,
  },
];