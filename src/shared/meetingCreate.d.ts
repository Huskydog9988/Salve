/**
 * Data needed to be passed to the server to create a meeting
 */
export interface MeetingCreateClient {
  /**
   * name of the meeting
   */
  name: string;
  /**
   * Late time as an iso
   */
  lateTime?: string;
}

/**
 * Data needed to be passed to Meeting Handler to create a meeting
 */
export interface MeetingCreateServer extends MeetingCreateClient {
  /**
   * Start time as an iso
   */
  startTime: string;
}
