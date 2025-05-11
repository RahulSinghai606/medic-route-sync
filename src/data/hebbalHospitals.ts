
export interface HebbalHospital {
  id: number;
  name: string;
  distance: number;
  eta: number;
  specialties: string[];
  availableBeds: number;
  icuCapacity: {
    total: number;
    available: number;
  };
  waitTime: number;
  address: string;
  phone: string;
  matchScore: number;
  lat: number;
  lng: number;
}

// Hospitals near Hebbal, Bangalore with relevant details
export const hebbalHospitals: HebbalHospital[] = [
  {
    id: 1,
    name: 'Manipal Hospital, Hebbal',
    distance: 1.2,
    eta: 5,
    specialties: ['Cardiology', 'Neurology', 'Trauma Center', 'Orthopedics'],
    availableBeds: 15,
    icuCapacity: {
      total: 30,
      available: 8
    },
    waitTime: 10,
    address: 'Airport Road, Hebbal, Bengaluru, Karnataka 560024',
    phone: '080-2502 4444',
    matchScore: 95,
    lat: 13.0477,
    lng: 77.5936
  },
  {
    id: 2,
    name: 'Columbia Asia Hospital, Hebbal',
    distance: 2.8,
    eta: 8,
    specialties: ['General Medicine', 'Orthopedics', 'Pediatrics', 'Emergency'],
    availableBeds: 12,
    icuCapacity: {
      total: 25,
      available: 6
    },
    waitTime: 15,
    address: 'Kirloskar Business Park, Hebbal, Bengaluru, Karnataka 560024',
    phone: '080-6165 6262',
    matchScore: 90,
    lat: 13.0495,
    lng: 77.5880
  },
  {
    id: 3,
    name: 'Aster CMI Hospital',
    distance: 3.5,
    eta: 12,
    specialties: ['Cardiology', 'Oncology', 'Gastroenterology', 'Neurosurgery'],
    availableBeds: 8,
    icuCapacity: {
      total: 40,
      available: 5
    },
    waitTime: 25,
    address: 'New Airport Road, NH 44, Hebbal, Bengaluru, Karnataka 560092',
    phone: '080-4342 0100',
    matchScore: 75,
    lat: 13.0583,
    lng: 77.5958
  },
  {
    id: 4,
    name: 'Bangalore Baptist Hospital',
    distance: 5.1,
    eta: 18,
    specialties: ['General Medicine', 'Obstetrics', 'Pediatrics'],
    availableBeds: 5,
    icuCapacity: {
      total: 20,
      available: 2
    },
    waitTime: 30,
    address: 'Bellary Road, Hebbal, Bengaluru, Karnataka 560024',
    phone: '080-2202 4700',
    matchScore: 45,
    lat: 13.0432,
    lng: 77.5798
  },
  {
    id: 5,
    name: 'Sagar Hospitals, Hebbal',
    distance: 2.3,
    eta: 7,
    specialties: ['Cardiology', 'Nephrology', 'Orthopedics'],
    availableBeds: 10,
    icuCapacity: {
      total: 15,
      available: 4
    },
    waitTime: 20,
    address: 'Prasannahalli Main Rd, Hebbal, Bengaluru, Karnataka 560092',
    phone: '080-4277 7000',
    matchScore: 80,
    lat: 13.0521,
    lng: 77.6001
  },
  {
    id: 6,
    name: 'People Tree Hospitals',
    distance: 4.0,
    eta: 15,
    specialties: ['General Surgery', 'Orthopedics', 'Gynecology'],
    availableBeds: 7,
    icuCapacity: {
      total: 10,
      available: 3
    },
    waitTime: 25,
    address: 'Goraguntepalya, Yeshwanthpur, Bengaluru, Karnataka 560022',
    phone: '080-2205 2222',
    matchScore: 60,
    lat: 13.0212,
    lng: 77.5548
  }
];

// Return hospitals sorted by match score
export const getHebbalHospitals = () => {
  return hebbalHospitals.sort((a, b) => b.matchScore - a.matchScore);
};

// Function to get match score color
export const getMatchScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
  if (score >= 75) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
  if (score >= 60) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
  return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
};

// Function to get match indicator (emoji)
export const getMatchIndicator = (score: number): string => {
  if (score >= 90) return '🟢';
  if (score >= 75) return '🟡';
  if (score >= 60) return '🟠';
  return '🔴';
};
