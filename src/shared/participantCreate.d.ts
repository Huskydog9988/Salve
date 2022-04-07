import { Meeting, Student } from "@prisma/client";

/**
 * Data needed to enable participant handler to create a participant
 */
export interface ParticipantCreate {
  /**
   * ISO
   */
  joinTime: string;

  /**
   *
   */
  late: boolean;

  /**
   * Student id
   */
  studentId: Student["id"];

  /**
   * Meeting id
   */
  meetingId: Meeting["id"];
}
