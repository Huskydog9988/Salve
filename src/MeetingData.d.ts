/**
 * User object for users in a meeting
 */
export interface UserMeetingData {
  /**
   * user id
   */
  id: string;
  /**
   * iso string of join time
   */
  joinTime: string;
  /**
   * whether user is late to the meeting
   */
  late: boolean;
}

/**
 * Meeting Data
 */
export interface MeetingData {
  /**
   * meeting id
   */
  id: string;
  /**
   * meeting name
   */
  name: string;
  /**
   * iso string of start time
   */
  startTime: string;
  /**
   * iso string of late time
   */
  lateTime?: string;
  /**
   * iso string of end time
   */
  endTime?: string;
  /**
   * Array of users who have joined the meeting
   */
  participants: UserMeetingData[];
}

/**
 * UserMeetingData but with a name
 */
export interface UserMeetingDataPlus extends UserMeetingData {
  /**
   * name of user
   */
  name: string;
}

/**
 * MeetingData but the users have names
 */
export interface MeetingDataPlus extends MeetingData {
  /**
   * Array of users who have joined the meeting hydrated with their names
   */
  participants: UserMeetingInfo[];
}
