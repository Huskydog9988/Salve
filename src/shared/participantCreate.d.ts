import { Meeting, Student } from "@prisma/client";

/**
 * Enable participant handler create method to take args that enable creating relations
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
