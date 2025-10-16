import { Deserializable } from './deserializable.model';

interface Modules { 
}

interface Orgao {
  id: number,
  nome_completo: string,
  sigla: string
}

interface Role {
  id: number,
  nome: string,
  name: string,
  created_at: Date,
  updated_at: Date
}

interface User {
  pessoas_id: 2,
  nome_completo: string,
  user_id: number,
  username: string,
  email: string,
  activo: boolean,
  forcar_alterar_senha: number,
  created_at: Date,
  updated_at: Date
}

export class Auth implements Deserializable {

  modules?: any;
  orgao?: Orgao;
  permissions?: any;
  pessoa?: any;
  role?: Role;
  user?: User;

  deserialize(input: any): this {
    // Assign input to our object BEFORE deserialize our  to prevent already deserialized  from being overwritten.
    // Atribua entrada ao nosso objeto ANTES de desserializar nossos Objects para impedir que object já desserializados sejam substituídos.
    Object.assign(this, input);
    return this;
  }
}
