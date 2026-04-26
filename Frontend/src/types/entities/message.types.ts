import { WithId } from '@/types/core/entity.types';
import { OptionalAudited } from '@/types/core/audit.types';

/* ────────────────────────────────────────────────────────
 * Message Interfaces
 * ──────────────────────────────────────────────────────── */

export interface IMessageInfo {
  senderId: string;
  receiverId: string;
  storeId?: string;
  content: string;
  readStatus?: boolean;
}

/* ────────────────────────────────────────────────────────
 * Composition
 * ──────────────────────────────────────────────────────── */
export type IMessage = WithId<OptionalAudited<IMessageInfo>>;
