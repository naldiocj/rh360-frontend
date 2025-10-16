import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SolicitacaoPaToSigt } from '@core/services/SolicitacaoAgente-SIGT.service';
import { ModuloService } from '@core/services/config/Modulo.service';
import { DirecaoOuOrgaoService } from '@shared/services/config/DirecaoOuOrgao.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-solicitacao-sigt-marcacoes-veiculos',
  templateUrl: './solicitacao-sigt-marcacoes-veiculos.component.html',
  styleUrls: ['./solicitacao-sigt-marcacoes-veiculos.component.css']
})
export class SolicitacaoSigtMarcacoesVeiculosComponent implements OnInit {

  public direcaoOuOrgao: Array<Select2OptionData> = [];
  public modulos: Array<Select2OptionData> = []


  @Output() eventRegistarOuEditModel = new EventEmitter<boolean>();

  @Input() public solicitacoes: any = null



  simpleForm!: FormGroup


  public options: any = {
    placeholder: 'Selecione uma opção',
    width: '100%'
  }

  
  public orgaoOuComandoProvincial: Array<Select2OptionData> = [
    { id: '', text: 'Selecione uma opção' },
    { id: 'Comando Provincial', text: 'Comando Provincial' },
    { id: 'Orgão', text: 'Orgão Central' },
  ];

  constructor(
    private direcaoOuOrgaoService: DirecaoOuOrgaoService,
    private fb: FormBuilder,
    private moduloService: ModuloService,
    private patosigt: SolicitacaoPaToSigt
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.buscarModulo();
  }

  public isLoading: boolean = false;




  selecionarOrgaoOuComandoProvincial($event: any): void {
    const opcoes = {
      tipo_orgao: $event,
    };
    this.direcaoOuOrgaoService
      .listarTodos(opcoes)
      .pipe(finalize((): void => {}))
      .subscribe((response: any): void => {
        this.direcaoOuOrgao = response.map((item: any) => ({
          id: item.id,
          text: item.sigla + ' - ' + item.nome_completo,
        }));
      });
  }


  private buscarModulo() {
    this.moduloService
      .listar({})
      .pipe(finalize((): void => {}))
      .subscribe({
        next: (response: any) => {
          this.modulos = response.map((item: any) => ({
            id: item.id,
            text: item.sigla + ' - ' + item.nome,
          }));
        },
      });
  }



  createForm(){
    this.simpleForm = this.fb.group({
      matricula_id: ['', Validators.required],
      pessoajuridica_id: ['', Validators.required],
      pessoafisica_id: ['', Validators.required],
      data_intervencao: ['', Validators.required],
    })
  }


  OnSubmit(){

    this.isLoading = true;
    const type = this.buscarId()
    ? this.patosigt.editar(this.simpleForm.value, this.buscarId())
    : this.patosigt.registar(this.simpleForm.value);

    type
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe(() => {
      this.removerModal();
      this.eventRegistarOuEditModel.emit(true);
    });
  }


  buscarId(): number {
    return this.solicitacoes?.id;
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

}