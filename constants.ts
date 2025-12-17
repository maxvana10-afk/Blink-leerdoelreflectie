import { Subject } from "./types";

export const APP_TITLE = "BLINK Reflectie";

// In een echte app zou je dit via een backend doen, maar voor deze demo gebruiken we hardcoded codes.
export const AUTH_CODES = {
  TEACHER: "BLINK123"
};

export const STAR_DESCRIPTIONS = {
  1: "Nog mee bezig - Ik vind het lastig en heb nog hulp nodig.",
  2: "Ik kan het - Ik kan de opdrachten zelfstandig maken.",
  3: "Expert - Ik snap het helemaal en kan het aan een ander uitleggen."
};

export const SUBJECT_CONFIG: Record<Subject, { label: string; color: string; icon: string; bg: string; border: string }> = {
  aardrijkskunde: {
    label: "Aardrijkskunde",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "🌍"
  },
  geschiedenis: {
    label: "Geschiedenis",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "📜"
  },
  natuur_techniek: {
    label: "Natuur & Techniek",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "🔬"
  }
};

export const TIPS = {
  explanation: {
    prompt: "Welke opdracht heb je gedaan?",
    example: "Bijvoorbeeld: 'Ik heb opdracht 3 gemaakt over de werking van een vulkaan.'",
    criteria: "Noem de specifieke opdracht, het filmpje of de oefening die je hebt gedaan."
  },
  evidence: {
    prompt: "Waar kan ik jouw werk vinden?",
    example: "Bijvoorbeeld: 'In mijn werkboek op bladzijde 12' of 'Zie de foto hieronder'.",
    criteria: "Upload een foto van je werk of schrijf precies op waar het staat."
  },
  reflection: {
    prompt: "Wat weet je nu, wat je eerst nog niet wist?",
    example: "Bijvoorbeeld: 'Ik weet nu dat er drie soorten vulkanen zijn.'",
    criteria: "Begin je zin met: 'Ik weet nu dat...' of 'Ik heb geleerd hoe...'"
  }
};
