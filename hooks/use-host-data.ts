"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

// Types for host data
export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    basePrice: number;
    currency: string;
    pricePerNight: number;
    cleaningFee: number;
    serviceFee: number;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    propertyType: string;
    amenities: string[];
  };
  images: string[];
  host: {
    id: string;
    name: string;
    avatar: string;
    joinedDate: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    superhost: boolean;
  };
  availability: {
    instantBook: boolean;
    minStay: number;
    maxStay: number;
    checkIn: string;
    checkOut: string;
  };
  ratings: {
    overall: number;
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    value: number;
  };
  reviews: Array<{
    id: string;
    guestName: string;
    guestAvatar: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  blockchain: {
    contractAddress: string;
    tokenId: number;
    network: string;
    verified: boolean;
    createdAt: string;
    lastUpdated: string;
  };
  status: "active" | "inactive" | "pending";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Host {
  id: string;
  walletAddress: string;
  profile: {
    name: string;
    bio: string;
    avatar: string;
    languages: string[];
    responseTime: string;
    responseRate: number;
  };
  properties: string[];
  stats: {
    totalBookings: number;
    totalEarnings: number;
    averageRating: number;
    reviewCount: number;
    joinedDate: string;
    superhost: boolean;
    verified: boolean;
  };
  earnings: {
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
    allTime: number;
    currency: string;
  };
  settings: {
    instantBookEnabled: boolean;
    autoAcceptBookings: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  verification: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    address: boolean;
    paymentMethod: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  hostId: string;
  guestWallet: string;
  guestName: string;
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  guests: {
    adults: number;
    children: number;
    total: number;
  };
  pricing: {
    basePrice: number;
    nights: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    total: number;
    currency: string;
  };
  payment: {
    method: string;
    txHash: string;
    status: "pending" | "completed" | "failed";
    paidAt: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface HostData {
  properties: Property[];
  hosts: Host[];
  bookings: Booking[];
  analytics: {
    totalProperties: number;
    totalHosts: number;
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    occupancyRate: number;
    lastUpdated: string;
  };
}

export function useHostData() {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<HostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from JSON file
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/data.json');
        if (!response.ok) {
          throw new Error('Failed to load host data');
        }
        const hostData = await response.json();
        setData(hostData);
        setError(null);
      } catch (err) {
        console.error('Error loading host data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get current host data based on wallet address
  const getCurrentHost = (): Host | null => {
    if (!data || !address) return null;
    return data.hosts.find(host => 
      host.walletAddress.toLowerCase() === address.toLowerCase()
    ) || null;
  };

  // Get properties owned by current host
  const getHostProperties = (): Property[] => {
    const currentHost = getCurrentHost();
    if (!currentHost || !data) return [];
    
    return data.properties.filter(property => 
      currentHost.properties.includes(property.id)
    );
  };

  // Get bookings for current host's properties
  const getHostBookings = (): Booking[] => {
    const currentHost = getCurrentHost();
    if (!currentHost || !data) return [];
    
    return data.bookings.filter(booking => 
      booking.hostId === currentHost.id
    );
  };

  // Get all properties (for browsing)
  const getAllProperties = (): Property[] => {
    return data?.properties || [];
  };

  // Get property by ID
  const getPropertyById = (id: string): Property | null => {
    if (!data) return null;
    return data.properties.find(property => property.id === id) || null;
  };

  // Check if user is a host
  const isHost = (): boolean => {
    return getCurrentHost() !== null;
  };

  // Add new property (mock implementation)
  const addProperty = async (propertyData: Partial<Property>): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      console.log('Adding property:', propertyData);
      
      // Mock success
      return true;
    } catch (err) {
      console.error('Error adding property:', err);
      return false;
    }
  };

  // Update property (mock implementation)
  const updateProperty = async (id: string, updates: Partial<Property>): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      console.log('Updating property:', id, updates);
      
      // Mock success
      return true;
    } catch (err) {
      console.error('Error updating property:', err);
      return false;
    }
  };

  // Calculate host earnings
  const calculateEarnings = () => {
    const currentHost = getCurrentHost();
    if (!currentHost) return null;

    const hostBookings = getHostBookings();
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
    const thisYear = new Date(thisMonth.getFullYear(), 0, 1);

    const thisMonthEarnings = hostBookings
      .filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getMonth() === thisMonth.getMonth() && 
               bookingDate.getFullYear() === thisMonth.getFullYear();
      })
      .reduce((sum, booking) => sum + booking.pricing.total, 0);

    const thisYearEarnings = hostBookings
      .filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate.getFullYear() === thisMonth.getFullYear();
      })
      .reduce((sum, booking) => sum + booking.pricing.total, 0);

    return {
      thisMonth: thisMonthEarnings,
      thisYear: thisYearEarnings,
      allTime: currentHost.earnings.allTime,
      currency: currentHost.earnings.currency,
    };
  };

  // Get host analytics
  const getHostAnalytics = () => {
    const currentHost = getCurrentHost();
    const hostProperties = getHostProperties();
    const hostBookings = getHostBookings();

    if (!currentHost) return null;

    const totalRevenue = hostBookings.reduce((sum, booking) => sum + booking.pricing.total, 0);
    const averageRating = hostProperties.reduce((sum, property) => sum + property.ratings.overall, 0) / hostProperties.length || 0;
    const occupancyRate = Math.round((hostBookings.length / (hostProperties.length * 30)) * 100); // Rough calculation

    return {
      totalProperties: hostProperties.length,
      totalBookings: hostBookings.length,
      totalRevenue,
      averageRating: Math.round(averageRating * 10) / 10,
      occupancyRate,
      responseRate: currentHost.profile.responseRate,
      responseTime: currentHost.profile.responseTime,
    };
  };

  return {
    // Data
    data,
    loading,
    error,
    
    // Host info
    currentHost: getCurrentHost(),
    isHost: isHost(),
    isConnected,
    
    // Properties
    hostProperties: getHostProperties(),
    allProperties: getAllProperties(),
    getPropertyById,
    
    // Bookings
    hostBookings: getHostBookings(),
    
    // Analytics
    earnings: calculateEarnings(),
    analytics: getHostAnalytics(),
    
    // Actions
    addProperty,
    updateProperty,
    
    // Utils
    refetch: () => {
      // Trigger data reload
      window.location.reload();
    },
  };
}
