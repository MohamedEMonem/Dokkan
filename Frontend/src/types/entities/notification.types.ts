import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Notification Interfaces
 * ──────────────────────────────────────────────────────── */

export interface INotificationInfo {
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type INotification = WithId<OptionalAudited<SoftDeleted<INotificationInfo>>>;
