-- CreateTable
CREATE TABLE "thumbnail" (
    "productId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "thumbnail_productId_key" ON "thumbnail"("productId");

-- AddForeignKey
ALTER TABLE "thumbnail" ADD CONSTRAINT "thumbnail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
