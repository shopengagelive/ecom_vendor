import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import {
  Settings,
} from "lucide-react";
import { Warehouse, CountryStateMap, ShippingZone } from "./types";
import {
  fetchWarehouses,
  createWarehouse as apiCreateWarehouse,
  updateWarehouse as apiUpdateWarehouse,
  deleteWarehouse as apiDeleteWarehouse,
  deleteShippingInformation,
  getShippingZone,
  deleteShippingZone,
  createShippingZone,
  updateShippingZone,
} from "../../services/api";
import ZoneModal from "./ZoneModal";
import ShippingPolicies from "./shipping-policies";
import WareHouse from "./ware-house";
import ShippingSetup from "./shipping-setup";
import ShippingZoneComponent from "./shipping-zone";

interface ShippingTabProps {
  shippingZones: ShippingZone[];
  shippingInfos: any[];
  onAddZone: () => void;
  onEditZone: (zone: ShippingZone) => void;
  onDeleteZone: (zoneId: string) => void;
  onAddMethod: (zone: ShippingZone) => void;
  onEditMethod: (zone: ShippingZone, method: any) => void;
  onOpenPolicyModal: any;
  onNavigateToShippingSetup: () => void;
  shippingMode: "manual" | "automatic";
  onShippingModeChange: (mode: "manual" | "automatic") => void;
  setShippingInfos: any;
  methodActionStatus: any;
}

