
export interface ComprehensiveHospital {
  id: number;
  name: string;
  type: 'Government' | 'Private' | 'Trust' | 'Corporate';
  specialties: string[];
  availableBeds: number;
  icuBeds: number;
  waitTime: number;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  pincode: string;
  emergencyServices: boolean;
  traumaCenter: boolean;
  accreditation: string[];
}

// Comprehensive hospital database covering major Indian cities
export const comprehensiveHospitals: ComprehensiveHospital[] = [
  // Mumbai - Government Hospitals
  {
    id: 1,
    name: 'King Edward Memorial Hospital (KEM)',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Trauma Center', 'Cardiology', 'Neurology', 'Orthopedics', 'General Surgery', 'Internal Medicine'],
    availableBeds: 25,
    icuBeds: 8,
    waitTime: 15,
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    phone: '022-2410-7000',
    lat: 19.0127,
    lng: 72.8434,
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400012',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH', 'JCI']
  },
  {
    id: 2,
    name: 'Lokmanya Tilak Municipal General Hospital (Sion Hospital)',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'Oncology', 'Nephrology', 'Gastroenterology'],
    availableBeds: 20,
    icuBeds: 6,
    waitTime: 20,
    address: 'Sion, Mumbai, Maharashtra 400022',
    phone: '022-2407-6601',
    lat: 19.0438,
    lng: 72.8636,
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400022',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH']
  },
  // Mumbai - Private Hospitals
  {
    id: 3,
    name: 'Lilavati Hospital and Research Centre',
    type: 'Private',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Gastroenterology', 'Emergency Medicine'],
    availableBeds: 18,
    icuBeds: 5,
    waitTime: 10,
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050',
    phone: '022-2640-0000',
    lat: 19.0559,
    lng: 72.8317,
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH', 'JCI']
  },
  {
    id: 4,
    name: 'Breach Candy Hospital Trust',
    type: 'Trust',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'General Surgery', 'Internal Medicine'],
    availableBeds: 15,
    icuBeds: 4,
    waitTime: 12,
    address: '60A, Bhulabhai Desai Road, Breach Candy, Mumbai, Maharashtra 400026',
    phone: '022-2367-1888',
    lat: 18.9694,
    lng: 72.8103,
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400026',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH']
  },
  // Delhi - Government Hospitals
  {
    id: 5,
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Trauma Center', 'Cardiology', 'Neurosurgery', 'Oncology', 'Nephrology'],
    availableBeds: 30,
    icuBeds: 10,
    waitTime: 25,
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029',
    phone: '011-2658-8500',
    lat: 28.5672,
    lng: 77.2100,
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH', 'JCI']
  },
  {
    id: 6,
    name: 'Safdarjung Hospital',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'General Surgery'],
    availableBeds: 22,
    icuBeds: 7,
    waitTime: 18,
    address: 'Ansari Nagar West, New Delhi, Delhi 110029',
    phone: '011-2673-0000',
    lat: 28.5684,
    lng: 77.2086,
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH']
  },
  // Delhi - Private Hospitals
  {
    id: 7,
    name: 'Fortis Escorts Heart Institute',
    type: 'Corporate',
    specialties: ['Cardiology', 'Cardiac Surgery', 'Emergency Medicine', 'Neurology'],
    availableBeds: 12,
    icuBeds: 4,
    waitTime: 8,
    address: 'Okhla Road, New Delhi, Delhi 110025',
    phone: '011-4713-5000',
    lat: 28.5355,
    lng: 77.2503,
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110025',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH', 'JCI']
  },
  {
    id: 8,
    name: 'Max Super Speciality Hospital, Saket',
    type: 'Corporate',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Emergency Medicine'],
    availableBeds: 16,
    icuBeds: 5,
    waitTime: 10,
    address: '1, 2, Press Enclave Road, Saket, New Delhi, Delhi 110017',
    phone: '011-2651-5050',
    lat: 28.5244,
    lng: 77.2066,
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110017',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH', 'JCI']
  },
  // Bangalore - Government Hospitals
  {
    id: 9,
    name: 'Victoria Hospital (BMCRI)',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Trauma Center', 'Cardiology', 'Neurology', 'General Surgery'],
    availableBeds: 28,
    icuBeds: 8,
    waitTime: 22,
    address: 'Fort, Bengaluru, Karnataka 560002',
    phone: '080-2670-1150',
    lat: 12.9716,
    lng: 77.5946,
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560002',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH']
  },
  {
    id: 10,
    name: 'Kidwai Memorial Institute of Oncology',
    type: 'Government',
    specialties: ['Oncology', 'Radiation Therapy', 'Surgical Oncology', 'Medical Oncology'],
    availableBeds: 15,
    icuBeds: 4,
    waitTime: 30,
    address: 'Dr M H Marigowda Road, Bengaluru, Karnataka 560029',
    phone: '080-2659-2032',
    lat: 12.9279,
    lng: 77.5619,
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560029',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH']
  },
  // Bangalore - Private Hospitals
  {
    id: 11,
    name: 'Manipal Hospital, Hebbal',
    type: 'Corporate',
    specialties: ['Cardiology', 'Neurology', 'Trauma Center', 'Orthopedics', 'Emergency Medicine'],
    availableBeds: 20,
    icuBeds: 6,
    waitTime: 12,
    address: 'Airport Road, Hebbal, Bengaluru, Karnataka 560024',
    phone: '080-2502-4444',
    lat: 13.0477,
    lng: 77.5936,
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560024',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH', 'JCI']
  },
  {
    id: 12,
    name: 'Apollo Hospital, Bannerghatta',
    type: 'Corporate',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Emergency Medicine'],
    availableBeds: 18,
    icuBeds: 5,
    waitTime: 10,
    address: '154/11, Opposite IIM-B, Bannerghatta Road, Bengaluru, Karnataka 560076',
    phone: '080-2630-4050',
    lat: 12.8438,
    lng: 77.6229,
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560076',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH', 'JCI']
  },
  // Chennai - Government Hospitals
  {
    id: 13,
    name: 'Rajiv Gandhi Government General Hospital',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Trauma Center', 'Cardiology', 'Neurology', 'General Surgery'],
    availableBeds: 35,
    icuBeds: 12,
    waitTime: 20,
    address: 'Park Town, Chennai, Tamil Nadu 600003',
    phone: '044-2819-3000',
    lat: 13.0878,
    lng: 80.2785,
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600003',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH']
  },
  {
    id: 14,
    name: 'Government Stanley Medical College Hospital',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'General Surgery'],
    availableBeds: 25,
    icuBeds: 8,
    waitTime: 18,
    address: 'Old Jail Road, Royapuram, Chennai, Tamil Nadu 600001',
    phone: '044-2528-2403',
    lat: 13.1067,
    lng: 80.2897,
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH']
  },
  // Chennai - Private Hospitals
  {
    id: 15,
    name: 'Apollo Hospital, Greams Road',
    type: 'Corporate',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency Medicine', 'Transplant Surgery'],
    availableBeds: 22,
    icuBeds: 7,
    waitTime: 8,
    address: '21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006',
    phone: '044-2829-0200',
    lat: 13.0594,
    lng: 80.2484,
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600006',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH', 'JCI']
  },
  {
    id: 16,
    name: 'Fortis Malar Hospital',
    type: 'Corporate',
    specialties: ['Cardiac Surgery', 'Neurosurgery', 'Emergency Medicine', 'Orthopedics'],
    availableBeds: 14,
    icuBeds: 4,
    waitTime: 10,
    address: '52, 1st Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020',
    phone: '044-4289-2222',
    lat: 13.0067,
    lng: 80.2206,
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600020',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH', 'JCI']
  },
  // Kolkata - Government Hospitals
  {
    id: 17,
    name: 'Medical College and Hospital, Kolkata',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Trauma Center', 'Cardiology', 'Neurology', 'General Surgery'],
    availableBeds: 30,
    icuBeds: 10,
    waitTime: 25,
    address: '88, College Street, Kolkata, West Bengal 700073',
    phone: '033-2241-1211',
    lat: 22.5833,
    lng: 88.3667,
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700073',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH']
  },
  {
    id: 18,
    name: 'NRS Medical College and Hospital',
    type: 'Government',
    specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'General Surgery'],
    availableBeds: 22,
    icuBeds: 7,
    waitTime: 20,
    address: '138, A J C Bose Road, Kolkata, West Bengal 700014',
    phone: '033-2265-1930',
    lat: 22.5448,
    lng: 88.3426,
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700014',
    emergencyServices: true,
    traumaCenter: true,
    accreditation: ['NABH']
  },
  // Kolkata - Private Hospitals
  {
    id: 19,
    name: 'AMRI Hospital, Salt Lake',
    type: 'Corporate',
    specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology'],
    availableBeds: 18,
    icuBeds: 6,
    waitTime: 12,
    address: 'JC - 16 & 17, Sector III, Salt Lake City, Kolkata, West Bengal 700098',
    phone: '033-6606-3800',
    lat: 22.5958,
    lng: 88.4497,
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700098',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH', 'JCI']
  },
  {
    id: 20,
    name: 'Apollo Gleneagles Hospital',
    type: 'Corporate',
    specialties: ['Cardiac Surgery', 'Neurosurgery', 'Oncology', 'Emergency Medicine'],
    availableBeds: 20,
    icuBeds: 6,
    waitTime: 10,
    address: '58, Canal Circular Road, Kadapara, Phool Bagan, Kolkata, West Bengal 700054',
    phone: '033-2320-2122',
    lat: 22.5448,
    lng: 88.3426,
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700054',
    emergencyServices: true,
    traumaCenter: false,
    accreditation: ['NABH', 'JCI']
  }
];

export const calculateDistanceAndETA = (hospitals: ComprehensiveHospital[], userLocation: { lat: number; lng: number }) => {
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    return hospitals;
  }

  return hospitals.map(hospital => {
    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (hospital.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (hospital.lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(hospital.lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = (R * c).toFixed(1);

    // Estimate ETA (average 40 km/h in city traffic)
    const eta = Math.round((parseFloat(distance) / 40) * 60); // Convert to minutes

    return {
      ...hospital,
      distance: parseFloat(distance),
      eta: eta,
      matchScore: 0 // Will be calculated by matching algorithm
    };
  });
};
