
import { useNavigate } from 'react-router-dom';

// Function to navigate to hospitals page with specialty tags
export const navigateToHospitalsWithSpecialties = (
  navigate: ReturnType<typeof useNavigate>,
  specialties: string[],
  isCritical: boolean = false,
  assessment: string = ''
) => {
  const specialtiesParam = specialties.join(',');
  navigate(`/hospitals?specialties=${specialtiesParam}&critical=${isCritical}&assessment=${encodeURIComponent(assessment)}`);
};

// Define weight configuration interface
interface WeightConfiguration {
  specialtyWeight?: number;
  proximityWeight: number;
  capacityWeight: number;
  matchBonus?: number;
  maxProximityScore: number;
  waitTimeImpact: number;
  perfectMatchThreshold?: number;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// Hospital matching algorithm using the Adaptive Medical Priority Parameters (AMPP)
export const calculateHospitalMatch = (
  hospital: any,
  specialties: string[],
  isCritical: boolean,
  userLocation?: Location
) => {
  // Dynamic weights based on patient condition and context
  const getDynamicWeights = (isCritical: boolean, hasSpecialtyMatch: boolean): WeightConfiguration => {
    // Common thresholds that will be applied to all configurations
    const commonThresholds = {
      maxProximityScore: 40,
      waitTimeImpact: 10,
      perfectMatchThreshold: 90,
    };
    
    // Base configuration for different scenarios
    if (isCritical && hasSpecialtyMatch) {
      return {
        specialtyWeight: 0.7,
        proximityWeight: 0.2,
        capacityWeight: 0.1,
        matchBonus: 15,
        ...commonThresholds
      };
    } else if (isCritical) {
      return {
        proximityWeight: 0.75,
        capacityWeight: 0.25,
        ...commonThresholds
      };
    } else if (hasSpecialtyMatch) {
      return {
        specialtyWeight: 0.5,
        proximityWeight: 0.4,
        capacityWeight: 0.1,
        matchBonus: 5,
        ...commonThresholds
      };
    } else {
      return {
        proximityWeight: 0.8,
        capacityWeight: 0.2,
        ...commonThresholds
      };
    }
  };

  // Calculate proximity score if user location is available
  const calculateProximityScore = (userLocation?: Location) => {
    if (!userLocation) return hospital.distance * 4; // Use default distance if no user location
    
    // Calculate actual distance between user and hospital
    const R = 6371; // Earth's radius in km
    const dLat = (hospital.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (hospital.lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(hospital.lat * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const calculatedDistance = R * c;
    
    return calculatedDistance * 4;
  };

  // Calculate match for hospitals with no specialty requirements
  if (!specialties || specialties.length === 0) {
    const weights = getDynamicWeights(isCritical, false);
    const proximityScore = Math.max(0, weights.maxProximityScore - calculateProximityScore(userLocation));
    const capacityScore = Math.min(10, hospital.availableBeds - (hospital.waitTime / weights.waitTimeImpact));
    
    return {
      matchScore: Math.round((proximityScore * weights.proximityWeight) + 
                           (capacityScore * weights.capacityWeight)),
      matchReason: isCritical ? 'urgent proximity' : 'proximity',
      promoted: false,
      matchedSpecialties: [],
      distance: calculateProximityScore(userLocation) / 4 // Convert back to kilometers
    };
  }

  // Check for specialty matches
  const matchedSpecialties = hospital.specialties.filter((spec: string) => 
    specialties.some(tag => spec.toLowerCase().includes(tag.toLowerCase()))
  );

  const hasSpecialtyMatch = matchedSpecialties.length > 0;
  const weights = getDynamicWeights(isCritical, hasSpecialtyMatch);
  
  // Calculate base scores using actual location if available
  const proximityScore = Math.max(0, weights.maxProximityScore - calculateProximityScore(userLocation));
  const specialtyScore = hasSpecialtyMatch ? 50 * (matchedSpecialties.length / specialties.length) : 0;
  const capacityScore = Math.min(10, hospital.availableBeds - (hospital.waitTime / weights.waitTimeImpact));
  
  // Apply AMPP algorithm weights
  let totalScore = 0;
  let matchReason = 'balanced';
  let promoted = false;

  if (isCritical && hasSpecialtyMatch) {
    totalScore = (specialtyScore * (weights.specialtyWeight || 0)) + 
                (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight) + 
                (weights.matchBonus || 0);
    matchReason = 'critical specialty need';
    promoted = true;
  } else if (hasSpecialtyMatch) {
    totalScore = (specialtyScore * (weights.specialtyWeight || 0)) + 
                (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight);
    matchReason = 'specialty match';
    promoted = totalScore >= (weights.perfectMatchThreshold || 90);
  } else if (isCritical) {
    totalScore = (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight);
    matchReason = 'urgent proximity';
  } else {
    totalScore = (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight);
    matchReason = 'proximity';
  }
  
  return {
    matchScore: Math.round(totalScore),
    matchReason,
    promoted,
    matchedSpecialties: hasSpecialtyMatch ? matchedSpecialties : [],
    distance: calculateProximityScore(userLocation) / 4 // Convert back to kilometers
  };
};
