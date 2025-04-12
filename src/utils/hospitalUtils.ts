
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
