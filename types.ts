export type StarRating = 1 | 2 | 3 | null;

export type Subject = 'aardrijkskunde' | 'geschiedenis' | 'natuur_techniek';

export interface ReflectionEntry {
  id: string;
  studentName: string;
  lessonDate: string;
  lessonGoal: string;
  subject: Subject;
  rating: StarRating;
  explanation: string;
  evidenceDescription: string;
  evidenceFileName?: string;
  reflection: string;
  teacherFeedback?: string;
  aiFeedback?: string;
}

export interface LessonGoal {
  id: string;
  text: string;
  subject: Subject;
  active: boolean;
  date: string;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  NONE = 'NONE'
}

export interface ViewState {
  view: 'landing' | 'student-selection' | 'student-form' | 'teacher-dashboard' | 'portfolio-detail';
  selectedGoal?: LessonGoal;
  selectedReflection?: ReflectionEntry;
}
