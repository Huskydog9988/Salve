import { Collection } from "lokijs";
import { MeetingData, MeetingDataPlus } from "../../src/MeetingData";
import { UserData } from "../../src/UserData";
import { Handler } from "./Handler";

export interface UserJoin {
  /**
   * meeting id
   */
  meeting: string;

  /**
   * user id
   */
  user: string;
}

/**
 * Utility class that handles meeting related actions
 */
export class MeetingHandler extends Handler {
  meetings: Collection<MeetingData>;

  users: Collection<UserData>;

  /**
   * Creates a new MeetingHandler
   * @param socket Socket connection
   * @param meetings Loki meeting collection
   */
  constructor(db: Loki) {
    super();

    this.meetings = db.getCollection("meetings");
    this.users = db.getCollection("users");
  }

  //   /**
  //    * Join socket to a room/meeting
  //    * @param id room/meeting id
  //    */
  //   join(id: string) {
  //     this.socket.join(id);
  //   }

  /**
   * Creates a meeting
   * @param meetingData the inital data of the meeting
   */
  create(meetingData: MeetingData) {
    // save meeting to db
    this.meetings.insert(meetingData);

    console.log(`Created the meeting ${meetingData.name} (${meetingData.id})`);
  }

  /**
   * Gets the specified meeting
   * @param id meeting id to get
   * @returns meeting or null
   */
  get(id: string): (MeetingData & LokiObj) | null {
    console.log(`Got the meeting ${id}`);

    return this.meetings.findOne({ id });
  }

  /**
   * Gets a meeting and hydrates the user data with their name
   * @param id meeting id
   * @returns meeting or null
   */
  getPlus(id: string): (MeetingDataPlus & LokiObj) | null {
    console.log(`Got the meetingplus ${id}`);

    // get meeting
    const result: MeetingDataPlus = <MeetingDataPlus>(
      this.meetings.findOne({ id })
    );

    // if no result
    if (result === null) return null;

    // hydrate users with their name
    result.participants = result.participants.map((participant) => {
      // get user
      const user = this.users.findOne({ id: participant.id });

      // if no user, set blank name
      if (user === null) participant.name = "";
      // else give them their proper name
      else participant.name = user.name;

      return participant;
    });

    return result as MeetingDataPlus & LokiObj;
  }

  /**
   * Lists all meetings
   * @returns list of meetings
   */
  list(): MeetingData[] {
    const result = this.meetings.data;

    console.log(`Found ${result.length} meetings`);

    return result;
  }

  /**
   * Ends a meeting
   * @param id meeting id
   */
  end(id: string) {
    this.meetings.findAndUpdate({ id }, (meeting) => {
      meeting.endTime = new Date().toISOString();

      return meeting;
    });
  }

  /**
   * Deletes a meeting
   * @param id meeting id
   */
  delete(id: string) {
    // remove meeting from db
    this.meetings.chain().find({ id }).remove();

    console.log(`Deleted the meeting ${id}`);
  }

  /**
   * Tells the db a user joined a meeting
   * @param data
   * @returns user
   */
  userJoin(data: UserJoin): (UserData & LokiObj) | null {
    let user: (UserData & LokiObj) | null = null;

    this.meetings.findAndUpdate({ id: data.meeting }, (meeting) => {
      const joinTime = new Date().toISOString();
      let late = false;

      // if join time is after late time
      if (meeting.lateTime !== undefined && joinTime > meeting.lateTime) {
        late = true;
      }

      const id = data.user;

      // add user to participants
      meeting.participants.push({ id, joinTime, late });

      return meeting;
    });

    user = this.users.findOne({ id: data.user });

    // if they have a name
    if (user !== null) {
      console.log(`user ${user.name} (${data.user}) joined ${data.meeting}`);
    } else {
      console.log(`user ${data.user} joined ${data.meeting}`);
    }

    return user;
  }
}
