import { WithId } from '@/types/core/entity.types';
import { OptionalAudited } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Notification Interfaces
 * ──────────────────────────────────────────────────────── */

export interface INotificationInfo {
  userId: string;
  type: string;
  content: string;
  readStatus?: boolean;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type INotification = WithId<OptionalAudited<INotificationInfo>>;
