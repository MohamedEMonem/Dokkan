export interface IAudit {
    createdAt: Date;
    updatedAt: Date;
}

export interface IOptionalAudit {
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISoftDelete {
    deletedAt: Date;
}

export type Audited<T> = T & IAudit;
export type OptionalAudited<T> = T & IOptionalAudit;
export type SoftDeleted<T> = T & ISoftDelete;
