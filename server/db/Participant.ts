import { Meeting, Participant } from "@prisma/client";
import { StudentJoin } from "../../src/shared/studentJoin";
import { prisma } from "./db";

/**
 * Utility class that handles participant related db actions
 */
export class ParticipantHandler {
  /**
   * Creates a new meeting participant
   * @param participant participant info
   */
  async create(participant: Participant) {
    await prisma.participant.create({
      data: participant,
      //   idk but this is needed
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
    const result = await prisma.participant.findMany();

    console.log(`Found ${result.length} participants`);
  }

  /**
   * Gets a participant
   * @param id participant id
   * @returns the participant
   */
  async get(id: number) {
    console.log(`Got the participant ${id}`);
    return await prisma.participant.findUnique({ where: { id } });
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
