import React from 'react';
import { MapPin } from 'lucide-react';

const VenueMap = ({ address = '', height = 200 }) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden" style={{ height }}>
      <div className="w-full h-full flex items-center justify-center text-gray-600">
        <div className="text-center p-4">
          <MapPin className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm">Map preview unavailable in demo</p>
          {address && (
            <a href={mapUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueMap; 
