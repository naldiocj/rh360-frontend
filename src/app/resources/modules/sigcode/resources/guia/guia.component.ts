import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { NipService } from '../../core/service/nip.service';
import { DirecaoService } from '../../core/service/direcao.service';
import { AgentesService } from '../../core/service/agentes.service';
import { error } from 'jquery';
import { GuiaService } from '../../core/service/guia.service';

@Component({
  selector: 'app-guia',
  templateUrl: './guia.component.html',
  styleUrls: ['./guia.component.css'],
})
export class GuiaComponent implements OnInit {
  public direcao: any;
  public direcao2: any;
  public formGuia!: FormGroup;
  public valor: any;
  private destinoInicial!: string;
  private destinoFinal!: string;
  public options: any = {
    placeholder: 'seleccione uma opçao',
    width: '100%',
  };
  public data: Array<Select2OptionData> = [];
  public typeCartao: Array<Select2OptionData> = [
    { id: '1', text: 'Interno' },
    { id: '2', text: 'Externo' },
    { id: '3', text: 'Profissional' },
  ];
  public filtro = {
    page: 1,
    perPage: 10,
    search: '',
  };
  public direcoes: Array<Select2OptionData> = [
    { id: '', text: '--Selecione uma opçao--' },
    { id: 'Orgao', text: 'Orgao Central' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
  ];
  public nip_value: any;
  public date: any;
  public index: number = 0;
  public orgao: any;

  constructor(
    private guiaservice: GuiaService,
    private orgaoservice: DirecaoService,
    private agentes: AgentesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.forms();
  }

  public forms() {
    this.formGuia = this.fb.group({
      pessoa_id: [''],
      orgao_id: [''],
      num_guia: [''],
      descricao: ['inseriçao de dados de Guia '],
      estado: ['1'],
    });
  }
  public evento($event: any) {
    var valor = $event;
  }

  public start() {
    if (this.valided()) {
      return error('o formulario esta vazio!');
    } else {
      this.submit();
    }
  }

  private get getGuia() {
    const ano: any = new Date();
    return (
      this.destinoInicial +
      '/' +
      ano.getFullYear() +
      '-' +
      this.formGuia.value.orgao_id
    );
  }

  private valided() {
    if (this.orgao == null || this.direcao == null) {
      // this.alertas.info('Por favor!, Preencha o formulario!');
      return true;
    }
    return false;
  }

  public setInicial(event: any) {
    this.destinoInicial = event;
  }

  public setFinal(event: any) {
    this.destinoFinal = event;
  }
  public getLastvalue(correntYear: number) {
    //temporario codigo de pegar o ultimo valores do ano
    var ano = 2000;
    return correntYear - ano;
  }
  public submit() {
    this.valor = this.formGuia.value.num_guia = this.getGuia;
    console.log(this.formGuia.value);
    this.guiaservice.registar(this.formGuia.value).subscribe((e: any) =>
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    );
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    console.log($event);

    this.orgaoservice
      .listar({ tipo_orgao: $event })

      .subscribe((response: any): void => {
        this.direcao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
        console.log(this.direcao);
      });
  }

  selecionarOrgaoOuComandoProvincial1($event: any): void {
    this.destinoFinal = $event;
    this.orgaoservice
      .listar({ tipo_orgao: $event })
      .subscribe((response: any): void => {
        console.log(response);
        this.direcao2 = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
        console.log(this.direcao2);
      });
  }

  selecionarAgente($event: any) {
    console.log($event);
    var orgao = this.agentes.listar({ pessoajuridica_id: $event }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.orgao = res.map(
          (p: any) => ({
            id: p.id,
            text: p.nome + '-' + p.apelido,
          }),
          console.log(orgao)
        );
        console.log(this.orgao);
      },
    });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
  }
  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    // this.mostrar_organicas(this.filtro.search);
  }
}
