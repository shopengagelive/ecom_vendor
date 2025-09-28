import React from "react";
import { mockStaff } from "../data/mockData";
import Button from "../components/ui/Button";
import { Plus } from "lucide-react";
import type { Staff } from "../types";
import {
  StaffTable,
  StaffForm,
  PermissionsModal,
  DeleteConfirmModal,
  Permissions,
  StaffFormData,
} from "../components/staff";

export default function Staff() {
  const [staffList, setStaffList] = React.useState<Staff[]>(mockStaff);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<StaffFormData>({
    name: "",
    email: "",
    role: "",
    status: "Active",
    avatar: "",
  });
  const [editStaffId, setEditStaffId] = React.useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [staffToDelete, setStaffToDelete] = React.useState<Staff | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);

  // Permissions modal state
  const [permissionsModalOpen, setPermissionsModalOpen] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState<Staff | null>(null);
  const [permissions, setPermissions] = React.useState<Permissions>({
    orders: false,
    products: false,
    analytics: false,
    customers: false,
    payments: false,
    settings: false,
    staff: false,
    reports: false,
  });

  const handleImageChange = (file: File) => {
    setFormData({ ...formData, avatar: file });
    setAvatarPreview(URL.createObjectURL(file));
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0]);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({ ...formData, avatar: "" });
    setAvatarPreview(null);
  };

  const handleOpenModal = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      status: "Active",
      avatar: "",
    });
    setAvatarPreview(null);
    setEditStaffId(null);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const handleEditStaff = (staff: Staff) => {
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      status: staff.status,
      avatar: staff.avatar || "",
    });
    setAvatarPreview(
      typeof staff.avatar === "string"
        ? staff.avatar
        : staff.avatar
        ? URL.createObjectURL(staff.avatar as File)
        : null
    );
    setEditStaffId(staff.id);
    setModalOpen(true);
  };

  const handleDeleteStaff = (staff: Staff) => {
    setStaffToDelete(staff);
    setDeleteModalOpen(true);
  };

  const handleManagePermissions = (staff: Staff) => {
    setSelectedStaff(staff);
    // Set default permissions based on role (you can customize this)
    setPermissions({
      orders: staff.role === "Manager" || staff.role === "Sales",
      products: staff.role === "Manager" || staff.role === "Sales",
      analytics: staff.role === "Manager",
      customers: staff.role === "Manager" || staff.role === "Support",
      payments: staff.role === "Manager",
      settings: staff.role === "Manager",
      staff: staff.role === "Manager",
      reports: staff.role === "Manager",
    });
    setPermissionsModalOpen(true);
  };

  const handleSavePermissions = () => {
    if (selectedStaff) {
      // Update staff with new permissions (you can add permissions to Staff type)
      console.log(`Permissions saved for ${selectedStaff.name}:`, permissions);
      alert(`Permissions updated for ${selectedStaff.name}`);
    }
    setPermissionsModalOpen(false);
    setSelectedStaff(null);
  };

  const handleCancelPermissions = () => {
    setPermissionsModalOpen(false);
    setSelectedStaff(null);
  };

  const confirmDeleteStaff = () => {
    if (staffToDelete) {
      setStaffList(staffList.filter((s) => s.id !== staffToDelete.id));
    }
    setDeleteModalOpen(false);
    setStaffToDelete(null);
  };

  const cancelDeleteStaff = () => {
    setDeleteModalOpen(false);
    setStaffToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editStaffId) {
      // Update existing staff
      setStaffList(
        staffList.map((s) =>
          s.id === editStaffId
            ? {
                ...s,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                avatar:
                  typeof formData.avatar === "string"
                    ? formData.avatar
                    : avatarPreview || "",
              }
            : s
        )
      );
    } else {
      // Add new staff
      const newStaff: Staff = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar:
          typeof formData.avatar === "string"
            ? formData.avatar
            : avatarPreview || "",
      };
      setStaffList([newStaff, ...staffList]);
    }
    setModalOpen(false);
    setEditStaffId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Staff</h1>
      <div className="mb-4 flex justify-end">
        <Button onClick={handleOpenModal} icon={Plus}>
          Add Staff
        </Button>
      </div>

      <StaffTable
        staffList={staffList}
        onEditStaff={handleEditStaff}
        onDeleteStaff={handleDeleteStaff}
        onManagePermissions={handleManagePermissions}
      />

      <StaffForm
        isOpen={modalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        editStaffId={editStaffId}
        avatarPreview={avatarPreview}
        onImageChange={handleImageChange}
        onFileInput={handleFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onRemoveImage={handleRemoveImage}
        dragActive={dragActive}
      />

      <PermissionsModal
        isOpen={permissionsModalOpen}
        onClose={handleCancelPermissions}
        selectedStaff={selectedStaff}
        permissions={permissions}
        onPermissionsChange={setPermissions}
        onSave={handleSavePermissions}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={cancelDeleteStaff}
        staffToDelete={staffToDelete}
        onConfirm={confirmDeleteStaff}
      />
    </div>
  );
}
