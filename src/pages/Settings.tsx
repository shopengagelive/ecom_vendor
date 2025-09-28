import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store, CreditCard, Shield, Truck } from "lucide-react";
import { createMethod, createShippingInformation, createVerificationDocumnet, getShippingInformation, getShippingSetup, getShippingZone, getStore, getVerificationDocumnets,  updateShippingInformation, updateShippingMode, updateStore, updateZoneMethod, uploadDocument } from "../services/api";
import {
  StoreSetup,
  PaymentTab,
  VerificationTab,
  ShippingTab,
  // ZoneModal,
  MethodModal,
  PolicyModal,
  StoreSettings,
  BankDetails,
  KYCDocument,
  ShippingZone,
  ShippingMethod,
  ShippingPolicy,
  // ZoneFormData,
  MethodFormData,
  MethodOption,
  // CountryStateMap,
  Tab,
} from "../components/settings";
import toast from "react-hot-toast";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("store");

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    id: "",
    storeName: "",
    storeUsername: "",
    coverImage: null,
    profileImage: null,
    // returnPolicy: "30 days return policy with full refund",
    shippingDays: 3,
    street: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    address: "",
  });

  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: "John Doe",
    accountNumber: "1234567890",
    ifscCode: "SBIN0001234",
    bankName: "State Bank of India",
    branchName: "Main Branch",
  });

  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [documentForm, setDocumentForm] = useState<any>({
    documentType: "",
    fileUrl: ""
  });
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  const predefinedDocumentTypes = [
    "PAN Card",
    "Aadhar Card",
    "Business License",
    "GST Certificate",
    "Bank Statement",
    "Shop Act License",
    "Trade License",
    "Partnership Deed",
    "Company Registration",
    "Other",
  ];

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);

  // const [showZoneModal, setShowZoneModal] = useState(false);
  // const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);

  const [showMethodModal, setShowMethodModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(
    null
  );
  const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Add mock country/state data
  // const countryStateMap: CountryStateMap = {
  //   India: [
  //     "Maharashtra",
  //     "Gujarat",
  //     "Punjab",
  //     "Delhi",
  //     "Karnataka",
  //     "Tamil Nadu",
  //     "Uttar Pradesh",
  //     "West Bengal",
  //     "Rajasthan",
  //     "Kerala",
  //   ],
  //   Pakistan: [
  //     "Punjab",
  //     "Sindh",
  //     "Khyber Pakhtunkhwa",
  //     "Balochistan",
  //     "Islamabad Capital Territory",
  //     "Gilgit-Baltistan",
  //     "Azad Kashmir",
  //   ],
  // };

  // const [zoneFormData, setZoneFormData] = useState<ZoneFormData>({
  //   name: "",
  //   countries: ["India"],
  //   states: [],
  // });

  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [shippingPolicy, setShippingPolicy] = useState<ShippingPolicy>({
    policy: "",
    isCheck: true
  });

  const [shippingMode, setShippingMode] = useState<"manual" | "automatic">(
    "manual"
  );

  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const [shippingInfos, setShippingInfos] = useState<any>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingStore, setLoadingStore] = useState(false);
  const [storeError, setStoreError] = useState<string>("");
  const [creatingStore, setCreatingStore] = useState<boolean>(false);
  const [methodActionStatus, setMethodActionStatus] = useState<"create" | "update" | null>(null);

  useEffect(() => {
    if (!stateDropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target as Node)
      ) {
        setStateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [stateDropdownOpen]);

  /* ============ KYC handlers ============ */
  const handleKYCUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    setDocError(null);

    try {
      const url = await uploadDocument(file);
      const res = await createVerificationDocumnet({
        documentType: documentForm.documentType,
        fileUrl: url,
      });
      setKycDocuments((prev) => [...prev, res.data]);
      console.log(res)
      setDocumentForm({
        documentType: "",
        fileUrl: "",
      });
      toast.success("Document uploaded and submitted successfully!");
    } catch (err: any) {
      setDocError(err.message || "Failed to upload and submit document");
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
    }
  };


  const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentForm((prev: any) => ({
      ...prev,
      documentType: e.target.value,
    }));
  };

  /* ============ Zone handlers ============ */
  // const handleAddZone = () => {
  //   setZoneFormData({ name: "", countries: ["India"], states: [] });
  //   setEditingZone(null);
  //   setShowZoneModal(true);
  // };

  // const handleEditZone = (zone: ShippingZone) => {
  //   setZoneFormData({
  //     name: zone.name,
  //     countries: zone.countries,
  //     states: zone.states,
  //   });
  //   setEditingZone(zone);
  //   setShowZoneModal(true);
  // };

  // const handleSaveZone = () => {
  //   const zoneData: ShippingZone = {
  //     id: editingZone?.id || Date.now().toString(),
  //     name: zoneFormData.name,
  //     countries: zoneFormData.countries,
  //     states: zoneFormData.states,
  //     cities: editingZone?.cities || [],
  //     restrictedPinCodes: editingZone?.restrictedPinCodes || [],
  //     shippingMethods: editingZone?.shippingMethods || [],
  //   };

  //   if (editingZone) {
  //     setShippingZones((prev) =>
  //       prev.map((z) => (z.id === editingZone.id ? zoneData : z))
  //     );
  //   } else {
  //     setShippingZones((prev) => [...prev, zoneData]);
  //   }

  //   setShowZoneModal(false);
  //   setEditingZone(null);
  // };

  /* ============ Method handlers ============ */
  const methodOptions: readonly MethodOption[] = [
    "Flat Rate",
    // "Local Pickup",
    "Free Shipping",
  ] as const;

  const [methodFormData, setMethodFormData] = useState<MethodFormData>({
    name: "",
    cost: 0,
    deliveryDays: 3,
    isFree: false,
    freeShippingRequirement: "none",
    minOrderAmount: 0,
    applyMinBeforeCoupon: false,
  });

  const [methodError, setMethodError] = useState<string | null>(null);
  const [savingZone, setSavingZone] = useState<boolean>(false);

  const handleAddMethod = (zone: ShippingZone) => {
    setSelectedZone(zone);
    setEditingMethod(null);
    setMethodFormData({
      name: "",
      cost: 0,
      deliveryDays: 3,
      isFree: false,
      freeShippingRequirement: "none",
      minOrderAmount: 0,
      applyMinBeforeCoupon: false,
    });
    setMethodError(null);
    setShowMethodModal(true);
  };


  const handleEditMethod = (zone: ShippingZone, method: any) => {
    setSelectedZone(zone);
    setEditingMethod(method);
    setMethodFormData({
      name: method.title as MethodOption,
      cost: method.cost,
      deliveryDays: 3, 
      isFree: method.method === "Free",
      freeShippingRequirement:
        method.freeShippingRequired === "minimum amount" ? "min_amount" :
        method.freeShippingRequired === "no requirement" ? "none" : "none",
      minOrderAmount: method.minimunOrderAmount ? Number(method.minimunOrderAmount) : 0,
      applyMinBeforeCoupon: false,
    });
    setMethodError(null);
    setShowMethodModal(true);
  };

  const handleSaveMethod = async () => {
    if (!selectedZone) {
      setMethodError("No zone selected");
      return;
    }
    setMethodError(null);
    setSavingZone(true);
    try {
      const methodData: any = {
        zoneId: selectedZone.id,
        method: methodFormData.name === "Flat Rate" ? "flat" : "Free",
        title: methodFormData.name,
        cost: methodFormData.cost,
      };

      if (methodFormData.name === "Free Shipping") {
        methodData.freeShippingRequired =
          methodFormData.freeShippingRequirement === "min_amount"
            ? "minimum amount"
            : "no requirement";
        if (methodFormData.freeShippingRequirement === "min_amount") {
          methodData.minimunOrderAmount = methodFormData.minOrderAmount.toString();
        }
      }

      let data;
      if (editingMethod) {
        data = await updateZoneMethod(editingMethod.id, methodData);
        console.log("Shipping method updated:", data);
        toast.success("Shipping method updated successfully!");
        setMethodActionStatus("update");
      } else {
        data = await createMethod(methodData);
        console.log("Shipping method created:", data);
        toast.success("Shipping method added successfully!");
        setMethodActionStatus("create");
      }

      setShowMethodModal(false);
    } catch (err: any) {
      console.error("Error saving shipping method:", err);
      setMethodError(err.message || editingMethod ? "Failed to update shipping method." : "Failed to add shipping method.");
    } finally {
      setSavingZone(false);
    }
  };

  /* ============ Shipping policy ============ */
  const handleOpenPolicyModal = (policy?: ShippingPolicy) => {
    setShippingPolicy(policy || { policy: "", isCheck: true });
    setShowPolicyModal(true);
  };

  const handleSavePolicy = async () => {
    setIsSubmitting(true);
    setError(null);
    const previousState = { ...shippingPolicy };

    try {
      if (shippingPolicy.id) {
        // Update existing policy
        const res = await updateShippingInformation(shippingPolicy.id, {
          policy: shippingPolicy.policy,
          isCheck: shippingPolicy.isCheck,
        });
        setShippingInfos((prev: any) =>
          prev.map((info: any) => (info.id === shippingPolicy.id ? { ...info, ...res.data } : info))
        );
      } else {
        // Create new policy
        const res = await createShippingInformation({
          policy: shippingPolicy.policy,
          isCheck: shippingPolicy.isCheck,
        });
        console.log(res)
        setShippingInfos((prev: any) => [
          ...prev,
          {
            ...shippingPolicy,
            id: res.data.id || Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: "ed7d59ce-9366-4418-bf95-68283179a986",
          },
        ]);
      }
      setShowPolicyModal(false);
      setShippingPolicy({ policy: "", isCheck: false });
    } catch (err: any) {
      setError(err.message || (shippingPolicy.id ? 'Failed to update Shipping Information' : 'Failed to create Shipping Information'));
      setShippingPolicy(previousState);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchShippingInformation = async () => {
    try {
      const res = await getShippingInformation();
      console.log(res)
      setShippingInfos(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchShippingZones = async () => {
    try {
      const res = await getShippingZone();
      console.log(res)
      setShippingZones(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchverificationDocuments = async () => {
    try {
      setLoadingDocs(true)
      const res = await getVerificationDocumnets();
      console.log(res)
      setKycDocuments(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingDocs(false)
    }
  }

  const fetchStoreSettings = async () => {
    try {
      setLoadingStore(true)
      const res = await getStore();
      console.log(res)
      setStoreSettings(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingStore(false)
    }
  }

  const fetchShippingMode = async () => {
    try {
      const res = await getShippingSetup();
      console.log(res)
      setShippingMode(res.data?.shippingType)
      // setShippingInfos(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  

  useEffect(() => {
    fetchStoreSettings();
    fetchverificationDocuments();
    fetchShippingInformation();
    fetchShippingMode();
    fetchShippingZones();
  }, [])

  const handleNavigateToShippingSetup = () => {
    navigate("/shipping-setup");
  };

  const handleShippingModeChange = async (mode: "manual" | "automatic") => {
    try {
      setShippingMode(mode);
      await updateShippingMode({ shippingType: mode });
      console.log("Shipping mode updated successfully:", mode);
    } catch (error: any) {
      console.error("Failed to update shipping mode:", error.message);
      // Optional: revert state if API fails
      setShippingMode(prev => prev);
    }
  };

  const tabs: Tab[] = [
    { id: "store", name: "Store Setup", icon: Store },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "verification", name: "Verification", icon: Shield },
    { id: "shipping", name: "Shipping", icon: Truck },
  ];

  /* ============ Save store ============ */
  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreError("");
    setCreatingStore(true);
    try {
      const data = await updateStore(storeSettings.id, storeSettings);
      console.log("Store updated:", data);
      toast.success("Store settings updated successfully!");
    } catch (err: any) {
      console.error("Error updating store:", err);
      setStoreError(err.message || "Failed to update store settings.");
    } finally {
      setCreatingStore(false);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your store settings, payment methods, and shipping zones.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Store Setup Tab */}
      {activeTab === "store" && (
        <StoreSetup
          apiError={storeError}
          creatingStore={creatingStore}
          loading={loadingStore}
          storeSettings={storeSettings}
          onStoreSettingsChange={setStoreSettings}
          onSave={handleSaveStoreSettings}
        />
      )}

      {/* Payment Tab */}
      {activeTab === "payment" && (
        <PaymentTab
          bankDetails={bankDetails}
          onBankDetailsChange={setBankDetails}
          onSave={() => console.log("Save bank details")}
        />
      )}

      {/* Verification Tab */}
      {activeTab === "verification" && (
        <VerificationTab
          kycDocuments={kycDocuments}
          loading={loadingDocs}
          predefinedDocumentTypes={predefinedDocumentTypes}
          onKYCUpload={handleKYCUpload}
          documentForm={documentForm}
          uploading={uploadingDoc}
          error={docError}
          handleDocTypeChange={handleDocTypeChange}
        />
      )}

      {/* Shipping Tab */}
      {activeTab === "shipping" && (
        <ShippingTab
          shippingZones={shippingZones}
          shippingInfos={shippingInfos}
          onAddZone={() => { }}
          onEditZone={() => { }}
          onDeleteZone={(zoneId) => {
            setShippingZones((prev) => prev.filter((z) => z.id !== zoneId));
          }}
          onAddMethod={handleAddMethod}
          onEditMethod={handleEditMethod}
          onOpenPolicyModal={handleOpenPolicyModal}
          onNavigateToShippingSetup={handleNavigateToShippingSetup}
          shippingMode={shippingMode}
          onShippingModeChange={handleShippingModeChange}
          setShippingInfos={setShippingInfos}
          methodActionStatus={methodActionStatus}
        />
      )}


      {/* Method Modal */}
      <MethodModal
        isOpen={showMethodModal}
        onClose={() => setShowMethodModal(false)}
        editingMethod={editingMethod}
        methodFormData={methodFormData}
        onMethodFormDataChange={setMethodFormData}
        onSave={handleSaveMethod}
        methodError={methodError}
        methodOptions={methodOptions}
        savingZone={savingZone}
      />

      {/* Policy Modal */}
      <PolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        shippingPolicy={shippingPolicy}
        onShippingPolicyChange={setShippingPolicy}
        onSave={handleSavePolicy}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
