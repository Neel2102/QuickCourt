import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getVenues, searchVenues, getVenuesBySport } from '../services/venueService';

export const useVenues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sportType: 'all',
    priceRange: 'all',
    rating: 'all',
    location: '',
  });

  // Fetch all venues
  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVenues();
      setVenues(data);
      setFilteredVenues(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch venues');
      toast.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search venues with filters
  const searchVenuesWithFilters = useCallback(async (searchTerm, searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const allFilters = { ...filters, ...searchFilters };
      const data = await searchVenues(allFilters);
      
      // Apply search term filter locally if needed
      let results = data;
      if (searchTerm) {
        results = data.filter(venue => 
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.address?.state?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredVenues(results);
      return results;
    } catch (err) {
      setError(err.message || 'Failed to search venues');
      toast.error('Failed to search venues');
      return [];
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Get venues by sport type
  const fetchVenuesBySport = useCallback(async (sportType) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVenuesBySport(sportType);
      setFilteredVenues(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch venues by sport');
      toast.error('Failed to load venues by sport');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters locally
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    let results = venues;
    
    // Filter by sport type
    if (newFilters.sportType && newFilters.sportType !== 'all') {
      results = results.filter(venue => 
        venue.sportTypes.includes(newFilters.sportType)
      );
    }
    
    // Filter by price range
    if (newFilters.priceRange && newFilters.priceRange !== 'all') {
      results = results.filter(venue => {
        const minPrice = venue.courts?.[0]?.pricePerHour || venue.pricePerHour || 0;
        switch (newFilters.priceRange) {
          case 'low':
            return minPrice <= 500;
          case 'medium':
            return minPrice > 500 && minPrice <= 1000;
          case 'high':
            return minPrice > 1000;
          default:
            return true;
        }
      });
    }
    
    // Filter by rating
    if (newFilters.rating && newFilters.rating !== 'all') {
      results = results.filter(venue => {
        const rating = venue.rating || 0;
        switch (newFilters.rating) {
          case 'excellent':
            return rating >= 4.5;
          case 'good':
            return rating >= 4.0;
          case 'average':
            return rating >= 3.0;
          case 'poor':
            return rating < 3.0;
          default:
            return true;
        }
      });
    }
    
    // Filter by location
    if (newFilters.location) {
      results = results.filter(venue =>
        venue.address?.city?.toLowerCase().includes(newFilters.location.toLowerCase()) ||
        venue.address?.state?.toLowerCase().includes(newFilters.location.toLowerCase())
      );
    }
    
    setFilteredVenues(results);
  }, [venues]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      sportType: 'all',
      priceRange: 'all',
      rating: 'all',
      location: '',
    });
    setFilteredVenues(venues);
  }, [venues]);

  // Get unique sport types from venues
  const getAvailableSports = useCallback(() => {
    const sports = new Set();
    venues.forEach(venue => {
      if (venue.sportTypes) {
        venue.sportTypes.forEach(sport => sports.add(sport));
      }
    });
    return Array.from(sports).sort();
  }, [venues]);

  // Get price ranges
  const getPriceRanges = useCallback(() => {
    const prices = venues.map(venue => 
      venue.courts?.[0]?.pricePerHour || venue.pricePerHour || 0
    ).filter(price => price > 0);
    
    if (prices.length === 0) return [];
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return [
      { label: 'Low (≤₹500)', value: 'low', range: [0, 500] },
      { label: 'Medium (₹501-₹1000)', value: 'medium', range: [501, 1000] },
      { label: 'High (>₹1000)', value: 'high', range: [1001, maxPrice] },
    ];
  }, [venues]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  return {
    venues,
    filteredVenues,
    loading,
    error,
    filters,
    fetchVenues,
    searchVenuesWithFilters,
    fetchVenuesBySport,
    applyFilters,
    clearFilters,
    getAvailableSports,
    getPriceRanges,
    clearError,
  };
};

export default useVenues; 
