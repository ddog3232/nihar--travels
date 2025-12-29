import { Destination } from '../types';

// Imported from the main NIHAR Holidays site
// This ensures the animation editor uses the exact same path
export const DESTINATIONS: Destination[] = [
  {
    id: 'intro',
    name: 'Start Your Journey',
    region: 'NIHAR Holidays',
    coordinates: { x: 50, y: 18 }
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    region: 'Uttarakhand, India',
    coordinates: { x: 80, y: 32 }
  },
  {
    id: 'munnar',
    name: 'Munnar',
    region: 'Kerala, India',
    coordinates: { x: 20, y: 46 }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    region: 'Rajasthan, India',
    coordinates: { x: 75, y: 60 }
  },
  {
    id: 'ladakh',
    name: 'Leh Ladakh',
    region: 'Himalayas, India',
    coordinates: { x: 30, y: 75 }
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    region: 'Uttar Pradesh, India',
    coordinates: { x: 60, y: 92 }
  }
];
