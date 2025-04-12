
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

// Hospital matching algorithm that prioritizes specialty match for critical cases
export const calculateHospitalMatch = (
  hospital: any,
  specialties: string[],
  isCritical: boolean
) => {
  if (!specialties || specialties.length === 0) {
    // If no specialties, prioritize proximity
    return {
      matchScore: Math.max(0, 100 - hospital.distance * 10),
      matchReason: 'proximity',
      promoted: false
    };
  }

  // Check for specialty matches
  const matchedSpecialties = hospital.specialties.filter((spec: string) => 
    specialties.some(tag => spec.toLowerCase().includes(tag.toLowerCase()))
  );

  const hasSpecialtyMatch = matchedSpecialties.length > 0;
  
  // Base scores
  let proximityScore = Math.max(0, 40 - (hospital.distance * 4)); // 0-40 pts
  let specialtyScore = hasSpecialtyMatch ? 50 : 0; // 0 or 50 pts
  let capacityScore = Math.min(10, hospital.availableBeds - (hospital.waitTime / 10)); // 0-10 pts
  
  // Adjust weights based on case criticality
  let totalScore = 0;
  let matchReason = 'balanced';
  let promoted = false;
  
  if (isCritical && hasSpecialtyMatch) {
    // Critical case with specialty match - heavily prioritize specialty
    totalScore = (specialtyScore * 0.7) + (proximityScore * 0.2) + (capacityScore * 0.1);
    matchReason = 'critical specialty need';
    promoted = true;
  } else if (hasSpecialtyMatch) {
    // Non-critical with specialty match - balance specialty and proximity
    totalScore = (specialtyScore * 0.5) + (proximityScore * 0.4) + (capacityScore * 0.1);
    matchReason = 'specialty match';
    promoted = true;
  } else {
    // No specialty match - prioritize proximity
    totalScore = (proximityScore * 0.8) + (capacityScore * 0.2);
    matchReason = 'proximity';
  }
  
  return {
    matchScore: Math.round(totalScore),
    matchReason,
    promoted,
    matchedSpecialties: hasSpecialtyMatch ? matchedSpecialties : []
  };
};
