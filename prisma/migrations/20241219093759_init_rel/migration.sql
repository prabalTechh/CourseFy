/*
  Warnings:

  - You are about to drop the `Courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CoursesToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CoursesToUser" DROP CONSTRAINT "_CoursesToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoursesToUser" DROP CONSTRAINT "_CoursesToUser_B_fkey";

-- DropTable
DROP TABLE "Courses";

-- DropTable
DROP TABLE "_CoursesToUser";

-- CreateTable
CREATE TABLE "Course" (
    "courseId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageLink" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseId")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
