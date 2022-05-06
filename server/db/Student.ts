import { EditUserName } from "../../src/shared/editUser";
import { StudentCreate } from "../../src/shared/studentCreate";
import { prisma } from "./db";

/**
 * Utility class that handles student related db actions
 */
export class StudentHandler {
  /**
   * Deletes a student
   * @param id user id
   */
  async delete(id: string) {
    // remove student from db
    await prisma.student.delete({
      where: {
        id,
      },
    });

    console.log(`Deleted the student ${id}`);
  }

  /**
   * Creates a new student
   * @param user inital user data
   */
  async create(user: StudentCreate) {
    await prisma.student.create({
      data: {
        name: user.name,
        id: user.id,
      },
    });

    console.log(`Created user ${user.name} (${user.id})`);
  }

  /**
   * Lists all users
   */
  async list() {
    const result = await prisma.student.findMany();

    console.log(`Found ${result.length} users`);

    return result;
  }

  /**
   * Gets a user
   * @param id user id
   */
  async get(id: string) {
    console.log(`Got the user ${id}`);

    return await prisma.student.findUnique({ where: { id } });
  }

  /**
   * Edits a user
   * @param id user id
   */
  async edit(data: EditUserName) {
    console.log(`Edited the user ${data.id}`);

    return await prisma.student.update({
      where: { id: data.id },
      data: {
        name: data.name,
      },
    });
  }
}
