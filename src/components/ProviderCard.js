"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProviderCard({ provider }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse h-full">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Provider Image */}
      <div className="relative h-48 w-full">
        <Image
          src={provider.avatar || "/default.jpg"}
          alt={provider.businessName || "Service Provider"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {provider.isVerified && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
            <FaCheckCircle className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Provider Info */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900">
            {provider.businessName}
          </h3>
          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
            <span className="text-blue-600 font-medium">
              {provider.rating?.toFixed(1) || "New"}
            </span>
            {provider.rating && (
              <div className="flex ml-1">{renderStars(provider.rating)}</div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mt-1">
          {provider.services?.join(", ") || "Service Provider"}
        </p>

        <div className="flex items-center mt-2 text-gray-500">
          <FaMapMarkerAlt className="mr-1" />
          <span className="text-sm">
            {provider.location || "Not specified"}
          </span>
        </div>

        <div className="flex items-center mt-2 text-gray-500">
          <FaClock className="mr-1" />
          <span className="text-sm">
            {provider.experience
              ? `${provider.experience}+ years experience`
              : "Experience not specified"}
          </span>
        </div>

        <p className="text-gray-700 mt-3 line-clamp-3 flex-grow">
          {provider.description ||
            "Professional service provider with excellent customer reviews."}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            // onClick={() => router.push(`/book/${provider._id}`)}
            onClick={()=>router.push("")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
