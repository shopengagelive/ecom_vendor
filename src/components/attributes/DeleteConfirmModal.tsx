import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Loader2 } from "lucide-react";
import { DeleteConfirmModalProps } from "./types";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  attributeToDelete,
  onConfirm,
  deleting,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Attribute" size="sm">
      <div className="space-y-6">
        <p>
          Are you sure you want to delete the attribute{" "}
          <span className="font-semibold">{attributeToDelete?.name}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
