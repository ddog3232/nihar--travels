import { Destination, TravelPackage, AgencyService } from './types';

export const DESTINATIONS: Destination[] = [
  {
    id: 'intro',
    name: 'Start Your Journey',
    region: 'NIHAR Holidays',
    description: 'Embark on a soul-stirring journey through the heart of India and beyond. Scroll to explore our curated destinations.',
    highlights: [],
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1920&auto=format&fit=crop', 
    coordinates: { x: 50, y: 18 }
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    region: 'Uttarakhand, India',
    description: 'The Yoga Capital of the World. Find peace by the Ganges, adrenaline in the rapids, and spirituality in the air.',
    highlights: ['Ganga Aarti', 'River Rafting', 'Yoga Ashrams'],
    image: './Images/rishikesh.jpg', 
    coordinates: { x: 80, y: 32 },
    testimonial: {
      text: "The evening Aarti at Parmarth Niketan changed my life. NIHAR Travels arranged the perfect view.",
      author: "Sarah J."
    }
  },
  {
    id: 'munnar',
    name: 'Munnar',
    region: 'Kerala, India',
    description: 'Endless tea plantations and misty rolling hills. A perfect escape into nature’s lap in God’s Own Country.',
    highlights: ['Tea Gardens', 'Eravikulam Park', 'Tree Houses'],
    image: './Images/munnar.jpg',
    coordinates: { x: 20, y: 46 },
    testimonial: {
      text: "Waking up above the clouds in a treehouse was magical. Highly recommended!",
      author: "Rahul & Priya"
    }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    region: 'Rajasthan, India',
    description: 'The Pink City offering a royal blend of heritage, culture, and architectural marvels.',
    highlights: ['Amber Fort', 'Hawa Mahal', 'City Palace'],
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1920&auto=format&fit=crop',
    coordinates: { x: 75, y: 60 },
    testimonial: {
      text: "Felt like royalty. The guided heritage walk through the bazaar was the highlight.",
      author: "Amit V."
    }
  },
  {
    id: 'ladakh',
    name: 'Leh Ladakh',
    region: 'Himalayas, India',
    description: 'Rugged terrains, crystal blue lakes, and ancient monasteries. A road trip of a lifetime.',
    highlights: ['Pangong Lake', 'Nubra Valley', 'Magnetic Hill'],
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1920&auto=format&fit=crop', 
    coordinates: { x: 30, y: 75 },
    testimonial: {
      text: "The bike trip arranged by NIHAR was flawless. The support team was amazing.",
      author: "Mike T."
    }
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    region: 'Uttar Pradesh, India',
    description: 'One of the oldest living cities in the world. A chaotic, colorful, and spiritual experience on the ghats of the Ganges.',
    highlights: ['Kashi Vishwanath', 'Boat Ride', 'Sarnath'],
    image: './Images/varanasi.jpg',
    coordinates: { x: 60, y: 92 },
    testimonial: {
      text: "An intense, beautiful spiritual awakening. The boat ride at sunrise is a must.",
      author: "Elena R."
    }
  }
];

export const PATH_STOPS = DESTINATIONS.length;
export const SCROLL_HEIGHT_PER_STOP = 100; // vh

export const DOMESTIC_PACKAGES: TravelPackage[] = [
  {
    id: 'goa',
    title: 'Goa Beach Bliss',
    location: 'Goa',
    duration: '4 Days / 3 Nights',
    price: '₹15,999',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
    features: ['Airport Pickup', 'Breakfast Included', 'Water Sports']
  },
  {
    id: 'kashmir',
    title: 'Paradise on Earth',
    location: 'Kashmir',
    duration: '6 Days / 5 Nights',
    price: '₹28,500',
    image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=800',
    features: ['Houseboat Stay', 'Gulmarg Gondola', 'Private Cab']
  },
  {
    id: 'andaman',
    title: 'Andaman Escape',
    location: 'Andaman Nicobar',
    duration: '5 Days / 4 Nights',
    price: '₹32,000',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=800',
    features: ['Scuba Diving', 'Ferry Transfers', 'Luxury Resort']
  },
  {
    id: 'himachal',
    title: 'Majestic Himachal',
    location: 'Manali & Shimla',
    duration: '7 Days / 6 Nights',
    price: '₹22,000',
    image: 'https://images.unsplash.com/photo-1605649487215-476786e5b4e4?q=80&w=800',
    features: ['Solang Valley', 'Rohtang Pass', 'Bonfire Night']
  }
];

export const INTERNATIONAL_PACKAGES: TravelPackage[] = [
  {
    id: 'thailand',
    title: 'Amazing Thailand',
    location: 'Bangkok & Pattaya',
    duration: '5 Days / 4 Nights',
    price: '₹35,000',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800',
    features: ['Coral Island', 'City Tour', 'Visa Assistance']
  },
  {
    id: 'dubai',
    title: 'Dazzling Dubai',
    location: 'UAE',
    duration: '5 Days / 4 Nights',
    price: '₹45,999',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea932a23518?q=80&w=800',
    features: ['Desert Safari', 'Burj Khalifa Top', 'Dhow Cruise']
  },
  {
    id: 'bali',
    title: 'Bali Getaway',
    location: 'Indonesia',
    duration: '6 Days / 5 Nights',
    price: '₹42,000',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800',
    features: ['Ubud Tour', 'Sunset Dinner', 'Private Pool Villa']
  },
  {
    id: 'singapore',
    title: 'Singapore Delight',
    location: 'Singapore',
    duration: '5 Days / 4 Nights',
    price: '₹55,000',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800',
    features: ['Sentosa Island', 'Universal Studios', 'Night Safari']
  }
];

export const AGENCY_SERVICES: AgencyService[] = [
  {
    id: 'visa',
    title: 'Visa Assistance',
    description: 'Hassle-free visa processing for all major countries with expert guidance on documentation.',
    icon: '🛂'
  },
  {
    id: 'flight',
    title: 'Flight Bookings',
    description: 'Best deals on domestic and international flights. We find the shortest routes and cheapest fares.',
    icon: '✈️'
  },
  {
    id: 'hotel',
    title: 'Hotel Reservations',
    description: 'From luxury resorts to budget stays, we book accommodations that suit your style.',
    icon: '🏨'
  },
  {
    id: 'train',
    title: 'Train Tickets',
    description: 'Authorized IRCTC booking agents. Confirmed tickets for Tatkal and General quotas.',
    icon: '🚆'
  },
  {
    id: 'forex',
    title: 'Forex & Currency',
    description: 'Best exchange rates for your travel currency needs. Safe and secure transactions.',
    icon: '💱'
  },
  {
    id: 'insurance',
    title: 'Travel Insurance',
    description: 'Comprehensive travel insurance plans to keep you safe from unexpected events.',
    icon: '🛡️'
  }
];