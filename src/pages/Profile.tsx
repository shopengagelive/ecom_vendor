import React from 'react';
import ProfileForm from '../components/profile/ProfileForm';
import PasswordForm from '../components/profile/PasswordForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockVendorProfile } from '../data/mockData';
import { VendorProfile } from '../types';

export default function Profile() {
  const [profile, setProfile] = useLocalStorage('vendorProfile', mockVendorProfile);

  const handleSaveProfile = (updatedProfile: VendorProfile) => {
    setProfile(updatedProfile);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600">Manage your account settings and store information.</p>
      </div>

      <ProfileForm profile={profile} onSave={handleSaveProfile} />
      
      <PasswordForm />
    </div>
  );
}