"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import { countries } from "@/lib/countries";
import HikeCard from "@/components/HikeCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const getKey = useCallback((pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.hikes.length) return null;

    const params = new URLSearchParams();
    params.set("page", (pageIndex + 1).toString());
    params.set("limit", "10");
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCountry) params.set("country", selectedCountry);
    if (selectedRegion) params.set("region", selectedRegion);

    return `/api/hikes?${params.toString()}`;
  }, [searchQuery, selectedCountry, selectedRegion]);

  const { data, error, isLoading, setSize, mutate } = useSWRInfinite(
    getKey,
    fetcher
  );

  const hikes = data ? data.flatMap((page) => page.hikes) : [];
  const hasMore = data ? data[data.length - 1].page < data[data.length - 1].totalPages : false;

  const lastHikeRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSize((size) => size + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, setSize]
  );

  useEffect(() => {
    setSelectedRegion("");
  }, [selectedCountry]);

  // When filters change, reset to page 1
  useEffect(() => {
    setSize(1);
  }, [searchQuery, selectedCountry, selectedRegion, setSize]);

  const regions = selectedCountry ? countries[selectedCountry as keyof typeof countries] : [];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <p className="text-red-600 text-lg">Failed to load hikes. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Adventure</h1>
        <p className="text-gray-600">Explore amazing hiking trails from around the world</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="w-full sm:w-96">
          <label className="block text-sm font-medium text-gray-900 mb-1">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hikes by title or description..."
            className="w-full px-4 py-2 border border-gray-600 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>
        <div className="w-full sm:w-64">
          <label className="block text-sm font-medium text-gray-900 mb-1">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {Object.keys(countries).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {regions.length > 0 && (
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-900 mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isLoading && !data?.length && <LoadingSkeleton />}

      {hikes.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hikes.map((hike: any, index: number) => (
              <div
                key={hike._id}
                ref={index === hikes.length - 1 ? lastHikeRef : null}
              >
                <HikeCard hike={hike} />
              </div>
            ))}
          </div>
          {isLoading && <LoadingSkeleton count={4} />}
        </>
      )}

      {!isLoading && hikes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hikes found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
