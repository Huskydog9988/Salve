import { Meeting } from "@prisma/client";
import { UserJoin } from "../../src/shared/userJoin";
import { prisma } from "./db";

/**
 * Utility class that handles meeting related db actions
 */
export class MeetingHandler {
  /**
   * Creates a meeting
   * @param meetingData the inital data of the meeting
   */
  async create(meetingData: Meeting) {
    // save meeting to db
    await prisma.meeting.create({ data: meetingData });

    console.log(`Created the meeting ${meetingData.name} (${meetingData.id})`);
  }

  /**
   * Gets the specified meeting
   * @param id meeting id to get
   * @returns meeting
   */
  async get(id: Meeting["id"]) {
    console.log(`Got the meeting ${id}`);

    return await prisma.meeting.findUnique({ where: { id } });
  }

  /**
   * Lists all meetings
   * @returns list of meetings
   */
  async list() {
    const result = await prisma.meeting.findMany();

    console.log(`Found ${result.length} meetings`);

    return result;
  }

  /**
   * Ends a meeting
   * @param id meeting id
   */
  async end(id: Meeting["id"]) {
    // this.meetings.findAndUpdate({ id }, (meeting) => {
    //   meeting.endTime = new Date().toISOString();
    //   return meeting;
    // });

    await prisma.meeting.update({
      where: { id },
      data: {
        endTime: new Date().toISOString(),
      },
    });
  }

  /**
   * Deletes a meeting
   * @param id meeting id
   */
  delete(id: Meeting["id"]) {
    // remove meeting from db
    // this.meetings.chain().find({ id }).remove();

    prisma.meeting.delete({ where: { id } });

    console.log(`Deleted the meeting ${id}`);
  }

  /**
   * Tells the db a user joined a meeting
   * @param data
   * @returns user's name
   */
  async userJoin(data: UserJoin) {
    // await getting both student and meeting
    const [student, meetingData] = await Promise.all([
      // get student
      prisma.student.findUnique({
        where: { id: data.user },
        // // only get the name
        // select: {
        //   name: true,
        // },
      }),
      // get meeting
      prisma.meeting.findUnique({
        where: {
          id: data.meeting,
        },
      }),
    ]);

    // if meeting doesn't exist
    if (meetingData === null) return null;

    // get join time
    const joinTime = new Date().toISOString();
    // flag if late
    let late = false;

    // is comparing isos really the goal here?
    // if join time is after late time
    if (meetingData.lateTime !== null && joinTime > meetingData.lateTime) {
      late = true;
    }

    // make a new participant
    await prisma.participant.create({
      data: {
        // jointime
        joinTime,
        // whether late or not
        late,
        // make relation to student
        student: {
          // if exists, link, else make user
          connectOrCreate: {
            // find user by id
            where: {
              id: data.user,
            },
            // create user by id
            create: {
              id: data.user,
            },
          },
        },
        // make connection to meeting
        meeting: {
          connect: {
            id: data.meeting,
          },
        },
      },
      include: {
        student: true,
      },
    });

    // if they have a name
    if (student !== null) {
      console.log(
        `Student ${student.name} (${data.user}) joined ${data.meeting}`
      );
    } else {
      console.log(`Student ${data.user} joined ${data.meeting}`);
    }

    return student?.name;
  }
}
