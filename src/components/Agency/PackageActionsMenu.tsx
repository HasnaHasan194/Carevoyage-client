import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/User/button";
import {
  Eye,
  Edit,
  CheckCircle,
  Ban,
  Trash2,
  MoreVertical,
  X,
} from "lucide-react";
import type { PackageStatus } from "@/services/agency/packageService";

interface PackageActionsMenuProps {
  packageId: string;
  status: PackageStatus;
  onView: (packageId: string) => void;
  onEdit?: (packageId: string) => void;
  onPublish?: (packageId: string) => void;
  onComplete?: (packageId: string) => void;
  onCancel?: (packageId: string) => void;
  onDelete?: (packageId: string) => void;
  isPublishing?: boolean;
  isCompleting?: boolean;
  isCancelling?: boolean;
  isDeleting?: boolean;
  isMobile?: boolean;
}

export const PackageActionsMenu: React.FC<PackageActionsMenuProps> = ({
  packageId,
  status,
  onView,
  onEdit,
  onPublish,
  onComplete,
  onCancel,
  onDelete,
  isPublishing = false,
  isCompleting = false,
  isCancelling = false,
  isDeleting = false,
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PackageStatus | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleView = () => {
    onView(packageId);
    setIsOpen(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(packageId);
      setIsOpen(false);
    }
  };

  const handleStatusChange = (newStatus: PackageStatus) => {
    setSelectedStatus(newStatus);
    setShowStatusModal(true);
    setIsOpen(false);
  };

  const confirmStatusChange = () => {
    if (!selectedStatus) return;

    switch (selectedStatus) {
      case "published":
        if (onPublish) {
          onPublish(packageId);
        }
        break;
      case "completed":
        if (onComplete) {
          onComplete(packageId);
        }
        break;
      case "cancelled":
        if (onCancel) {
          onCancel(packageId);
        }
        break;
    }

    setShowStatusModal(false);
    setSelectedStatus(null);
  };

  const handleDelete = () => {
    if (onDelete) {
      if (window.confirm("Are you sure you want to delete this package?")) {
        onDelete(packageId);
      }
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      if (window.confirm("Are you sure you want to cancel this package?")) {
        onCancel(packageId);
      }
    }
    setIsOpen(false);
  };

  const getStatusLabel = (status: PackageStatus) => {
    const labels = {
      published: "Published",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return labels[status] || status;
  };

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md hover:bg-[#F5E6D3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:ring-offset-1"
          aria-label="Package actions"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <MoreVertical
            className="w-5 h-5"
            style={{ color: "#7C5A3B" }}
          />
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-1 w-48 rounded-lg shadow-lg border z-50"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="py-1">
              {/* View Details - Always available */}
              <button
                onClick={handleView}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[#FDFBF8] transition-colors flex items-center gap-2"
                style={{ color: "#7C5A3B" }}
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>

              {/* Edit - Only for draft */}
              {status === "draft" && onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#FDFBF8] transition-colors flex items-center gap-2"
                  style={{ color: "#7C5A3B" }}
                >
                  <Edit className="w-4 h-4" />
                  Edit Package
                </button>
              )}

              {/* Change Status - Only for draft and published */}
              {(status === "draft" || status === "published") && (
                <div className="border-t my-1" style={{ borderColor: "#E5E7EB" }}>
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B6F47" }}>
                    Change Status
                  </div>
                  {status === "draft" && onPublish && (
                    <button
                      onClick={() => handleStatusChange("published")}
                      disabled={isPublishing}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#FDFBF8] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: "#7C5A3B" }}
                    >
                      <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
                      Mark as Published
                    </button>
                  )}
                  {status === "published" && onComplete && (
                    <button
                      onClick={() => handleStatusChange("completed")}
                      disabled={isCompleting}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#FDFBF8] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: "#7C5A3B" }}
                    >
                      <CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} />
                      Mark as Completed
                    </button>
                  )}
                  {status === "published" && onCancel && (
                    <button
                      onClick={() => handleStatusChange("cancelled")}
                      disabled={isCancelling}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-[#FDFBF8] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: "#7C5A3B" }}
                    >
                      <Ban className="w-4 h-4" style={{ color: "#EF4444" }} />
                      Mark as Cancelled
                    </button>
                  )}
                </div>
              )}

              {/* Delete - Only for draft */}
              {status === "draft" && onDelete && (
                <div className="border-t my-1" style={{ borderColor: "#E5E7EB" }}>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ color: "#DC2626" }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Package
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Change Confirmation Modal */}
      {showStatusModal && selectedStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-md w-full rounded-xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div
              className="flex justify-between items-center px-6 py-4 border-b"
              style={{ borderColor: "#E5E7EB" }}
            >
              <h3 className="text-lg font-semibold" style={{ color: "#7C5A3B" }}>
                Change Package Status
              </h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedStatus(null);
                }}
                className="p-1 rounded-md hover:bg-[#F5E6D3] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" style={{ color: "#8B6F47" }} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm mb-4" style={{ color: "#8B6F47" }}>
                Are you sure you want to change the package status to{" "}
                <strong style={{ color: "#7C5A3B" }}>
                  {getStatusLabel(selectedStatus)}
                </strong>
                ?
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedStatus(null);
                  }}
                  className="border-[#D4A574] text-[#D4A574] hover:bg-[#F5E6D3]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmStatusChange}
                  className="bg-[#D4A574] hover:bg-[#C89564] text-white"
                  disabled={
                    (selectedStatus === "published" && isPublishing) ||
                    (selectedStatus === "completed" && isCompleting) ||
                    (selectedStatus === "cancelled" && isCancelling)
                  }
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