export default function ShippingTab({
  shippingInfos,
  onAddZone,
  onEditZone,
  onDeleteZone,
  onAddMethod,
  onEditMethod,
  onOpenPolicyModal,
  onNavigateToShippingSetup,
  shippingMode,
  onShippingModeChange,
  methodActionStatus,
  setShippingInfos,
}: ShippingTabProps) {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState<boolean>(false);
  const [warehouseModalOpen, setWarehouseModalOpen] = useState<boolean>(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingPolicyId, setDeletingPolicyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<any | null>(null);
  const [warehouseForm, setWarehouseForm] = useState<{
    name: string;
    address: string;
    postCode: string;
    city: string;
    state: string;
  }>({ name: "", address: "", postCode: "", city: "", state: "" });
  const [savingWarehouse, setSavingWarehouse] = useState<boolean>(false);
  const [shippingZones, setShippingZones] = useState<any[]>([]);
  const [loadingZones, setLoadingZones] = useState<boolean>(true);
  const [zoneModalOpen, setZoneModalOpen] = useState<boolean>(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [zoneForm, setZoneForm] = useState<{
    zoneName: string;
    country: string;
    state: string[];
    restrictedPin: string[];
  }>({ zoneName: "", country: "India", state: [], restrictedPin: [] });
  const [savingZone, setSavingZone] = useState<boolean>(false);
  const [zoneError, setZoneError] = useState<string | null>(null);
  const [deletingZoneId, setDeletingZoneId] = useState<string | null>(null);
  const [stateDropdownOpen, setStateDropdownOpen] = useState<boolean>(false);


  const loadZones = async () => {
    setLoadingZones(true);
    try {
      const res = await getShippingZone();
      console.log(res)
      setShippingZones(res.data || []);
    } catch (e: any) {
      setZoneError(e.message || "Failed to fetch shipping zones");
      setTimeout(() => setZoneError(null), 3000);
    } finally {
      setLoadingZones(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, [methodActionStatus])

  useEffect(() => {
    const load = async () => {
      setLoadingWarehouses(true);
      try {
        const resAny: any = await fetchWarehouses();
        const list: Warehouse[] = Array.isArray(resAny?.data?.data)
          ? resAny.data.data
          : Array.isArray(resAny?.data)
            ? resAny.data
            : Array.isArray(resAny)
              ? resAny
              : [];
        setWarehouses(list);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingWarehouses(false);
      }
    };

    loadZones();
    load();
  }, []);

  const openAddWarehouse = () => {
    setEditingWarehouse(null);
    setWarehouseForm({ name: "", address: "", postCode: "", city: "", state: "" });
    setWarehouseModalOpen(true);
  };

  const openEditWarehouse = (wh: Warehouse) => {
    setEditingWarehouse(wh);
    setWarehouseForm({
      name: wh.name || "",
      address: wh.address || "",
      postCode: wh.postCode || "",
      city: wh.city || "",
      state: wh.state || "",
    });
    setWarehouseModalOpen(true);
  };

  const handleSaveWarehouse = async () => {
    if (
      !warehouseForm.name ||
      !warehouseForm.address ||
      !warehouseForm.postCode ||
      !warehouseForm.city ||
      !warehouseForm.state
    ) {
      return;
    }
    setSavingWarehouse(true);
    try {
      if (editingWarehouse) {
        const resAny: any = await apiUpdateWarehouse(editingWarehouse.id, warehouseForm);
        const updated: Warehouse = (resAny?.data?.data || resAny?.data || resAny) as Warehouse;
        setWarehouses((prev) =>
          prev.map((w) =>
            w.id === editingWarehouse.id ? { ...w, ...warehouseForm, ...(updated || {}) } : w
          )
        );
      } else {
        const resAny: any = await apiCreateWarehouse(warehouseForm);
        const created: Warehouse = (resAny?.data?.data || resAny?.data || resAny) as Warehouse;
        setWarehouses((prev) => [created || { ...warehouseForm, id: Date.now().toString() }, ...prev]);
      }
      setWarehouseModalOpen(false);
      setEditingWarehouse(null);
    } catch (e: any) {
      console.log(e);
    } finally {
      setSavingWarehouse(false);
    }
  };

  const handleDeleteWarehouse = async (id: string) => {
    try {
      await apiDeleteWarehouse(id);
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      console.log(e);
    }
  };

  const openAddZone = () => {
    setEditingZone(null);
    setZoneForm({ zoneName: "", country: "India", state: [], restrictedPin: [] });
    setZoneModalOpen(true);
    onAddZone();
  };

  const openEditZone = (zone: any) => {
    console.log(zone)
    setEditingZone(zone);
    setZoneForm({
      zoneName: zone.name || "",
      country: zone.country || "India",
      state: zone.state || [],
      restrictedPin: zone.restrictedPin || [],
    });
    setZoneModalOpen(true);
    onEditZone(zone);
  };

  const handleSaveZone = async () => {
    if (!zoneForm.zoneName || !zoneForm.country) {
      setZoneError("Zone name and country are required");
      return;
    }
    setSavingZone(true);
    try {
      if (editingZone) {
        const res = await updateShippingZone(editingZone.id, {
          zoneName: zoneForm.zoneName,
          country: zoneForm.country,
          state: zoneForm.state,
          restrictedPin: zoneForm.restrictedPin,
        });
        console.log(res)
        setShippingZones((prev) =>
          prev.map((z) =>
            z.id === editingZone.id
              ? { ...z, name: res.data.zoneName, countries: [res.data.country], state: res.data.state, restrictedPin: res.data.restrictedPin }
              : z
          )
        );
      } else {
        const res = await createShippingZone({
          zoneName: zoneForm.zoneName,
          country: zoneForm.country,
          state: zoneForm.state,
          restrictedPin: zoneForm.restrictedPin,
        });

        console.log(res)
        setShippingZones((prev) => [
          ...prev,
          {
            ...res.data,
            name: res.data.zoneName,
            countries: [res.data.country],
            state: res.data.state,
            restrictedPin: res.data.restrictedPin,
            cities: [],
            shippingMethods: [],
          },
        ]);
      }
      setZoneModalOpen(false);
      setEditingZone(null);
      loadZones();
    } catch (e: any) {
      setZoneError(e.message || (editingZone ? "Failed to update zone" : "Failed to create zone"));
      setTimeout(() => setZoneError(null), 3000);
    } finally {
      setSavingZone(false);
    }
  };

  const handleDeleteZone = async (id: string) => {
    setDeletingZoneId(id);
    try {
      const res = await deleteShippingZone(id);
      console.log(res)
      setShippingZones((prev) => prev.filter((z) => z.id !== id));
      onDeleteZone(id);
    } catch (e: any) {
      setZoneError(e.message || "Failed to delete zone");
      setTimeout(() => setZoneError(null), 3000);
    } finally {
      setDeletingZoneId(null);
    }
  };

  const handleEditPolicy = (policy: any) => {
    onOpenPolicyModal(policy);
  };

  const handleDeletePolicy = async (id: string) => {
    const policy = shippingInfos.find((info) => info.id === id);
    setPolicyToDelete(policy);
    setShowDeleteModal(true);
  };

  const confirmDeletePolicy = async () => {
    if (!policyToDelete?.id) return;
    setDeletingPolicyId(policyToDelete.id);
    setError(null);
    try {
      await deleteShippingInformation(policyToDelete.id);
      setShippingInfos((prev: any) => prev.filter((info: any) => info.id !== policyToDelete.id));
    } catch (err: any) {
      setError(err.message || "Failed to delete the Shipping Information");
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingPolicyId(null);
      setShowDeleteModal(false);
      setPolicyToDelete(null);
    }
  };

  const cancelDeletePolicy = () => {
    setShowDeleteModal(false);
    setPolicyToDelete(null);
  };

  const countryStateMap: CountryStateMap = {
    India: [
      "Maharashtra",
      "Gujarat",
      "Punjab",
      "Delhi",
      "Karnataka",
      "Tamil Nadu",
      "Uttar Pradesh",
      "West Bengal",
      "Rajasthan",
      "Kerala",
    ],
    Pakistan: [
      "Punjab",
      "Sindh",
      "Khyber Pakhtunkhwa",
      "Balochistan",
      "Islamabad Capital Territory",
      "Gilgit-Baltistan",
      "Azad Kashmir",
    ],
  };

  return (
    <div className="space-y-6">
      {/* Shipping Policies */}
      <ShippingPolicies
        onOpenPolicyModal={onOpenPolicyModal}
        shippingInfos={shippingInfos}
        handleEditPolicy={handleEditPolicy}
        handleDeletePolicy={handleDeletePolicy}
      />

      {/* Warehouses */}
      <WareHouse
        openAddWarehouse={openAddWarehouse}
        loadingWarehouses={loadingWarehouses}
        warehouses={warehouses}
        openEditWarehouse={openEditWarehouse}
        handleDeleteWarehouse={handleDeleteWarehouse}
      />

      {/* Shipping Setup */}
      <ShippingSetup
        shippingMode={shippingMode}
        onShippingModeChange={onShippingModeChange}
        onNavigateToShippingSetup={onNavigateToShippingSetup}
        Settings={Settings}
      />

      {/* Shipping Zones */}
      <ShippingZoneComponent
        openAddZone={openAddZone}
        savingZone={savingZone}
        loadingZones={loadingZones}
        zoneError={zoneError}
        shippingZones={shippingZones}
        openEditZone={openEditZone}
        deletingZoneId={deletingZoneId}
        handleDeleteZone={handleDeleteZone}
        onAddMethod={onAddMethod}
        onEditMethod={onEditMethod}
      />

      {/* Warehouse Modal */}
      <Modal
        isOpen={warehouseModalOpen}
        onClose={() => setWarehouseModalOpen(false)}
        title={`${editingWarehouse ? "Edit" : "Add"} Warehouse`}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Warehouse name"
              value={warehouseForm.name}
              onChange={(e) => setWarehouseForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Code</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 560001"
              value={warehouseForm.postCode}
              onChange={(e) => setWarehouseForm((f) => ({ ...f, postCode: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
              value={warehouseForm.city}
              onChange={(e) => setWarehouseForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="State"
              value={warehouseForm.state}
              onChange={(e) => setWarehouseForm((f) => ({ ...f, state: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street, area"
              value={warehouseForm.address}
              onChange={(e) => setWarehouseForm((f) => ({ ...f, address: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setWarehouseModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveWarehouse} disabled={savingWarehouse}>
            {savingWarehouse ? "Saving..." : editingWarehouse ? "Update" : "Create"}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDeletePolicy}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete the shipping policy "{policyToDelete?.policy}"? This action
            cannot be undone.
          </p>
          {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={cancelDeletePolicy}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeletePolicy} disabled={deletingPolicyId !== null}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Zone Modal */}
      <ZoneModal
        isOpen={zoneModalOpen}
        onClose={() => {
          setZoneModalOpen(false);
          setStateDropdownOpen(false);
        }}
        savingZone={savingZone}
        editingZone={editingZone}
        zoneFormData={zoneForm}
        onZoneFormDataChange={setZoneForm}
        onSave={handleSaveZone}
        countryStateMap={countryStateMap}
        stateDropdownOpen={stateDropdownOpen}
        onStateDropdownToggle={() => setStateDropdownOpen((prev) => !prev)}
        onStateDropdownClose={() => setStateDropdownOpen(false)}
      />
    </div>
  );
}