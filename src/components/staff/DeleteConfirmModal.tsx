import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { DeleteConfirmModalProps } from "./types";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  staffToDelete,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Staff" size="sm">
      <div className="space-y-6">
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{staffToDelete?.name}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
