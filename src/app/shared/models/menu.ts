import { Deserializable } from './deserializable.model';
import { Permission } from './permission';

export class Menu implements Deserializable {
  id?: number;
  name: string | undefined;
  slug: string;
  url: string;
  icon!: string;
  permissions_id!: Permission;
  belongsTo: string;
  divider: string;
  plataform: string;
  created_at: string;
  updated_at: string;

  deserialize(input): this {
    return Object.assign(this, input);
  }
}
