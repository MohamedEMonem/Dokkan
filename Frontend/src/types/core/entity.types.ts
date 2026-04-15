export interface IEntity {
    id: number;
}

export type WithId<T> = T & IEntity;