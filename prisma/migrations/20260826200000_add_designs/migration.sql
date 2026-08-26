-- CreateTable
CREATE TABLE "designs" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "date" DATE,
    "author" TEXT,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "designs_key_key" ON "designs"("key");
