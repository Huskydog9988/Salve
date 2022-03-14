import { MeetingData } from "../../src/MeetingData";
import { UserData } from "../../src/UserData";
import { Collection } from "lokijs";

/**
 * Abstract class for outlining requirements of a db collection handler
 */
export abstract class Handler {
  // /**
  //  * Socket connection
  //  */
  // abstract socket: Socket<
  //   DefaultEventsMap,
  //   DefaultEventsMap,
  //   DefaultEventsMap,
  //   any
  // >;

  /**
   * Loki meeting collection
   */
  abstract meetings: Collection<MeetingData>;

  /**
   * Loki user collection
   */
  abstract users: Collection<UserData>;

  abstract create(data: any): void;

  abstract get(id: string): any;

  abstract list(): void;

  abstract delete(id: string): void;
}
