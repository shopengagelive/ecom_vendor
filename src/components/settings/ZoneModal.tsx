import React, { useRef, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { CountryStateMap } from "./types";

interface ZoneModalProps {
  isOpen: boolean;
  savingZone: boolean;
  onClose: () => void;
  editingZone: any | null;
  zoneFormData: {
    zoneName: string;
    country: string;
    state: string[];
    restrictedPin: string[];
  };
  onZoneFormDataChange: (data: any) => void;
  onSave: () => void;
  countryStateMap: CountryStateMap;
  stateDropdownOpen: boolean;
  onStateDropdownToggle: () => void;
  onStateDropdownClose: () => void;
}

export default function ZoneModal({
  isOpen,
  onClose,
  savingZone,
  editingZone,
  zoneFormData,
  onZoneFormDataChange,
  onSave,
  countryStateMap,
  stateDropdownOpen,
  onStateDropdownToggle,
  onStateDropdownClose,
}: ZoneModalProps) {
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stateDropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target as Node)
      ) {
        onStateDropdownClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [stateDropdownOpen, onStateDropdownClose]);

  const handlePinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pins = e.target.value
      .split(",")
      .map((pin) => pin.trim())
      .filter((pin) => pin);
    onZoneFormDataChange({ ...zoneFormData, restrictedPin: pins });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingZone ? "Edit Zone" : "Add Zone"}
      size="lg"
    >
      <div className="space-y-6">
        {/* Zone Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Zone Name
          </label>
          <input
            type="text"
            value={zoneFormData.zoneName}
            onChange={(e) =>
              onZoneFormDataChange({ ...zoneFormData, zoneName: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Enter zone name"
          />
        </div>

        {/* Country Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Country
          </label>
          <select
            value={zoneFormData.country}
            onChange={(e) => {
              onZoneFormDataChange({
                ...zoneFormData,
                country: e.target.value,
                state: [],
                restrictedPin: [],
              });
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="India">India</option>
            <option value="Pakistan">Pakistan</option>
          </select>
        </div>

        {/* State Multi-Select */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            States
          </label>
          <div className="relative" ref={stateDropdownRef}>
            {/* Selected Chips */}
            <div className="flex flex-wrap gap-2 mb-3 p-3 border border-gray-200 rounded-lg min-h-[60px] bg-gray-50">
              {zoneFormData.state.map((state: string) => (
                <span
                  key={state}
                  className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium"
                >
                  {state}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                    onClick={() =>
                      onZoneFormDataChange({
                        ...zoneFormData,
                        state: zoneFormData.state.filter((s) => s !== state),
                      })
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
              {zoneFormData.state.length === 0 && (
                <span className="text-gray-400 text-sm">
                  No states selected
                </span>
              )}
            </div>

            {/* Dropdown */}
            <button
              type="button"
              onClick={onStateDropdownToggle}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-left flex justify-between items-center"
            >
              <span className="text-gray-700">
                {zoneFormData.state.length > 0
                  ? `${zoneFormData.state.length} state(s) selected`
                  : "Select states"}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${stateDropdownOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {stateDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {countryStateMap[zoneFormData.country]?.map((state) => (
                  <label
                    key={state}
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={zoneFormData.state.includes(state)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onZoneFormDataChange({
                            ...zoneFormData,
                            state: [...zoneFormData.state, state],
                          });
                        } else {
                          onZoneFormDataChange({
                            ...zoneFormData,
                            state: zoneFormData.state.filter((s) => s !== state),
                          });
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{state}</span>
                  </label>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Click to open dropdown and select multiple states
            </p>
          </div>
        </div>

        {/* Restricted PIN Codes */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Restricted PIN Codes
          </label>
          <input
            type="text"
            value={zoneFormData.restrictedPin.join(", ")}
            onChange={handlePinCodeChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Enter PIN codes (comma-separated, e.g., 12345, 67890)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter restricted PIN codes separated by commas
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={savingZone}>
            {savingZone
              ? editingZone
                ? "Updating..."
                : "Adding..."
              : editingZone
                ? "Update Zone"
                : "Add Zone"}
          </Button>

        </div>
      </div>
    </Modal>
  );
}