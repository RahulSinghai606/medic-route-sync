
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

// Hospital matching algorithm using the Adaptive Medical Priority Parameters (AMPP)
export const calculateHospitalMatch = (
  hospital: any,
  specialties: string[],
  isCritical: boolean
) => {
  // Parameters for the AMPP algorithm - these could be adjusted based on regional or facility-specific needs
  const params = {
    // Base weights for the AMPP algorithm
    criticalSpecialtyWeight: 0.7,
    criticalProximityWeight: 0.2,
    criticalCapacityWeight: 0.1,
    
    standardSpecialtyWeight: 0.5,
    standardProximityWeight: 0.4,
    standardCapacityWeight: 0.1,
    
    noSpecialtyProximityWeight: 0.8,
    noSpecialtyCapacityWeight: 0.2,
    
    // Distance thresholds (in miles)
    maxProximityScore: 40, // Maximum distance to consider for scoring
    
    // Capacity factors
    waitTimeImpact: 10, // Impact of wait time on capacity score
    
    // Match bonuses
    criticalMatchBonus: 10, // Extra points for critical cases meeting specialty needs
    perfectMatchThreshold: 90 // Threshold for "perfect" match to be promoted
  };

  if (!specialties || specialties.length === 0) {
    // If no specialties, prioritize proximity
    const proximityScore = Math.max(0, params.maxProximityScore - (hospital.distance * 4));
    const capacityScore = Math.min(10, hospital.availableBeds - (hospital.waitTime / params.waitTimeImpact));
    
    return {
      matchScore: Math.round((proximityScore * params.noSpecialtyProximityWeight) + 
                            (capacityScore * params.noSpecialtyCapacityWeight)),
      matchReason: 'proximity',
      promoted: false
    };
  }

  // Check for specialty matches
  const matchedSpecialties = hospital.specialties.filter((spec: string) => 
    specialties.some(tag => spec.toLowerCase().includes(tag.toLowerCase()))
  );

  const hasSpecialtyMatch = matchedSpecialties.length > 0;
  
  // Calculate base scores
  const proximityScore = Math.max(0, params.maxProximityScore - (hospital.distance * 4));
  const specialtyScore = hasSpecialtyMatch ? 50 * (matchedSpecialties.length / specialties.length) : 0;
  const capacityScore = Math.min(10, hospital.availableBeds - (hospital.waitTime / params.waitTimeImpact));
  
  // Apply AMPP algorithm weights based on case criticality and specialty match
  let totalScore = 0;
  let matchReason = 'balanced';
  let promoted = false;
  
  if (isCritical && hasSpecialtyMatch) {
    // Critical case with specialty match - heavily prioritize specialty
    totalScore = (specialtyScore * params.criticalSpecialtyWeight) + 
                (proximityScore * params.criticalProximityWeight) + 
                (capacityScore * params.criticalCapacityWeight) + 
                params.criticalMatchBonus;
    matchReason = 'critical specialty need';
    promoted = true;
  } else if (hasSpecialtyMatch) {
    // Non-critical with specialty match - balance specialty and proximity
    totalScore = (specialtyScore * params.standardSpecialtyWeight) + 
                (proximityScore * params.standardProximityWeight) + 
                (capacityScore * params.standardCapacityWeight);
    matchReason = 'specialty match';
    promoted = totalScore >= params.perfectMatchThreshold;
  } else {
    // No specialty match - prioritize proximity
    totalScore = (proximityScore * params.noSpecialtyProximityWeight) + 
                (capacityScore * params.noSpecialtyCapacityWeight);
    matchReason = 'proximity';
  }
  
  return {
    matchScore: Math.round(totalScore),
    matchReason,
    promoted,
    matchedSpecialties: hasSpecialtyMatch ? matchedSpecialties : []
  };
};
