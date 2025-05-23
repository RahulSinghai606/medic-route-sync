
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

// Enhanced Hospital matching algorithm using the Adaptive Medical Priority Parameters (AMPP)
// This algorithm provides more realistic match scores for better hospital recommendations
export const calculateHospitalMatch = (
  hospital: any,
  specialties: string[],
  isCritical: boolean,
  userLocation?: Location
) => {
  // Enhanced dynamic weights for better scoring
  const getDynamicWeights = (isCritical: boolean, hasSpecialtyMatch: boolean): WeightConfiguration => {
    const commonThresholds = {
      maxProximityScore: 50, // Increased base proximity score
      waitTimeImpact: 5, // Reduced wait time penalty
      perfectMatchThreshold: 85, // Lowered threshold for promotion
    };
    
    if (isCritical && hasSpecialtyMatch) {
      return {
        specialtyWeight: 0.6,
        proximityWeight: 0.25,
        capacityWeight: 0.15,
        matchBonus: 25, // Increased bonus
        ...commonThresholds
      };
    } else if (isCritical) {
      return {
        proximityWeight: 0.7,
        capacityWeight: 0.3,
        ...commonThresholds
      };
    } else if (hasSpecialtyMatch) {
      return {
        specialtyWeight: 0.5,
        proximityWeight: 0.35,
        capacityWeight: 0.15,
        matchBonus: 15, // Increased bonus
        ...commonThresholds
      };
    } else {
      return {
        proximityWeight: 0.75,
        capacityWeight: 0.25,
        ...commonThresholds
      };
    }
  };

  // Enhanced proximity calculation with better scoring
  const calculateProximityScore = (userLocation?: Location) => {
    let distance;
    
    if (!userLocation) {
      distance = hospital.distance || 5; // Default to 5km if no location
    } else {
      // Calculate actual distance
      const R = 6371; // Earth's radius in km
      const dLat = (hospital.lat - userLocation.lat) * Math.PI / 180;
      const dLon = (hospital.lng - userLocation.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(hospital.lat * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance = R * c;
    }
    
    // Enhanced proximity scoring - closer hospitals get much higher scores
    if (distance <= 2) return 50;
    if (distance <= 5) return 45;
    if (distance <= 10) return 35;
    if (distance <= 15) return 25;
    if (distance <= 20) return 15;
    return Math.max(5, 10 - distance); // Minimum score of 5
  };

  // Calculate match for hospitals with no specialty requirements
  if (!specialties || specialties.length === 0) {
    const weights = getDynamicWeights(isCritical, false);
    const proximityScore = calculateProximityScore(userLocation);
    const capacityScore = Math.min(20, (hospital.availableBeds * 2) - (hospital.waitTime / weights.waitTimeImpact));
    
    // Enhanced base scoring for better results
    const baseScore = 60; // Higher base score
    const totalScore = baseScore + (proximityScore * weights.proximityWeight) + (capacityScore * weights.capacityWeight);
    
    return {
      matchScore: Math.min(95, Math.round(totalScore)),
      matchReason: isCritical ? 'urgent proximity' : 'proximity',
      promoted: false,
      matchedSpecialties: [],
      distance: userLocation ? calculateProximityScore(userLocation) / 10 : hospital.distance || 5
    };
  }

  // Enhanced specialty matching with flexible matching
  const matchedSpecialties = hospital.specialties.filter((spec: string) => 
    specialties.some(tag => 
      spec.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(spec.toLowerCase()) ||
      // Additional matching logic for common medical terms
      (tag.toLowerCase().includes('heart') && spec.toLowerCase().includes('cardio')) ||
      (tag.toLowerCase().includes('brain') && spec.toLowerCase().includes('neuro')) ||
      (tag.toLowerCase().includes('bone') && spec.toLowerCase().includes('ortho')) ||
      (tag.toLowerCase().includes('emergency') && spec.toLowerCase().includes('trauma'))
    )
  );

  const hasSpecialtyMatch = matchedSpecialties.length > 0;
  const weights = getDynamicWeights(isCritical, hasSpecialtyMatch);
  
  // Enhanced scoring calculations
  const proximityScore = calculateProximityScore(userLocation);
  const specialtyScore = hasSpecialtyMatch ? 
    Math.min(60, 40 + (matchedSpecialties.length * 10)) : 0; // Higher specialty scores
  const capacityScore = Math.min(25, (hospital.availableBeds * 2.5) - (hospital.waitTime / weights.waitTimeImpact));
  
  // Enhanced hospital type bonus
  const hospitalTypeBonus = hospital.type === 'Government' ? 5 : 
                           hospital.type === 'Corporate' ? 3 : 0;
  
  // Emergency services bonus
  const emergencyBonus = hospital.emergencyServices ? 5 : 0;
  const traumaBonus = hospital.traumaCenter ? 10 : 0;
  
  let totalScore = 0;
  let matchReason = 'balanced';
  let promoted = false;

  // Enhanced scoring logic with higher base scores
  if (isCritical && hasSpecialtyMatch) {
    totalScore = 50 + // Higher base score
                (specialtyScore * (weights.specialtyWeight || 0)) + 
                (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight) + 
                (weights.matchBonus || 0) +
                hospitalTypeBonus + emergencyBonus + traumaBonus;
    matchReason = 'critical specialty match';
    promoted = true;
  } else if (hasSpecialtyMatch) {
    totalScore = 45 + // Higher base score
                (specialtyScore * (weights.specialtyWeight || 0)) + 
                (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight) +
                (weights.matchBonus || 0) +
                hospitalTypeBonus + emergencyBonus;
    matchReason = 'specialty match';
    promoted = totalScore >= (weights.perfectMatchThreshold || 85);
  } else if (isCritical) {
    totalScore = 40 + // Higher base score
                (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight) +
                hospitalTypeBonus + emergencyBonus + traumaBonus;
    matchReason = 'urgent proximity';
  } else {
    totalScore = 35 + // Higher base score
                (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight) +
                hospitalTypeBonus + emergencyBonus;
    matchReason = 'proximity and capacity';
  }
  
  // Ensure realistic score ranges (60-98%)
  const finalScore = Math.max(60, Math.min(98, Math.round(totalScore)));
  
  return {
    matchScore: finalScore,
    matchReason,
    promoted,
    matchedSpecialties: hasSpecialtyMatch ? matchedSpecialties : [],
    distance: userLocation ? calculateProximityScore(userLocation) / 10 : hospital.distance || 5
  };
};
