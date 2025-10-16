import { Role } from './role';
// src/app/models/user.model.ts

import { Deserializable } from './deserializable.model';
export class User implements Deserializable {
  id?: string;
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  // contato?: number;
  // is_active: boolean;
  // role_id: number;
  // role_name?: string;
  user_id?: string;
  // mail_notifications: boolean;
  roles?: Role;
  created_at?: string;
  updated_at?: string;

  deserialize(input: any): this {
    // Assign input to our object BEFORE deserialize our  to prevent already deserialized  from being overwritten.
    // Atribua entrada ao nosso objeto ANTES de desserializar nossos Objects para impedir que object já desserializados sejam substituídos.
    Object.assign(this, input);
    return this;
  }
}
