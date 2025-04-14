
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
  // Dynamic weights based on patient condition and context
  const getDynamicWeights = (isCritical: boolean, hasSpecialtyMatch: boolean) => {
    // Base configuration
    const baseWeights = {
      // Default weights for critical cases with specialty match
      criticalWithSpecialty: {
        specialtyWeight: 0.7,
        proximityWeight: 0.2,
        capacityWeight: 0.1,
        matchBonus: 15,
      },
      // Default weights for critical cases without specialty match
      criticalNoSpecialty: {
        proximityWeight: 0.75,
        capacityWeight: 0.25,
      },
      // Default weights for standard cases with specialty match
      standardWithSpecialty: {
        specialtyWeight: 0.5,
        proximityWeight: 0.4,
        capacityWeight: 0.1,
        matchBonus: 5,
      },
      // Default weights for standard cases without specialty match
      standardNoSpecialty: {
        proximityWeight: 0.8,
        capacityWeight: 0.2,
      },
      // Common thresholds
      maxProximityScore: 40,
      waitTimeImpact: 10,
      perfectMatchThreshold: 90,
    };

    // Adjust weights based on the specific case
    if (isCritical) {
      return hasSpecialtyMatch 
        ? baseWeights.criticalWithSpecialty 
        : baseWeights.criticalNoSpecialty;
    } else {
      return hasSpecialtyMatch 
        ? baseWeights.standardWithSpecialty 
        : baseWeights.standardNoSpecialty;
    }
  };

  // Calculate match for hospitals with no specialty requirements
  if (!specialties || specialties.length === 0) {
    const weights = getDynamicWeights(isCritical, false);
    const proximityScore = Math.max(0, weights.maxProximityScore - (hospital.distance * 4));
    const capacityScore = Math.min(10, hospital.availableBeds - (hospital.waitTime / weights.waitTimeImpact));
    
    return {
      matchScore: Math.round((proximityScore * weights.proximityWeight) + 
                           (capacityScore * weights.capacityWeight)),
      matchReason: isCritical ? 'urgent proximity' : 'proximity',
      promoted: false
    };
  }

  // Check for specialty matches
  const matchedSpecialties = hospital.specialties.filter((spec: string) => 
    specialties.some(tag => spec.toLowerCase().includes(tag.toLowerCase()))
  );

  const hasSpecialtyMatch = matchedSpecialties.length > 0;
  
  // Get the dynamic weights for this case
  const weights = getDynamicWeights(isCritical, hasSpecialtyMatch);
  
  // Calculate base scores
  const proximityScore = Math.max(0, weights.maxProximityScore - (hospital.distance * 4));
  const specialtyScore = hasSpecialtyMatch ? 50 * (matchedSpecialties.length / specialties.length) : 0;
  const capacityScore = Math.min(10, hospital.availableBeds - (hospital.waitTime / weights.waitTimeImpact));
  
  // Apply AMPP algorithm weights based on case criticality and specialty match
  let totalScore = 0;
  let matchReason = 'balanced';
  let promoted = false;
  
  if (isCritical && hasSpecialtyMatch) {
    // Critical case with specialty match - heavily prioritize specialty
    totalScore = (specialtyScore * weights.specialtyWeight) + 
                (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight) + 
                weights.matchBonus;
    matchReason = 'critical specialty need';
    promoted = true;
  } else if (hasSpecialtyMatch) {
    // Non-critical with specialty match - balance specialty and proximity
    totalScore = (specialtyScore * weights.specialtyWeight) + 
                (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight);
    matchReason = 'specialty match';
    promoted = totalScore >= weights.perfectMatchThreshold;
  } else if (isCritical) {
    // Critical without specialty match - prioritize proximity but with urgency
    totalScore = (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight);
    matchReason = 'urgent proximity';
  } else {
    // No specialty match - prioritize proximity
    totalScore = (proximityScore * weights.proximityWeight) + 
                (capacityScore * weights.capacityWeight);
    matchReason = 'proximity';
  }
  
  return {
    matchScore: Math.round(totalScore),
    matchReason,
    promoted,
    matchedSpecialties: hasSpecialtyMatch ? matchedSpecialties : []
  };
};
