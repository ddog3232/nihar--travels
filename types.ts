export interface Testimonial {
  text: string;
  author: string;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  description: string;
  highlights: string[];
  image: string; // Static Unsplash URL
  coordinates: { x: number; y: number }; // Percentage position on the curved path
  testimonial?: Testimonial;
}

export interface TripPlanRequest {
  destination: string;
  days: number;
  travelers: string;
  budget: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  image: string; // Static Unsplash URL
  features: string[];
}

export interface AgencyService {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}