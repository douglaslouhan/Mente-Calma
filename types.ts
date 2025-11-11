// FIX: Removed the circular import `import { Guide, Habito, Badge } from './types';` which caused declaration conflicts.

export interface Guide {
  id: number;
  titulo: string;
  descricao: string;
  pdfUrl: string;
  mockupUrl: string;
  dayUnlock?: number;
  isUnlocked?: boolean;
  isPremium?: boolean;
}

export interface Habito {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'completed' | 'pending';
  importancia: 'Importante' | 'Moderada' | 'Leve';
  createdAt: string;
  dueDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  text: string;
  createdAt?: any; // Firestore Timestamp
}

export enum Assinatura {
  GRATUITO,
  PREMIUM,
}

export interface MoodLog {
  date: string;
  mood: '😄' | '🙂' | '😐' | '😟' | '😥';
  text: string;
  energy: number;
}

export interface SleepLog {
  date: string;
  quality: 'ótima' | 'boa' | 'regular' | 'ruim';
  hours: number;
}

export interface UserData {
  profile: {
    name: string;
    email: string;
    createdAt: Date;
  };
  guidesUnlocked: string[];
  completedGuides: string[];
  entitlements: {
    detox21: boolean;
    codigoMental: boolean;
  };
  moods: MoodLog[];
  sleepLogs: SleepLog[];
  assinatura: Assinatura;
  habitos: Habito[];
  gameficadoUser: boolean;
  nextUnlockDate: Date;
  favoriteAudios: string[];
  gamification: {
    points: number;
    level: number;
    badges: string[];
  };
  progresso: number;
}