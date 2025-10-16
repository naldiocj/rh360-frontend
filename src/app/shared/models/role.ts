import { Deserializable } from './deserializable.model';
import { Permission } from './permission';

export class Role implements Deserializable {
  id?: string;
  module_id?: string;
  user_id?: string;
  nome?: string;
  name?: string;
  active?: boolean;
  permissions?: Permission[];
  system?: boolean;
  description?: string;

  deserialize(input:any): this {
    return Object.assign(this, input);
  }
}
