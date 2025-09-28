import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  ShippingSetupTable,
  CourierModal,
  DeleteConfirmModal,
} from "../components/shippingsetup";
import {
  CourierCompany,
  CourierFormData,
} from "../components/shippingsetup/types";
import { createShippingSetup, deleteShippingSetup, getShippingSetups, toggleShippingSetup, updateShippingSetup } from "../services/api";
import { Pagination } from "../components/shared/pagination";
import Loader from "../components/shared/loader";

export default function ShippingSetup() {
  const navigate = useNavigate();
  const [couriers, setCouriers] = useState<CourierCompany[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourier, setEditingCourier] = useState<CourierCompany | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courierToDelete, setCourierToDelete] = useState<CourierCompany | null>(null);
  const [meta, setMeta] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);


  const fetchCouriers = async (
    pageParam?: number,
    limitParam?: number
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getShippingSetups(
        pageParam ?? page,
        limitParam ?? limit
      );
      setCouriers(res.data?.data || []);
      setMeta(res.data?.meta);
    } catch (err: any) {
      setError(err.message || "Failed to load shipping setups");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchCouriers(page, limit);
  }, [page, limit]);

  const handleAddCourier = () => {
    setEditingCourier(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditCourier = (courier: CourierCompany) => {
    setEditingCourier(courier);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteCourier = (courier: CourierCompany) => {
    setCourierToDelete(courier);
    setDeleteModalOpen(true);
  };

  const handleSaveCourier = async (data: CourierFormData) => {
    const previousCouriers = [...couriers];
    const apiData = {
      providerName: data.name,
      trackingUrl: data.trackingUrl,
      prefix: data.trackingIdPrefix,
    };
    setIsSubmitting(true);

    if (isEditing && editingCourier) {
      // Optimistic update for editing
      setCouriers((prev) =>
        prev.map((courier) =>
          courier.id === editingCourier.id
            ? {
              ...courier,
              ...data,
              providerName: data.name,
              updatedAt: new Date().toISOString().split("T")[0],
            }
            : courier
        )
      );

      try {
        await updateShippingSetup(editingCourier.id, apiData);
        await fetchCouriers(page, limit); // Refresh data
        setIsModalOpen(false);
        setEditingCourier(null);
        setIsEditing(false);
      } catch (err: any) {
        setCouriers(previousCouriers);
        setError(err.message || "Failed to update courier");
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Optimistic update for creating
      const tempId = Date.now().toString();
      const newCourier: CourierCompany = {
        id: tempId,
        ...data,
        providerName: data.name,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        prefix: "",
      };
      setCouriers((prev) => [...prev, newCourier]);

      try {
        const response = await createShippingSetup(apiData);
        setCouriers((prev) =>
          prev.map((courier) =>
            courier.id === tempId
              ? {
                ...courier,
                id: response.data.id,
              }
              : courier
          )
        );
        await fetchCouriers(page, limit);
        setIsModalOpen(false);
      } catch (err: any) {
        setCouriers(previousCouriers);
        setError(err.message || "Failed to create courier");
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (courierToDelete) {
      const previousCouriers = [...couriers];
      setCouriers((prev) => prev.filter((courier) => courier.id !== courierToDelete.id));
      setDeleteModalOpen(false);
      setCourierToDelete(null);

      try {
        const res = await deleteShippingSetup(courierToDelete.id);
        console.log(res)
        // await fetchCouriers(page, limit);
      } catch (err: any) {
        setCouriers(previousCouriers);
        setError(err.message || "Failed to delete courier");
      }
    }
  };

  const handleToggleStatus = async (courierId: string) => {
    const previousCouriers = [...couriers];
    setCouriers((prev) =>
      prev.map((courier) =>
        courier.id === courierId
          ? {
            ...courier,
            isActive: !courier.isActive,
            updatedAt: new Date().toISOString().split("T")[0],
          }
          : courier
      )
    );
    try {
      const res = await toggleShippingSetup(courierId);
      console.log(res)
    } catch (err: any) {
      setCouriers(previousCouriers);
      setError(err.message || 'Failed to update courier status');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipping Setup</h1>
            <p className="text-gray-600">
              Manage courier companies and tracking settings
            </p>
          </div>
        </div>
        <Button onClick={handleAddCourier} icon={Plus}>
          Add Courier Company
        </Button>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <Loader />
      )}
      {error && (
        <Card>
          <div className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => fetchCouriers()} className="mt-4">
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <Card>
          <ShippingSetupTable
            couriers={couriers}
            onEdit={handleEditCourier}
            onDelete={handleDeleteCourier}
            onToggleStatus={handleToggleStatus}
          />
        </Card>
      )}

      {!isLoading && !error && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          limit={meta.limit}
          onPageChange={(newPage) => setPage(newPage)}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}


      {/* Modals */}
      <CourierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourier(null);
          setIsEditing(false);
        }}
        onSave={handleSaveCourier}
        courier={editingCourier}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCourierToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        courierName={courierToDelete?.providerName || ""}
      />
    </div>
  );
}