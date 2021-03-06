import { ParticipantCreate } from "../../src/shared/participantCreate";
import { prisma } from "./db";

/**
 * Utility class that handles participant related db actions
 */
export class ParticipantHandler {
  /**
   * Creates a new meeting participant
   * @param participant participant info
   */
  async create(participantData: ParticipantCreate) {
    // both create and update share the same data
    const data = {
      // make relation to student
      student: {
        // if exists, link, else make user
        connectOrCreate: {
          // find user by id
          where: {
            id: participantData.studentId,
          },
          // create user by id
          create: {
            id: participantData.studentId,
          },
        },
      },
      // make connection to meeting
      meeting: {
        connect: {
          id: participantData.meetingId,
        },
      },
    };

    const participant = await prisma.participant.upsert({
      create: {
        // don't want the join time and if late to updated later if the system says they joined again
        // should only use the first time they joined
        joinTime: participantData.joinTime,
        late: participantData.late,
        ...data,
      },
      update: data,
      where: {
        studentInMeeting: {
          studentId: participantData.studentId,
          meetingId: participantData.meetingId,
        },
      },
      include: {
        student: true,
      },
    });

    console.log(
      `Created participant ${participant.studentId} (${participant.id})`
    );
  }

  /**
   * Lists all participants
   */
  async list() {
    const result = await prisma.participant.findMany({
      include: { meeting: true, student: true },
    });

    console.log(`Found ${result.length} participants`);

    return result;
  }

  /**
   * Gets a participant
   * @param id participant id
   * @returns the participant
   */
  async get(id: number) {
    console.log(`Got the participant ${id}`);
    return await prisma.participant.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });
  }

  /**
   * Deletes a participant
   * @param id participant id
   */
  async delete(id: number) {
    await prisma.participant.delete({ where: { id } });

    console.log(`Deleted the participant ${id}`);
  }
}
