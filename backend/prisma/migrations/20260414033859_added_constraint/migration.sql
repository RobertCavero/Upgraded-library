/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `BookListItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookListItem_userId_bookId_key" ON "BookListItem"("userId", "bookId");
