import { Meeting, Participant, Student } from "@prisma/client";

export type ParticipantAndStudent = Participant & { student: Student };

export type MeetingAndParticipants = Meeting & {
  participants: ParticipantAndStudent[];
};
