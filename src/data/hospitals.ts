
// Real hospitals in Jaipur with accurate location data
export const jaipurHospitals = [
  {
    id: 1,
    name: 'Sawai Man Singh Hospital',
    distance: 0, // Will be calculated dynamically
    eta: 0, // Will be calculated dynamically
    specialties: ['General Medicine', 'Cardiology', 'Neurology', 'Trauma Center'],
    availableBeds: 12,
    waitTime: 15,
    address: 'JLN Marg, Jaipur, Rajasthan 302004',
    phone: '0141-2518313',
    lat: 26.9050,
    lng: 75.8059,
    matchScore: 0, // Will be calculated by algorithm
  },
  {
    id: 2,
    name: 'Fortis Escorts Hospital',
    distance: 0,
    eta: 0,
    specialties: ['Cardiac Care', 'Orthopedics', 'Neurosciences', 'Oncology'],
    availableBeds: 8,
    waitTime: 10,
    address: 'Malviya Nagar, Jaipur, Rajasthan 302017',
    phone: '0141-4097000',
    lat: 26.8588,
    lng: 75.8077,
    matchScore: 0,
  },
  {
    id: 3,
    name: 'Narayana Multispeciality Hospital',
    distance: 0,
    eta: 0,
    specialties: ['Cardiology', 'Gastroenterology', 'Neurology', 'Orthopedics'],
    availableBeds: 5,
    waitTime: 20,
    address: 'Kumbha Marg, Sector 28, Pratap Nagar, Jaipur, Rajasthan 302033',
    phone: '0141-4300000',
    lat: 26.8466,
    lng: 75.7873,
    matchScore: 0,
  },
  {
    id: 4,
    name: 'Rukmani Birla Hospital',
    distance: 0,
    eta: 0,
    specialties: ['Pediatrics', 'Obstetrics & Gynecology', 'General Surgery', 'ENT'],
    availableBeds: 7,
    waitTime: 12,
    address: 'Gopalpura Bypass Road, Jaipur, Rajasthan 302018',
    phone: '0141-4222333',
    lat: 26.8738,
    lng: 75.7675,
    matchScore: 0,
  },
  {
    id: 5,
    name: 'Mahatma Gandhi Hospital',
    distance: 0,
    eta: 0,
    specialties: ['Trauma Center', 'General Medicine', 'Orthopedics', 'Nephrology'],
    availableBeds: 10,
    waitTime: 18,
    address: 'RIICO Industrial Area, Sitapura, Jaipur, Rajasthan 302022',
    phone: '0141-2770798',
    lat: 26.7724,
    lng: 75.8408,
    matchScore: 0,
  }
];

export const calculateDistanceAndETA = (
  hospitals,
  userLocation
) => {
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

    // Estimate ETA (average 50 km/h in city traffic)
    const eta = Math.round((parseFloat(distance) / 50) * 60); // Convert to minutes

    return {
      ...hospital,
      distance: parseFloat(distance),
      eta: eta,
    };
  });
};
