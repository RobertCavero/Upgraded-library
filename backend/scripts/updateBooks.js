import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  await prisma.book.updateMany({
    where: {
      img: null,
    },
    data: {
      img: "https://a.imagem.app/GzTEvv.png",
    },
  });

  console.log("Books updated!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
