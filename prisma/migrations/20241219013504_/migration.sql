-- DropIndex
DROP INDEX "Courses_imageLink_key";

-- CreateTable
CREATE TABLE "_CoursesToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CoursesToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CoursesToUser_B_index" ON "_CoursesToUser"("B");

-- AddForeignKey
ALTER TABLE "_CoursesToUser" ADD CONSTRAINT "_CoursesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Courses"("courseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToUser" ADD CONSTRAINT "_CoursesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
