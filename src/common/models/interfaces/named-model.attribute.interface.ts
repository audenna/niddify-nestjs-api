export interface INamedModelAttribute extends IUUIDModelAttribute {
  name: string;
  description?: string | null;
}

export interface IUUIDModelAttribute {
  uuid?: string;
}
