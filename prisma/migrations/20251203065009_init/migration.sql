-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Student', 'Librarian');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Taken', 'Pending', 'Returned');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'Student',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Books" (
    "book_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publication_year" INTEGER NOT NULL,
    "available_copies" INTEGER NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "Borrower" (
    "borrower_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "borrow_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Borrower_pkey" PRIMARY KEY ("borrower_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Books"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;
