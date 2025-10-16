import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { ApiService } from '@core/providers/http/api.service';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  public api: string = '/api/v1';
  public base: string = this.api + '/sigpq/funcionarios';

  constructor(private httpApi: ApiService) {}

  buscarUm(id: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }
  buscarFicha(id: any): Observable<any> {
    return this.httpApi.get(`${this.base}/${id}/ficha`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  listar(filtro: any): Observable<any> {
    return this.httpApi.get(`${this.base}`, filtro).pipe(
      debounceTime(2000), // Aumentado para reduzir chamadas
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  eliminar(id: any): Observable<any> {
    return this.httpApi.delete(`${this.base}/${id}`).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((response: Object): any => {
        return Object(response).object;
      })
    );
  }

  registar(form: any): Observable<any> {
    const formData: any = new FormData();

    // Validação de campos obrigatórios
    // const camposObrigatorios = [
    //   'nome_completo',
    //   'apelido',
    //   'data_nascimento',
    //   'genero',
    //   'nid',
    //   'sigpq_tipo_sanguineo_id',
    //   'naturalidade_id',
    //   'regime_id',
    //   'sigpq_tipo_vinculo_id',
    //   'sigpq_vinculo_id',
    //   'sigpq_estado_id',
    //   'sigpq_situacao_id',
    //   'nip',
    //   'numero_agente',
    //   'orgao_id',
    //   'patente_id',
    //   'data_adesao',
    // ];

    // Verificar campos obrigatórios
    // for (const campo of camposObrigatorios) {
    //   if (
    //     !form[campo] ||
    //     form[campo] === '' ||
    //     form[campo] === null ||
    //     form[campo] === undefined
    //   ) {
    //     throw new Error(`O campo ${campo} é obrigatório!`);
    //   }
    // }

    // Validação específica para números
    // const camposNumericos = [
    //   'naturalidade_id',
    //   'regime_id',
    //   'sigpq_tipo_vinculo_id',
    //   'sigpq_vinculo_id',
    //   'sigpq_estado_id',
    //   'sigpq_situacao_id',
    //   'numero_agente',
    //   'patente_id',
    //   'orgao_id',
    // ];

    // for (const campo of camposNumericos) {
    //   const valor = Number(form[campo]);
    //   if (isNaN(valor) || valor <= 0) {
    //     throw new Error(
    //       `O campo ${campo} deve ser um número válido maior que zero!`
    //     );
    //   }
    // }

    // Adicionar dados ao FormData com validação
    formData.append('foto_civil', form['foto_civil']);
    formData.append(
      'nome_completo',
      String(form['nome_completo'] ?? '').trim()
    );
    formData.append('apelido', String(form['apelido'] ?? '').trim());
    formData.append(
      'data_nascimento',
      String(form['data_nascimento'] ?? '').trim()
    );
    formData.append('genero', String(form['genero'] ?? '').trim());
    formData.append(
      'estado_civil_id',
      String(form['estado_civil_id'] ?? '').trim()
    );
    formData.append(
      'nome_conjunge',
      String(form['nome_conjunge'] ?? '').trim()
    );
    formData.append('nid', String(form['nid'] ?? '').trim());
    formData.append('data_expira', String(form['data_expira'] ?? '').trim());
    formData.append('data_emissao', String(form['data_emissao'] ?? '').trim());
    formData.append(
      'sigpq_tipo_sanguineo_id',
      String(form['sigpq_tipo_sanguineo_id'] ?? '').trim()
    );
    formData.append('naturalidade_id', Number(form['naturalidade_id']));
    formData.append(
      'residencia_bi',
      String(form['residencia_bi'] ?? '').trim()
    );
    formData.append(
      'residencia_actual',
      String(form['residencia_actual'] ?? '').trim()
    );
    formData.append('nome_pai', String(form['nome_pai'] ?? '').trim());
    formData.append('nome_mae', String(form['nome_mae'] ?? '').trim());
    formData.append(
      'numero_passaporte',
      String(form['numero_passaporte'] ?? '').trim()
    );
    formData.append(
      'data_expira_passaporte',
      String(form['data_expira_passaporte'] ?? '').trim()
    );
    formData.append('contacto', String(form['contacto'] ?? '').trim());
    formData.append(
      'contacto_alternativo',
      String(form['contacto_alternativo'] ?? '').trim()
    );
    // formData.append(
    //   'contacto_profissional',
    //   String(form['contacto_servico'] ?? '').trim()
    // );
    formData.append(
      'contacto_servico',
      String(form['contacto_servico'] ?? '').trim()
    );
    formData.append(
      'email_servico',
      String(form['email_institucional'] ?? '').trim()
    );
    formData.append('email', String(form['email'] ?? '').trim());
    formData.append('iban', String(form['iban'] ?? '').trim());
    formData.append(
      'numero_carta_conducao',
      String(form['numero_carta_conducao'] ?? '').trim()
    );
    formData.append(
      'data_expira_carta_conducao',
      String(form['data_expira_carta_conducao'] ?? '').trim()
    );
    formData.append(
      'sigpq_tipo_habilitacao_literaria_id',
      Number(form['sigpq_tipo_habilitacao_literaria_id'])
    );
    formData.append(
      'habilitacao_literaria_certificado',
      form['habilitacao_literaria_certificado']
    );
    formData.append('sigpq_tipo_curso_id', Number(form['sigpq_tipo_curso_id']));
    formData.append('municipio_id', Number(form['municipio_id']));
    formData.append('distrito_id', Number(form['distrito_id']));
    formData.append(
      'local_nascimento',
      String(form['local_nascimento'] ?? '').trim()
    );
    formData.append('nps', Number(form['nps']));

    formData.append('anexo', form['anexo']);
    formData.append('anexo_nomeacao', form['anexo_nomeacao']);

    formData.append('foto_efectivo', form['foto_efectivo']);
    formData.append('pseudonimo', String(form['pseudonimo'] ?? '').trim());
    formData.append('regime_id', Number(form['regime_id']));
    formData.append(
      'sigpq_tipo_vinculo_id',
      Number(form['sigpq_tipo_vinculo_id'])
    );
    formData.append('sigpq_vinculo_id', Number(form['sigpq_vinculo_id']));
    formData.append('sigpq_estado_id', Number(form['sigpq_estado_id']));
    formData.append(
      'sigpq_estado_reforma_id',
      Number(form['sigpq_estado_reforma_id'])
    );
    formData.append('sigpq_situacao_id', Number(form['sigpq_situacao_id']));
    formData.append('departamento_id', Number(form['departamento_id']));
    formData.append('seccao_id', Number(form['seccao_id']));
    formData.append('posto_id', Number(form['patente_id']));
    formData.append('nip', String(form['nip'] ?? '').trim());
    formData.append('numero_agente', Number(form['numero_agente']));
    formData.append('orgao_id', String(form['orgao_id'] ?? '').trim());
    formData.append('tipo_orgao', String(form['tipo_orgao'] ?? '').trim());
    formData.append(
      'sigpq_acto_progressao_id',
      Number(form['sigpq_acto_progressao_id'])
    );
    formData.append(
      'sigpq_acto_nomeacao_id',
      Number(form['sigpq_acto_nomeacao_id'])
    );
    formData.append('patente_id', Number(form['patente_id']));
    formData.append('data_ordem', String(form['data_ordem'] ?? '').trim());
    formData.append(
      'data_despacho',
      String(form['data_despacho'] ?? '').trim()
    );
    formData.append(
      'numero_despacho',
      String(form['numero_despacho'] ?? '').trim()
    );
    formData.append('numero_ordem', String(form['numero_ordem'] ?? '').trim());
    formData.append(
      'data_despacho_nomeacao',
      String(form['data_ordem'] ?? '').trim()
    );
    formData.append(
      'numero_despacho_nomeacao',
      String(form['numero_ordem'] ?? '').trim()
    );
    formData.append('sigpq_tipo_cargo_id', Number(form['sigpq_tipo_cargo_id']));
    formData.append(
      'sigpq_tipo_funcao_id',
      String(form['sigpq_tipo_funcao_id'] ?? '').trim()
    );
    formData.append(
      'sigpq_tipo_categoria_id',
      String(form['sigpq_tipo_categoria_id'] ?? '').trim()
    );
    formData.append('data_adesao', String(form['data_adesao'] ?? '').trim());

    // Adiciona o campo pessoajuridica_id usando o valor do órgão selecionado
    const pessoajuridicaId = Number(form['pessoajuridica_id']);
    if (!isNaN(pessoajuridicaId) && pessoajuridicaId > 0) {
      formData.append('pessoajuridica_id', pessoajuridicaId);
    } else {
      formData.append('pessoajuridica_id', '');
    }

    formData.append('seccao', String(form['seccao'] ?? '').trim());
    formData.append('brigada', String(form['brigada'] ?? '').trim());
    formData.append('tipo_orgao_id', String(form['tipo_orgao'] ?? '').trim());
    formData.append(
      'tipo_cargo_id',
      String(form['sigpq_tipo_funcao_id'] ?? '').trim()
    );

    // Log detalhado para debug
    const logPayload: any = {};
    formData.forEach((value: any, key: string) => {
      logPayload[key] = value;
    });
    console.log(
      'Payload enviado para o backend (FuncionarioService.registar):',
      logPayload
    );

    return this.httpApi.post2(`${this.base}`, formData).pipe(
      debounceTime(500),
      map((response: Object): any => {
        console.log('Resposta bruta do backend (registar):', response);
        const result = Object(response).object;
        console.log('Resultado processado (registar):', result);
        return result;
      })
    );
  }

  editar(id: any, form: any): Observable<any> {
    const formData: any = new FormData();

    // Validação de campos obrigatórios para edição
    const camposObrigatorios = [
      'nome_completo',
      // 'apelido',
      'data_nascimento',
      'genero',
      'nid',
      'sigpq_tipo_sanguineo_id',
      'naturalidade_id',
      'regime_id',
      // 'sigpq_tipo_vinculo_id',
      // 'sigpq_vinculo_id',
      // 'sigpq_estado_id',
      'sigpq_situacao_id',
      'nip',
      'numero_agente',
      'orgao_id',
      'patente_id',
      'data_adesao',
    ];

    // Verificar campos obrigatórios
    for (const campo of camposObrigatorios) {
      const valor = form.get(campo)?.value;
      if (!valor || valor === '' || valor === null || valor === undefined) {
        throw new Error(`O campo ${campo} é obrigatório!`);
      }
    }

    // Validação específica para números
    const camposNumericos = [
      'naturalidade_id',
      'regime_id',
      // 'sigpq_tipo_vinculo_id',
      // 'sigpq_vinculo_id',
      // 'sigpq_estado_id',
      'sigpq_situacao_id',
      'numero_agente',
      'patente_id',
      'orgao_id',
    ];

    for (const campo of camposNumericos) {
      const valor = Number(form.get(campo)?.value);
      if (isNaN(valor) || valor <= 0) {
        throw new Error(
          `O campo ${campo} deve ser um número válido maior que zero!`
        );
      }
    }

    // Adicionar dados ao FormData com validação
    formData.append('foto_civil', form.get('foto_civil')?.value);
    formData.append(
      'nome_completo',
      String(form.get('nome_completo')?.value).trim()
    );
    // formData.append('apelido', String(form.get('apelido')?.value).trim());
    formData.append(
      'data_nascimento',
      String(form.get('data_nascimento')?.value).trim()
    );
    formData.append('genero', String(form.get('genero')?.value).trim());
    formData.append(
      'estado_civil_id',
      String(form.get('estado_civil_id')?.value).trim()
    );
    formData.append(
      'nome_conjunge',
      String(form.get('nome_conjunge')?.value).trim()
    );
    formData.append('nid', String(form.get('nid')?.value).trim());
    formData.append(
      'data_expira',
      String(form.get('data_expira')?.value).trim()
    );
    formData.append(
      'data_emissao',
      String(form.get('data_emissao')?.value).trim()
    );
    formData.append(
      'sigpq_tipo_sanguineo_id',
      String(form.get('sigpq_tipo_sanguineo_id')?.value).trim()
    );
    formData.append(
      'naturalidade_id',
      Number(form.get('naturalidade_id')?.value)
    );
    formData.append(
      'residencia_bi',
      String(form.get('residencia_bi')?.value).trim()
    );
    formData.append(
      'residencia_actual',
      String(form.get('residencia_actual')?.value).trim()
    );
    formData.append('nome_pai', String(form.get('nome_pai')?.value).trim());
    formData.append('nome_mae', String(form.get('nome_mae')?.value).trim());
    formData.append(
      'numero_passaporte',
      String(form.get('numero_passaporte')?.value).trim()
    );
    formData.append(
      'data_expira_passaporte',
      String(form.get('data_expira_passaporte')?.value).trim()
    );
    formData.append('contacto', String(form.get('contacto')?.value).trim());
    formData.append(
      'contacto_alternativo',
      String(form.get('contacto_alternativo')?.value).trim()
    );
    // formData.append(
    //   'contacto_profissional',
    //   String(form.get('contacto_servico')?.value).trim()
    // );
    formData.append(
      'contacto_servico',
      String(form.get('contacto_servico')?.value).trim()
    );
    formData.append(
      'email_servico',
      String(form.get('email_institucional')?.value).trim()
    );
    formData.append('email', String(form.get('email')?.value).trim());
    formData.append('iban', String(form.get('iban')?.value).trim());
    formData.append(
      'numero_carta_conducao',
      String(form.get('numero_carta_conducao')?.value).trim()
    );
    formData.append(
      'data_expira_carta_conducao',
      String(form.get('data_expira_carta_conducao')?.value).trim()
    );
    formData.append(
      'sigpq_tipo_habilitacao_literaria_id',
      Number(form.get('sigpq_tipo_habilitacao_literaria_id')?.value)
    );
    formData.append(
      'habilitacao_literaria_certificado',
      form.get('habilitacao_literaria_certificado')?.value
    );
    formData.append(
      'sigpq_tipo_curso_id',
      Number(form.get('sigpq_tipo_curso_id')?.value)
    );
    formData.append('municipio_id', Number(form.get('municipio_id')?.value));
    formData.append('distrito_id', Number(form.get('distrito_id')?.value));
    formData.append(
      'local_nascimento',
      String(form.get('local_nascimento')?.value).trim()
    );
    formData.append('nps', Number(form.get('nps')?.value));

    formData.append('anexo', form.get('anexo')?.value);
    formData.append('anexo_nomeacao', form.get('anexo_nomeacao')?.value);

    formData.append('foto_efectivo', form.get('foto_efectivo')?.value);
    formData.append('pseudonimo', String(form.get('pseudonimo')?.value).trim());
    formData.append('regime_id', Number(form.get('regime_id')?.value));
    formData.append(
      'sigpq_tipo_vinculo_id',
      Number(form.get('sigpq_tipo_vinculo_id')?.value)
    );
    formData.append(
      'sigpq_vinculo_id',
      Number(form.get('sigpq_vinculo_id')?.value)
    );
    formData.append(
      'sigpq_estado_id',
      Number(form.get('sigpq_estado_id')?.value)
    );
    formData.append(
      'sigpq_estado_reforma_id',
      Number(form.get('sigpq_estado_reforma_id')?.value)
    );
    formData.append(
      'sigpq_situacao_id',
      Number(form.get('sigpq_situacao_id')?.value)
    );
    formData.append(
      'departamento_id',
      Number(form.get('departamento_id')?.value)
    );
    formData.append('seccao_id', Number(form.get('seccao_id')?.value));
    formData.append('posto_id', Number(form.get('posto_id')?.value));
    formData.append('nip', String(form.get('nip')?.value).trim());
    formData.append('numero_agente', Number(form.get('numero_agente')?.value));
    formData.append('orgao_id', String(form.get('orgao_id')?.value).trim());
    formData.append(
      'sigpq_acto_progressao_id',
      Number(form.get('sigpq_acto_progressao_id')?.value)
    );
    formData.append(
      'sigpq_acto_nomeacao_id',
      Number(form.get('sigpq_acto_nomeacao_id')?.value)
    );
    formData.append('patente_id', Number(form.get('patente_id')?.value));
    formData.append('data_ordem', String(form.get('data_ordem')?.value).trim());
    formData.append(
      'data_despacho',
      String(form.get('data_despacho')?.value).trim()
    );
    formData.append(
      'numero_despacho',
      String(form.get('numero_despacho')?.value).trim()
    );
    formData.append(
      'numero_ordem',
      String(form.get('numero_ordem')?.value).trim()
    );

    formData.append(
      'data_despacho_nomeacao',
      String(form.get('data_despacho_nomeacao')?.value).trim()
    );
    formData.append(
      'numero_despacho_nomeacao',
      String(form.get('numero_despacho_nomeacao')?.value).trim()
    );

    formData.append(
      'sigpq_tipo_cargo_id',
      Number(form.get('sigpq_tipo_cargo_id')?.value)
    );
    formData.append(
      'sigpq_tipo_funcao_id',
      String(form.get('sigpq_tipo_funcao_id')?.value).trim()
    );
    formData.append(
      'sigpq_tipo_categoria_id',
      String(form.get('sigpq_tipo_categoria_id')?.value).trim()
    );
    formData.append(
      'data_adesao',
      String(form.get('data_adesao')?.value).trim()
    );

    formData.append('seccao', String(form.get('seccao')?.value).trim());
    formData.append('brigada', String(form.get('brigada')?.value).trim());
    formData.append(
      'tipo_cargo_id',
      String(form.get('sigpq_tipo_funcao_id')?.value).trim()
    );
    formData.append(
      'tipo_orgao',
      String(form.get('tipo_orgao')?.value ?? '').trim()
    );

    // Adiciona o campo pessoajuridica_id usando o valor do órgão selecionado
    const pessoajuridicaId = Number(form.get('pessoajuridica_id')?.value);
    if (!isNaN(pessoajuridicaId) && pessoajuridicaId > 0) {
      formData.append('pessoajuridica_id', pessoajuridicaId);
    } else {
      formData.append('pessoajuridica_id', '');
    }
    // parte 1
    // formData.append('foto_civil', form.get('foto_civil')?.value);
    // formData.append('nome_completo', String(form.get('nome_completo')?.value).trim());
    // formData.append('apelido', String(form.get('apelido')?.value).trim());
    // formData.append('data_nascimento', String(form.get('data_nascimento')?.value).trim());
    // formData.append('genero', String(form.get('genero')?.value).trim());
    // formData.append('estado_civil_id', String(form.get('estado_civil_id')?.value).trim());
    // formData.append('nome_conjunge', String(form.get('nome_conjunge')?.value).trim());
    // formData.append('nid', String(form.get('nid')?.value).trim());
    // formData.append('data_expira', String(form.get('data_expira')?.value).trim());
    // formData.append('sigpq_tipo_sanguineo_id', String(form.get('sigpq_tipo_sanguineo_id')?.value).trim());
    // formData.append('naturalidade_id', Number(form.get('naturalidade_id')?.value));
    // formData.append('residencia_bi', String(form.get('residencia_bi')?.value).trim());
    // formData.append('residencia_actual', String(form.get('residencia_actual')?.value).trim());
    // formData.append('nome_pai', String(form.get('nome_pai')?.value).trim());
    // formData.append('nome_mae', String(form.get('nome_mae')?.value).trim());
    // formData.append('numero_passaporte', String(form.get('numero_passaporte')?.value).trim());
    // formData.append('data_expira_passaporte', String(form.get('data_expira_passaporte')?.value).trim());
    // formData.append('contacto', String(form.get('contacto')?.value).trim());
    // formData.append('email', String(form.get('email')?.value).trim());
    // formData.append('iban', String(form.get('iban')?.value).trim());
    // formData.append('numero_carta_conducao', String(form.get('numero_carta_conducao')?.value).trim());
    // formData.append('data_expira_carta_conducao', String(form.get('data_expira_carta_conducao')?.value).trim());
    // formData.append('sigpq_tipo_habilitacao_literaria_id', Number(form.get('sigpq_tipo_habilitacao_literaria_id')?.value));
    // formData.append('sigpq_tipo_curso_id', String(form.get('sigpq_tipo_curso_id')?.value).trim());
    // formData.append('pais_id', String(form.get('pais_id')?.value).trim());

    // formData.append("documento_familiar", JSON.stringify(form.get('documento_familiar')?.value) || []);
    // for (let i = 0; i < form.value?.documento_familiar_anexo.length; i++) {
    //     formData.append('documento_familiar_anexo' + [i], form.value?.documento_familiar_anexo[i] || [])
    // }

    // parte 3
    // formData.append('foto_efectivo', form.get('foto_efectivo')?.value);
    // formData.append('pseudonimo', String(form.get('pseudonimo')?.value).trim());
    // formData.append('regime_id', Number(form.get('regime_id')?.value));
    // formData.append('sigpq_tipo_vinculo_id', Number(form.get('sigpq_tipo_vinculo_id')?.value));
    // formData.append('estado', String(form.get('estado')?.value).trim());
    // formData.append('nip', String(form.get('nip')?.value).trim());
    // formData.append('numero_agente', Number(form.get('numero_agente')?.value));
    // formData.append('orgao_id', String(form.get('orgao_id')?.value).trim());
    // formData.append('patente_id', Number(form.get('patente_id')?.value));
    // formData.append('data_patenteamento', String(form.get('data_patenteamento')?.value).trim());
    // formData.append('numero_despacho', String(form.get('numero_despacho')?.value).trim());
    // formData.append('sigpq_tipo_cargo_id', Number(form.get('sigpq_tipo_cargo_id')?.value));
    // formData.append('sigpq_tipo_funcao_id', String(form.get('sigpq_tipo_funcao_id')?.value).trim());
    // formData.append('sigpq_tipo_categoria_id', String(form.get('sigpq_tipo_categoria_id')?.value).trim());
    // formData.append('data_adesao', String(form.get('data_adesao')?.value).trim());

    // parte 3
    // formData.append("processo_individual", JSON.stringify(form.get('processo_individual')?.value) || []);
    // for (let i = 0; i < form.value?.processo_individual_anexo.length; i++) {
    //     formData.append('processo_individual_anexo' + [i], form.value?.processo_individual_anexo[i] || [])
    // }

    // formData.append("processo_individual_parentes", JSON.stringify(form.get('processo_individual_parentes')?.value) || []);
    // for (let i = 0; i < form.value?.processo_individual_parentes_anexo.length; i++) {
    //     formData.append('processo_individual_parentes_anexo' + [i], form.value?.processo_individual_parentes_anexo[i] || [])
    // }

    // formData.append("outros_dados[]", JSON.stringify(form.get('outros_dados')?.value) || []);
    // enviar vários anexos
    // for (let i = 0; i < form.value.outros_dados_anexos.length; i++) {
    //     formData.append('outros_dados_anexos' + [i], form.value.outros_dados_anexos[i] || [])
    // }

    // parte 4
    // formData.append("meios", JSON.stringify(form.get('meios')?.value) || []);

    return this.httpApi.put2(`${this.base}/${id}`, formData).pipe(
      debounceTime(500),
      map((response: any): any => {
        console.log('Resposta bruta do backend (editar):', response);
        const result = response.object;
        console.log('Resultado processado (editar):', result);
        return result;
      })
    );
  }

  editarEstado(id: any, form: any): Observable<any> {
    return this.httpApi.patch(`${this.base}/${id}/editarEstado`, form).pipe(
      debounceTime(500),
      map((response: any): any => {
        return response.object;
      })
    );
  }

  alterarFoto(form: any): Observable<any> {
    const funcionario_id = Number(form.get('funcionario_id')?.value);
    const formData: any = new FormData();
    formData.append('foto_civil', form.get('foto_civil')?.value);
    formData.append('foto_efectivo', form.get('foto_efectivo')?.value);

    return this.httpApi
      .patch(`${this.base}/${funcionario_id}/editarFoto`, formData)
      .pipe(
        debounceTime(500),
        map((response: Object): any => {
          return Object(response).object;
        })
      );
  }
}
