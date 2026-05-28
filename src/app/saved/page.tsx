"use client";

import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import HikeCard from "@/components/HikeCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function SavedHikesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data, error, isLoading, mutate } = useSWR("/api/saved", fetcher);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <p className="text-red-600 text-lg">Failed to load saved hikes. Please try again later.</p>
      </div>
    );
  }

  const savedHikes = data?.savedHikes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Saved Hikes</h1>
        <p className="text-gray-600">Track your favorite adventures</p>
      </div>

      {savedHikes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedHikes.map((hike: any) => (
            <HikeCard key={hike._id} hike={hike} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven&apos;t saved any hikes yet.</p>
          <p className="text-gray-500">Start exploring and save your favorites!</p>
        </div>
      )}
    </div>
  );
}
