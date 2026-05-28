"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function HikeDetailPage() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(`/api/hikes/${id}`, fetcher);
  const { user, mutate: mutateUser } = useAuth();
  const { showToast } = useToast();

  const hike = data?.hike;

  const isSaved = user?.savedHikes?.some((hikeId: any) => hikeId._id === id || hikeId === id);

  const handleSave = async () => {
    if (!user) {
      showToast("Please login to save hikes", "info");
      return;
    }

    try {
      if (isSaved) {
        await fetch(`/api/saved/${id}`, { method: "DELETE" });
        showToast("Hike removed from saved", "success");
      } else {
        await fetch(`/api/saved/${id}`, { method: "POST" });
        showToast("Hike saved!", "success");
      }
      mutateUser();
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-96 bg-gray-200 rounded-xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !hike) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <p className="text-red-600 text-lg">Failed to load hike. Please try again later.</p>
      </div>
    );
  }

  const difficultyColors: Record<string, string> = {
    Easy: "bg-green-100 text-green-800",
    Moderate: "bg-yellow-100 text-yellow-800",
    Hard: "bg-orange-100 text-orange-800",
    Expert: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
        <Image src={hike.images[0]} alt={hike.title} fill className="object-cover" />
        <button
          onClick={handleSave}
          className={`absolute top-4 right-4 px-6 py-2 rounded-lg font-medium transition-all ${
            isSaved
              ? "bg-white text-green-700 hover:bg-gray-100"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isSaved ? "Unsave" : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{hike.title}</h1>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${difficultyColors[hike.difficulty]}`}
            >
              {hike.difficulty}
            </span>
          </div>

          <p className="text-gray-600 mb-2">
            {hike.country}, {hike.region}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Distance</p>
              <p className="text-xl font-semibold text-gray-900">{hike.distance} km</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Elevation</p>
              <p className="text-xl font-semibold text-gray-900">{hike.elevation} m</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Duration</p>
              <p className="text-xl font-semibold text-gray-900">{hike.duration}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-500 text-sm">Best Season</p>
              <p className="text-xl font-semibold text-gray-900">{hike.bestSeason}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{hike.description}</p>
          </div>

          {hike.images.length > 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hike.images.slice(1).map((image: string, index: number) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image src={image} alt={`${hike.title} ${index + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
        <div className="w-full h-64 rounded-lg overflow-hidden mb-4">
          <iframe
            title="Hike Location"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${hike.coordinates.lng - 0.05}%2C${hike.coordinates.lat - 0.05}%2C${hike.coordinates.lng + 0.05}%2C${hike.coordinates.lat + 0.05}&layer=mapnik&marker=${hike.coordinates.lat}%2C${hike.coordinates.lng}`}
            allowFullScreen
          ></iframe>
        </div>
        <p className="text-gray-600 text-sm">
          Coordinates: {hike.coordinates.lat}, {hike.coordinates.lng}
        </p>
      </div>
        </div>
      </div>
    </div>
  );
}
