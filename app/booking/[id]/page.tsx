import { BookingConfirmation } from "@/components/booking-confirmation"

// Mock booking data - in real app this would come from API/blockchain
const mockBooking = {
  id: "1",
  property: {
    title: "Luxury Beachfront Villa with Private Pool",
    location: "Maldives, Indian Ocean",
    image: "/luxury-beachfront-villa-maldives.jpg",
    rating: 4.9,
    reviews: 127,
  },
  checkIn: "Dec 15, 2024",
  checkOut: "Dec 22, 2024",
  guests: 4,
  nights: 7,
  total: 3150,
  currency: "XRP" as const,
  transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
  status: "confirmed" as const,
}

export default function BookingConfirmationPage() {
  return <BookingConfirmation booking={mockBooking} />
}
