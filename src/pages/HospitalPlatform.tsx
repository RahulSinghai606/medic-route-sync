
import React, { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import HospitalLayout from '@/components/Layout/HospitalLayout';
import { useAuth } from '@/contexts/AuthContext';

// Import refactored components
import HospitalDashboard from '@/components/HospitalPlatform/HospitalDashboard';
import CasesDashboard from '@/components/HospitalPlatform/CasesDashboard';
import CaseHandoffs from '@/components/HospitalPlatform/CaseHandoffs';
import Departments from '@/components/HospitalPlatform/Departments';
import HospitalOperations from '@/pages/HospitalOperations';
import DisasterMode from '@/components/DisasterManagement/DisasterMode';

const HospitalPlatform: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // Check if the user is logged in as a hospital
  useEffect(() => {
    if (profile && profile.role !== 'hospital') {
      console.log("User is not a hospital staff, redirecting to home");
      navigate('/');
    } else {
      console.log("User confirmed as hospital staff");
    }
  }, [profile, navigate]);

  return (
    <HospitalLayout>
      <Routes>
        <Route index element={<HospitalDashboard />} />
        <Route path="cases" element={<CasesDashboard />} />
        <Route path="handoffs" element={<CaseHandoffs />} />
        <Route path="departments" element={<Departments />} />
        <Route path="operations" element={<HospitalOperations />} />
        <Route path="disaster" element={<DisasterMode />} />
      </Routes>
    </HospitalLayout>
  );
};

export default HospitalPlatform;
