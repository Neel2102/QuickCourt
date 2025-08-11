import React from 'react';
import { MapPin, Globe, Phone } from 'lucide-react';
import VenueMap from './VenueMap.jsx';
import VenueGallery from './VenueGallery.jsx';

const VenueDetails = ({ venue }) => {
  if (!venue) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{venue.name}</h2>
        {venue.description && <p className="text-gray-600">{venue.description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <MapPin className="w-4 h-4" />
            <span>{venue.address}{venue.city ? `, ${venue.city}` : ''}</span>
          </div>
          {venue.phone && (
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <span>{venue.phone}</span>
            </div>
          )}
          {venue.website && (
            <div className="flex items-center space-x-2 text-gray-700">
              <Globe className="w-4 h-4" />
              <a href={venue.website} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                {venue.website}
              </a>
            </div>
          )}
        </div>
      </div>

      <VenueMap address={`${venue.address}${venue.city ? `, ${venue.city}` : ''}`} height={220} />

      <VenueGallery images={venue.images || []} />

      {Array.isArray(venue.sportTypes) && venue.sportTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Sports</h3>
          <div className="flex flex-wrap gap-2">
            {venue.sportTypes.map((s) => (
              <span key={s} className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails; 
