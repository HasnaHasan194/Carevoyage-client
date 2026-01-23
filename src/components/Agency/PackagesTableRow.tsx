import React from "react";
import { PackageActionsMenu } from "./PackageActionsMenu";
import type { Package, PackageStatus } from "@/services/agency/packageService";

interface PackagesTableRowProps {
  package: Package;
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

const getStatusBadge = (status: PackageStatus) => {
  const styles = {
    draft: { bg: "#FEF3C7", text: "#92400E", label: "Draft" },
    published: { bg: "#D1FAE5", text: "#065F46", label: "Published" },
    completed: { bg: "#DBEAFE", text: "#1E40AF", label: "Completed" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
  };
  const style = styles[status];
  return (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium inline-block"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
};

export const PackagesTableRow: React.FC<PackagesTableRowProps> = ({
  package: pkg,
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
  if (isMobile) {
    // Mobile card layout
    return (
      <div
        className="border rounded-lg p-4 mb-3"
        style={{
          borderColor: "#E5E7EB",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="flex justify-between items-start mb-3">
          <h3
            className="text-base font-semibold flex-1 mr-2"
            style={{ color: "#7C5A3B" }}
          >
            {pkg.PackageName}
          </h3>
          {getStatusBadge(pkg.status)}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#8B6F47" }}>
              Price:
            </span>
            <span className="text-sm font-semibold" style={{ color: "#7C5A3B" }}>
              ${pkg.basePrice}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#8B6F47" }}>
              Meeting Point:
            </span>
            <span className="text-sm truncate ml-2" style={{ color: "#7C5A3B" }}>
              {pkg.meetingPoint}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#8B6F47" }}>
              Category:
            </span>
            <span className="text-sm" style={{ color: "#7C5A3B" }}>
              {pkg.category}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <PackageActionsMenu
            packageId={pkg.id}
            status={pkg.status}
            onView={onView}
            onEdit={onEdit}
            onPublish={onPublish}
            onComplete={onComplete}
            onCancel={onCancel}
            onDelete={onDelete}
            isPublishing={isPublishing}
            isCompleting={isCompleting}
            isCancelling={isCancelling}
            isDeleting={isDeleting}
            isMobile={true}
          />
        </div>
      </div>
    );
  }

  // Desktop table row
  return (
    <tr
      className="border-b hover:bg-[#FDFBF8] transition-colors"
      style={{ borderColor: "#E5E7EB" }}
    >
      <td className="px-4 py-3">
        <span className="text-sm font-medium" style={{ color: "#7C5A3B" }}>
          {pkg.PackageName}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-semibold" style={{ color: "#7C5A3B" }}>
          ${pkg.basePrice}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm truncate block max-w-xs" style={{ color: "#8B6F47" }}>
          {pkg.meetingPoint}
        </span>
      </td>
      <td className="px-4 py-3">{getStatusBadge(pkg.status)}</td>
      <td className="px-4 py-3">
        <span className="text-sm" style={{ color: "#8B6F47" }}>
          {pkg.category}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center">
          <PackageActionsMenu
            packageId={pkg.id}
            status={pkg.status}
            onView={onView}
            onEdit={onEdit}
            onPublish={onPublish}
            onComplete={onComplete}
            onCancel={onCancel}
            onDelete={onDelete}
            isPublishing={isPublishing}
            isCompleting={isCompleting}
            isCancelling={isCancelling}
            isDeleting={isDeleting}
            isMobile={false}
          />
        </div>
      </td>
    </tr>
  );
};

