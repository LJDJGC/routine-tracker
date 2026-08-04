export type SessionType = "study" | "workout";

export interface Session {
  id: string;
  type: SessionType;
  duration: number;
  date: string;
  note?: string;
}