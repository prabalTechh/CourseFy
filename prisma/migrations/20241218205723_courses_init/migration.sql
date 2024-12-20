-- CreateTable
CREATE TABLE "Courses" (
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageLink" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL,
    "courseId" SERIAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Courses_imageLink_key" ON "Courses"("imageLink");
