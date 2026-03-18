-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "origin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "serviceDuration" INTEGER NOT NULL,
    "orderIndex" INTEGER,
    "tripId" TEXT NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteCache" (
    "id" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "durationMin" INTEGER NOT NULL,

    CONSTRAINT "RouteCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RouteCache_originCity_destinationCity_key" ON "RouteCache"("originCity", "destinationCity");

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
