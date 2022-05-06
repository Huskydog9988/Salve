import { Student } from "@prisma/client";

interface EditUserName {
  id: Student["id"];
  name: Student["name"];
}
