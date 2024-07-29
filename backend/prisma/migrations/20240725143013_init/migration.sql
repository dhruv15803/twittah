-- CreateTable
CREATE TABLE "Likes" (
    "liked_by_id" TEXT NOT NULL,
    "liked_post_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Likes_liked_by_id_liked_post_id_key" ON "Likes"("liked_by_id", "liked_post_id");

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_liked_by_id_fkey" FOREIGN KEY ("liked_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_liked_post_id_fkey" FOREIGN KEY ("liked_post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
