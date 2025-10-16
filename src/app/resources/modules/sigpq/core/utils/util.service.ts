import { Injectable } from '@angular/core';
import { IziToastService } from '@core/services/IziToastService.service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(public iziToast: IziToastService) {}
  public tratamentoComposto = (key: any): any | null => {
    const estados: any = {
      saído: {
        nome: 'Saido',
      },
      despacho: {
        nome: 'Despacho',
      },
      pendente: {
        nome: 'Pendente',
      },
      expedido: {
        nome: 'Expedido',
      },
      pronunciamento: {
        nome: 'Pronunciamento',
      },
      Parecer: {
        nome: 'Parecer',
      },
    };
    return estados[key?.toString().toLowerCase()];
  };

  public tratamentoPedente(key: any) {
    return key?.toString().toLowerCase().includes('p');
  }
  public tratamentoDespacho(key: any) {
    return key?.toString().toLowerCase().includes('d');
  }
  public tratamentoExp(key: any) {
    return key?.toString().toLowerCase().includes('ex');
  }

  public validarCampo(form: any) {
    const objectos: any = {
      foto_civil: 'foto cívil',
      nome_completo: 'nome completo',
      data_nascimento: 'data de nascimento',

      genero: 'gênero',
      estado_civil_id: 'estado civil',
      naturalidade_id: 'província',
      municipio_id: 'muncicipio',
      distrito_id: 'distrito',
      residencia_bi: 'residência B.I',

      nid: 'B.I. N.º',
      data_expira: 'data de validade B.I.',
      data_emissao: 'data de emissão B.I',
      nome_pai: 'filiação (pai)',
      nome_mae: '(mãe)',
      local_nascimento: 'local de nascimento',

      numero_passaporte: 'passaporte N.º',
      data_expira_passaporte: 'data de validade ',
      patente_id: 'Posto/Categória',

      sigpq_acto_progressao_id: 'tipo de acto de provimento',
      numero_despacho: 'despacho n.º',
      numero_ordem: 'ordem n.º',
      data_despacho: 'data do despacho',
      data_ordem: 'data da ordem',
      anexo: 'anexo da ordem de serviço',

      data_despacho_nomeacao: 'data do despacho da nomeação',
      numero_despacho_nomeacao: 'despacho n.º da nomeação',
      sigpq_acto_nomeacao_id: 'tipo de acto da nomeação',
      sigpq_tipo_cargo_id: 'cargo',
      sigpq_tipo_funcao_id: 'função',
      anexo_nomeacao: 'anexo de ordem de serviço da nomeação',
      sigpq_tipo_categoria_id: 'classe/categoria',
      orgao_id: 'direcção / comando',
      tipo_orgao: 'tipo de órgão',

      departamento_id: 'departamento/comando provincial / unidade',
      seccao_id: 'secção / esquadra/subunidade',
      posto_id: 'posto policial',
      residencia_actual: 'residência actual',
      iban: 'IBAN',
      numero_carta_conducao: 'carta de condução n.º',
      data_expira_carta_conducao: 'data de validade da carta de condução',

      sigpq_tipo_habilitacao_literaria_id: 'Habilitações literárias',
      sigpq_tipo_curso_id: 'curso',

      habilitacao_literaria_certificado: 'anexo da habilitações literária',
      sigpq_tipo_sanguineo_id: 'grupo sanguíneo',
      contacto: 'contacto telefonico',
      contacto_alternativo: 'contacto telefonico alternativo',
      contacto_servico: 'contacto telefonico profissional',
      email: 'e-mail pessoal',
      // foto_efectivo: 'Foto do fardado',
      pseudonimo: 'pseudonimo',
      regime_id: 'regime de carreira',
      sigpq_tipo_vinculo_id: 'tipo de vínculo',
      // sigpq_vinculo_id: 'a seguir do tipo de vinculo',
      // sigpq_estado_id: 'a seguir da situacão laboral',
      // sigpq_estado_reforma_id: 'a seguir da situação laboral',
      sigpq_situacao_id: 'laboral situacao laboral',
      nip: 'nip',
      numero_agente: 'número  de agente',
      nps: 'número de proteção social',
      data_adesao: 'data de ingresso',
    };
    this.validarCampoComAlerta(form, objectos);
  }
  public validarDirecao(form: any) {
    const objectos: any = {
      nome_completo: 'nome',
      sigla: 'sigla',

      residencia_actual: 'endereço',
      contacto: 'telefone',
      email: 'e-mail',
      descricao: 'descricao',
    };
    this.validarCampoComAlerta(form, objectos);
  }
  public validarCampoComAlerta(form: any, objectos: any) {
    for (const [key, value] of Object.entries(objectos)) {
      const control = form.controls[key];
      if (!control || typeof control.status === 'undefined') continue;
      if (control.status == 'INVALID') {
        this.iziToast.alerta(`Preencha o campo ${value}`);
        break;
      }
    }
  }

  public isPromocao(text: string): boolean {
    if (!text) return false;
    return ['promoção'].includes(text.toString().toLowerCase());
  }

  public isGraducao(text: string): boolean {
    if (!text) return false;
    return ['graduação'].includes(text.toString().toLowerCase());
  }

  public isDesgraducao(text: string): boolean {
    if (!text) return false;
    return ['desgraduação'].includes(text.toString().toLowerCase());
  }

  public isDespromocao(text: string): boolean {
    if (!text) return false;
    return ['despromoção'].includes(text.toString().toLowerCase());
  }

  public isPatenteamento(text: string): boolean {
    if (!text) return false;
    return ['patenteamento'].includes(text.toString().toLowerCase());
  }

  public getActoVerbos(text: string): string | void {
    if (!text) return;
    const key: string = text.toString().toLowerCase();
    const verbos: { [key: string]: string } = {
      patenteamento: 'Posto a patentear',
      graduação: 'Posto a graduar',
      promoção: 'Posto a promover',
      desgraduação: 'Posto a desgraduar',
      despromoção: 'Posto a despromover',
    };

    if (!verbos.hasOwnProperty(key)) return;
    return verbos[key];
  }
}
