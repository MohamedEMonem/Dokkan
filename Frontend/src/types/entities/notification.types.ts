import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

export interface INotificationInfo {
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
}

export type INotification = WithId<OptionalAudited<SoftDeleted<INotificationInfo>>>;
