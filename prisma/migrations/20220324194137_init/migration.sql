-- CreateTable
CREATE TABLE "Relations" (
    "id" TEXT NOT NULL,
    "followed_id" TEXT,
    "follower_id" TEXT,

    CONSTRAINT "Relations_pkey" PRIMARY KEY ("id")
);
