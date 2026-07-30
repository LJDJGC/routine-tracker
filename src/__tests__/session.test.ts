import { describe, it, expect } from "vitest";
import type { Session, SessionType } from "@/src/types";

describe("Session", () => {
  it("creates a study session", () => {
    const session: Session = {
      id: "test-1",
      type: "study",
      duration: 60,
      date: "2026-07-29",
      note: "Test note",
    };

    expect(session.type).toBe("study");
    expect(session.duration).toBe(60);
  });

  it("creates a workout session", () => {
    const session: Session = {
      id: "test-2",
      type: "workout",
      duration: 45,
      date: "2026-07-29",
    };

    expect(session.type).toBe("workout");
    expect(session.note).toBeUndefined();
  });

  it("filters sessions by type", () => {
    const sessions: Session[] = [
      { id: "1", type: "study", duration: 60, date: "2026-07-29" },
      { id: "2", type: "workout", duration: 30, date: "2026-07-29" },
      { id: "3", type: "study", duration: 90, date: "2026-07-28" },
    ];

    const studySessions = sessions.filter((s) => s.type === "study");
    expect(studySessions).toHaveLength(2);

    const workoutSessions = sessions.filter((s) => s.type === "workout");
    expect(workoutSessions).toHaveLength(1);
  });
});
