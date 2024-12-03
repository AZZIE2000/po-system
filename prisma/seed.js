import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.createMany({
    data: [
      {
        role: "admin",
      },
      {
        role: "ceo",
      },
      {
        role: "employee",
      },
      {
        role: "manager",
      },
      {
        role: "projectManager",
      },
      {
        role: "accountant",
      },
    ],
  });
  console.log(roles);
}
console.log("hi");

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
