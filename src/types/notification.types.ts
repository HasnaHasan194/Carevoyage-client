export type NotificationType =
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_REFUND_REQUESTED"
  | "BOOKING_REFUND_APPROVED"
  | "BOOKING_REFUND_REJECTED"
  | "PACKAGE_CANCELLED"
  | "PACKAGE_COMPLETED"
  | "CARETAKER_REQUEST_CREATED"
  | "CARETAKER_REQUEST_FULFILLED"
  | "AGENCY_VERIFIED"
  | "AGENCY_REJECTED"
  | "AGENCY_REVERIFY_REQUESTED"
  | "WALLET_CREDITED"
  | "WALLET_DEBITED"
  | "REVIEW_CREATED"
  | "NEW_CHAT_MESSAGE";

export type NotificationMetadata =
  | { type: "BOOKING_CONFIRMED"; bookingId: string }
  | { type: "BOOKING_CANCELLED"; bookingId: string; cancelledBy: "client" | "agency" | "system" }
  | { type: "BOOKING_REFUND_REQUESTED"; bookingId: string; refundRequestId: string }
  | { type: "BOOKING_REFUND_APPROVED"; bookingId: string; refundRequestId: string; amount: number }
  | { type: "BOOKING_REFUND_REJECTED"; bookingId: string; refundRequestId: string; reason?: string }
  | { type: "PACKAGE_CANCELLED"; packageId: string }
  | { type: "PACKAGE_COMPLETED"; packageId: string }
  | { type: "CARETAKER_REQUEST_CREATED"; requestId: string; packageId: string }
  | { type: "CARETAKER_REQUEST_FULFILLED"; requestId: string; packageId: string }
  | { type: "AGENCY_VERIFIED"; agencyId: string }
  | { type: "AGENCY_REJECTED"; agencyId: string; reason: string }
  | { type: "AGENCY_REVERIFY_REQUESTED"; agencyId: string }
  | { type: "WALLET_CREDITED"; walletId: string; amount: number; source: string; referenceId: string }
  | { type: "WALLET_DEBITED"; walletId: string; amount: number; source: string; referenceId: string }
  | { type: "REVIEW_CREATED"; reviewId: string; bookingId: string; packageId: string; rating: number }
  | { type: "NEW_CHAT_MESSAGE"; bookingId: string; senderUserId: string; senderRole: "client" | "caretaker" };

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata: NotificationMetadata;
  createdAt: string;
  read: boolean;
}

export interface ListNotificationsResponse {
  items: Array<{
    _id: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    metadata: NotificationMetadata;
    readAt?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  totalItems: number;
  unreadCount: number;
  page: number;
  limit: number;
}

