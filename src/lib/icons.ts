import {
  Library,
  FlaskConical,
  Trophy,
  MonitorPlay,
  Building,
  Users,
  UserCheck,
  Award,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Bus,
  Shield,
  Music,
  Activity,
  Laptop,
  Palette,
  Globe,
  HeartHandshake,
  Sparkles,
  type LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Library,
  FlaskConical,
  Trophy,
  MonitorPlay,
  Building,
  Building2: Building,
  Users,
  UserCheck,
  Award,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Bus,
  Shield,
  Music,
  Activity,
  Laptop,
  Monitor: Laptop,
  Palette,
  Globe,
  HeartHandshake,
  Sparkles,
};

export function getSchoolIcon(name?: string, fallback: LucideIcon = Building): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] || fallback;
}
