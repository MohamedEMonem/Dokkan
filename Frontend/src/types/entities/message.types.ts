import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Message Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IMessageInfo {
  senderId: number;
  receiverId: number;
  message: string;
  isRead: boolean;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IMessage = WithId<OptionalAudited<SoftDeleted<IMessageInfo>>>;
