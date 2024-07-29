-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "post_text" TEXT NOT NULL,
    "post_author_id" TEXT NOT NULL,
    "post_images" TEXT[],
    "parent_post_id" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_post_author_id_fkey" FOREIGN KEY ("post_author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parent_post_id_fkey" FOREIGN KEY ("parent_post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
