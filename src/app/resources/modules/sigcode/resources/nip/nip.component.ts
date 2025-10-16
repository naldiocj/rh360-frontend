import { Component, OnInit } from '@angular/core';
import { NipService } from '../../core/service/nip.service';
import { DirecaoService } from '../../core/service/direcao.service';
import { AgentesService } from '../../core/service/agentes.service';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';

@Component({
  selector: 'app-nip',
  templateUrl: './nip.component.html',
  styleUrls: ['./nip.component.css'],
})
export class NipComponent implements OnInit {
  public direcao: any;
  public formNip!: FormGroup;
  public valor: any;
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
    private nipservice: NipService,
    private orgaoservice: DirecaoService,
    private agentes: AgentesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.forms();
  }

  public forms() {
    this.formNip = this.fb.group({
      pessoa_id: [''],
      orgao_id: [''],
      num_nip: [''],
      estado: ['1'],
    });
  }
  public evento($event: any) {
    var valor = $event.target.value;
  }

  public start() {
    if (this.valided()) {
      this.valided();
      this.date = new Date();
      this.date = this.date.getFullYear();
      this.index++;
      let numero =
        this.index.toString().padStart(4, '000') + this.getLastvalue(this.date);
      this.valor = numero;
      this.submit();
      if (this.valor >= 9999 + this.getLastvalue(this.date)) {
        alert('ja nao é possivel gera mais codigos NIPs');
        console.log('limite atingido');
      }
    }
  }

  private get getNIP() {
    return this.valor;
  }

  private valided() {
    if (this.orgao == null || this.direcao == null) {
      // this.alertas.info('Por favor!, Preencha o formulario!');
      return false;
    }
    return true;
  }

  public getLastvalue(correntYear: number) {
    //temporario codigo de pegar o ultimo valores do ano
    var ano = 2000;
    return correntYear - ano;
  }
  public submit() {
    this.formNip.value.num_nip = this.getNIP;
    this.nipservice.registar(this.formNip.value).subscribe((e) =>
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    );
  }

  selecionarOrgaoOuComandoProvincial($event: any): void {
    this.orgaoservice
      .listar({ tipo_orgao: $event })
      .subscribe((response: any): void => {
        console.log(response);
        this.direcao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
        console.log(this.direcao);
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
}
