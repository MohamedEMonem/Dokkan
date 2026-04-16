import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

export interface IMessageInfo {
  senderId: number;
  receiverId: number;
  message: string;
  isRead: boolean;
}

export type IMessage = WithId<OptionalAudited<SoftDeleted<IMessageInfo>>>;
