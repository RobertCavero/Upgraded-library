import { PrismaClient } from "../src/generated/prisma/index.js";
import "dotenv/config"

import {PrismaPg} from "@prisma/adapter-pg"
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const userId = "aac0875d-d424-40ff-8d71-f4ade18f6645";

const books = [
  {
    title: "A Floresta Silenciosa",
    author: "Emily Carter",
    releaseYear: 2018,
    desc: "Uma floresta misteriosa onde pessoas desaparecem sem deixar rastros.",
    genre: ["Mistério", "Suspense"],
    new: false,
    createdBy: userId,
  },
  {
    title: "Além das Estrelas",
    author: "Lucas Andrade",
    releaseYear: 2022,
    desc: "Uma jornada pelo espaço e pela resiliência humana.",
    genre: ["Ficção Científica", "Aventura"],
    new: true,
    createdBy: userId,
  },
  {
    title: "Ecos do Passado",
    author: "Mariana Silva",
    releaseYear: 2015,
    desc: "Segredos do passado voltam para assombrar uma pequena cidade.",
    genre: ["Drama", "Mistério"],
    new: false,
    createdBy: userId,
  },
  {
    title: "O Último Reino",
    author: "Robert King",
    releaseYear: 2020,
    desc: "Um império caído luta para se reerguer.",
    genre: ["Fantasia", "Ação"],
    new: true,
    createdBy: userId,
  },
  {
    title: "Sombras na Escuridão",
    author: "Ana Costa",
    releaseYear: 2017,
    desc: "Uma detetive descobre uma conspiração escondida.",
    genre: ["Crime", "Suspense"],
    new: false,
    createdBy: userId,
  },
  {
    title: "Sonhos do Amanhã",
    author: "Carlos Mendes",
    releaseYear: 2021,
    desc: "Um mundo futurista moldado pelos sonhos.",
    genre: ["Ficção Científica", "Drama"],
    new: true,
    createdBy: userId,
  },
  {
    title: "A Verdade Oculta",
    author: "Fernanda Rocha",
    releaseYear: 2019,
    desc: "Uma jornalista expõe um segredo perigoso.",
    genre: ["Suspense", "Drama"],
    new: false,
    createdBy: userId,
  },
  {
    title: "Ventos do Destino",
    author: "João Pereira",
    releaseYear: 2016,
    desc: "Uma história de destino e coragem através de reinos.",
    genre: ["Fantasia", "Aventura"],
    new: false,
    createdBy: userId,
  },
  {
    title: "Fragmentos de Luz",
    author: "Beatriz Alves",
    releaseYear: 2023,
    desc: "Encontrando esperança em um mundo destruído.",
    genre: ["Drama", "Romance"],
    new: true,
    createdBy: userId,
  },
  {
    title: "Código do Silêncio",
    author: "Rafael Souza",
    releaseYear: 2024,
    desc: "Um hacker se envolve em uma conspiração global.",
    genre: ["Tecnologia", "Suspense"],
    new: true,
    createdBy: userId,
  },
];

const main = async () => {
  console.log("Seeding books...");

  for (const book of books) {
    await prisma.book.create({
      data: book,
    });

    console.log(`Created book: ${book.title}`);
  }

  console.log("Seeding completed!");
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
