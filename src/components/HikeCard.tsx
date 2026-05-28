import Image from "next/image";
import Link from "next/link";

interface Hike {
  _id: string;
  title: string;
  country: string;
  region: string;
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert";
  distance: number;
  description: string;
  images: string[];
}

export default function HikeCard({ hike }: { hike: Hike }) {
  const difficultyColors: Record<string, string> = {
    Easy: "bg-green-100 text-green-800",
    Moderate: "bg-yellow-100 text-yellow-800",
    Hard: "bg-orange-100 text-orange-800",
    Expert: "bg-red-100 text-red-800",
  };

  return (
    <Link href={`/hike/${hike._id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={hike.images[0]}
            alt={hike.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {hike.title}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[hike.difficulty]}`}
            >
              {hike.difficulty}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2">
            {hike.country}, {hike.region}
          </p>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="font-medium">{hike.distance} km</span>
          </div>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {hike.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
