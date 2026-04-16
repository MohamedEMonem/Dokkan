import { WithId } from '@/types/core/entity.types';
import { OptionalAudited, SoftDeleted } from '@/types/core/audit.types';

export interface ICategoryInfo {
  name: string;
}

export type ICategory = WithId<OptionalAudited<SoftDeleted<ICategoryInfo>>>;
