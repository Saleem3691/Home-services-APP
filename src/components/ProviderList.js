'use client';
import { useEffect, useState } from 'react';
import ProviderCard from './ProviderCard';
import { Skeleton } from './ui/skeleton';

export default function ProvidersList({ serviceType }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/providers?service=${encodeURIComponent(serviceType)}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch providers');
        }
        
        const { providers } = await res.json();
        setProviders(providers);
      } catch (err) {
        setError(err.message);
        console.error('Provider fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [serviceType]);

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <h3 className="text-red-600 font-medium">Error loading providers</h3>
        <p className="text-red-500 mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden h-full">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h3 className="text-gray-700 font-medium">No providers available</h3>
        <p className="text-gray-500 mt-2">
          There are currently no service providers for this category. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => (
        <ProviderCard key={provider._id} provider={provider} />
      ))}
    </div>
  );
}