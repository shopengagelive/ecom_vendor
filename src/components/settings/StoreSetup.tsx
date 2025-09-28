import React, { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Upload } from "lucide-react";
import { StoreSettings } from "./types";
import Loader from "../shared/loader";
import { checkUserNameAvailbility, uploadImage } from "../../services/api";

interface StoreSetupProps {
  storeSettings: StoreSettings;
  onStoreSettingsChange: (settings: StoreSettings) => void;
  onSave: (e: React.FormEvent) => void;
  loading: boolean;
  apiError: string;
  creatingStore: boolean;
}

export default function StoreSetup({
  storeSettings,
  onStoreSettingsChange,
  onSave,
  loading,
  apiError,
  creatingStore
}: StoreSetupProps) {
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Debounce username availability check
  useEffect(() => {
    const checkUsername = async () => {
      if (!storeSettings.storeUsername) {
        setUsernameAvailable(null);
        setUsernameError(null);
        return;
      }
      setUsernameChecking(true);
      setUsernameError(null);
      try {
        const response = await checkUserNameAvailbility(storeSettings.storeUsername);
        console.log(response)
        setUsernameAvailable(response.success && response.data?.available);
      } catch (err: any) {
        setUsernameAvailable(false);
        setUsernameError(err.message || "Failed to check username availability");
      } finally {
        setUsernameChecking(false);
      }
    };

    const debounce = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounce);
  }, [storeSettings.storeUsername]);

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageUploading(true);
      setError(null);
      try {
        const imageUrl = await uploadImage(file);
        onStoreSettingsChange({
          ...storeSettings,
          coverImage: imageUrl,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to upload cover image');
      } finally {
        setCoverImageUploading(false);
      }
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageUploading(true);
      setError(null);
      try {
        const imageUrl = await uploadImage(file);
        onStoreSettingsChange({
          ...storeSettings,
          profileImage: imageUrl,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to upload profile image');
      } finally {
        setProfileImageUploading(false);
      }
    }
  };

  return (
    <form onSubmit={onSave}>
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Store Setup</h3>
          <p className="text-sm text-gray-600">
            Configure your store details and policies.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Cover + Profile */}
            <div className="relative">
              {/* Cover Image */}
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                {storeSettings.coverImage ? (
                  <img
                    src={storeSettings.coverImage}
                    alt="Store Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Upload Cover Image</p>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    id="cover-image"
                    disabled={coverImageUploading}
                  />
                  <label
                    htmlFor="cover-image"
                    className={`cursor-pointer bg-white bg-opacity-90 text-gray-700 px-4 py-2 rounded-lg hover:bg-opacity-100 shadow-md flex items-center gap-2 ${coverImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {coverImageUploading ? (
                      <span>Uploading...</span>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Cover
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Profile Image */}
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  {storeSettings.profileImage ? (
                    <img
                      src={storeSettings.profileImage}
                      alt="Store Profile"
                      className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 border-4 border-white shadow-lg rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  <div className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                      id="profile-image"
                      disabled={profileImageUploading}
                    />
                    <label
                      htmlFor="profile-image"
                      className={`cursor-pointer bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-md flex items-center justify-center ${profileImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {profileImageUploading ? (
                        <span className="text-sm">Uploading...</span>
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer for overlap */}
            <div className="h-20"></div>

            {/* Store Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) =>
                  onStoreSettingsChange({
                    ...storeSettings,
                    storeName: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            {/* Store Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Store Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={storeSettings.storeUsername}
                  onChange={(e) =>
                    onStoreSettingsChange({
                      ...storeSettings,
                      storeUsername: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    usernameChecking
                      ? 'border-gray-300'
                      : usernameAvailable === true
                      ? 'border-green-500'
                      : usernameAvailable === false
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  disabled={creatingStore}
                />
                {usernameChecking && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    Checking...
                  </span>
                )}
                {!usernameChecking && usernameAvailable === true && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-green-500">
                    Available
                  </span>
                )}
                {!usernameChecking && usernameAvailable === false && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-red-500">
                    Taken
                  </span>
                )}
              </div>
              {usernameError && (
                <p className="text-sm text-red-600 mt-1">{usernameError}</p>
              )}
            </div>

            {/* Return Policy */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Return Policy
              </label>
              <textarea
                value={storeSettings.returnPolicy}
                onChange={(e) =>
                  onStoreSettingsChange({
                    ...storeSettings,
                    returnPolicy: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div> */}

            {/* Shipping Days */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Shipping Days Count
              </label>
              <input
                type="number"
                min={1}
                value={storeSettings.shippingDays}
                onChange={(e) =>
                  onStoreSettingsChange({
                    ...storeSettings,
                    shippingDays: parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Store Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={storeSettings.pinCode}
                    onChange={(e) =>
                      onStoreSettingsChange({
                        ...storeSettings,
                        pinCode: e.target.value,
                      })
                    }
                    placeholder="Enter PIN code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={storeSettings.city}
                    onChange={(e) =>
                      onStoreSettingsChange({
                        ...storeSettings,
                        city: e.target.value,
                      })
                    }
                    placeholder="Enter city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={storeSettings.state}
                    onChange={(e) =>
                      onStoreSettingsChange({
                        ...storeSettings,
                        state: e.target.value,
                      })
                    }
                    placeholder="Enter state"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Country
                  </label>
                  <select
                    value={storeSettings.country}
                    onChange={(e) =>
                      onStoreSettingsChange({
                        ...storeSettings,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={storeSettings.street}
                    onChange={(e) =>
                      onStoreSettingsChange({
                        ...storeSettings,
                        street: e.target.value,
                      })
                    }
                    placeholder="Enter street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>

                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    value={storeSettings.address}
                    onChange={(e) =>
                      onStoreSettingsChange({
                        ...storeSettings,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter full address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div> */}
              </div>
            </div>

            {apiError && (
              <div className="bg-red-100 p-3 rounded-lg text-red-700">{apiError}</div>
            )}
            <Button type="submit" disabled={creatingStore || usernameAvailable === false}>
              {creatingStore ? 'Saving...' : 'Save Store Settings'}
            </Button>
          </div>
        )}
      </Card>
    </form>
  );
}