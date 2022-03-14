import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Collection } from "lokijs";
import { MeetingData, MeetingDataPlus } from "../../src/MeetingData";
import { UserData } from "../../src/UserData";
import { Handler } from "./Handler";

/**
 * Utility class that handles user related actions
 */
export class UserHandler extends Handler {
  meetings: Collection<MeetingData>;

  users: Collection<UserData>;

  /**
   * Creates a new UserHandler
   * @param socket Socket connection
   * @param meetings Loki meeting collection
   */
  constructor(db: Loki) {
    super();
    this.meetings = db.getCollection("meetings");
    this.users = db.getCollection("users");
  }

  /**
   * Deletes a user
   * @param id user id
   */
  delete(id: string): void {
    // remove meeting from db
    this.users.chain().find({ id }).remove();

    console.log(`Deleted the User ${id}`);
  }

  /**
   * Creates a new user
   * @param user inital user data
   */
  create(user: UserData): void {
    this.users.insert(user);
    console.log(`Created user ${user.name} (${user.id})`);
  }

  /**
   * Lists all users
   */
  list(): UserData[] {
    const result = this.users.data;

    console.log(`Found ${result.length} users`);

    return result;
  }

  /**
   * Gets a user
   * @param id user id
   */
  get(id: string) {
    console.log(`Got the user ${id}`);

    return this.users.findOne({ id });
  }
}
