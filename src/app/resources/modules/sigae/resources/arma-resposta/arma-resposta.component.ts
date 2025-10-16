import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import { HelpingService } from '../../core/helping.service';
import { RespostasService } from '../../core/respostas.service';

@Component({
  selector: 'app-arma-resposta',
  templateUrl: './arma-resposta.component.html',
  styleUrls: ['./arma-resposta.component.css']
})
export class ArmaRespostaComponent implements OnInit {

  @Output() public onSucess!: EventEmitter<any>;
  @Input() public id: any;
  public selecionado: any = false;


  public entidade: any;
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
  };
  public arma: any = [];
  color!: string;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public carregando: boolean = false;
  public form!: FormGroup;
  public formAt!: FormGroup;
  protected getPathCaminho:any
  protected is!: number;
  constructor(private armas: RespostasService, private help: HelpingService) {}

  ngOnInit(): void {
    this.buscarArmas();
    this.is = this.help.isUser;
  }

  private buscarArmas() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.armas
      .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.arma = response.data;
        this.pagination = this.pagination.deserialize(response.meta);
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }

  public recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 10;
    this.filtro.search = '';
    this.buscarArmas();
  }

  public filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }

    this.buscarArmas();
  }

  public resetForm = (): void => {
    this.form.reset();
  };

  private removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }

  public get(id: any) {
    this.id = id;
  }
  public delete_(id: any) {
    this.armas.deletar(id).subscribe(() => this.actualizarPagina());
  }

  public actualizarPagina() {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  public obj(item: any) {
    this.fillForm(item);
  }

  public fillForm(data: any) {
    this.form.patchValue({
      descricao: data.descricao,
      livrete: data.livrete,
      estado: data.estado,
      classificacao_arma_id: data.classificacao_id,
      serie: data.serie,
      modelo_id: data.tipo_id,
      marca_arma_id: data.marca_id,
      calibre_arma_id: data.calibre_id,
      pai_id: data.pai_id,
      id: data.id,
      ano_fabrico: data.ano_fabrico,
    });
  }


  public getFileInformation(id:any,url:any){
    this.getPathCaminho=this.help.pegarFicheiroCaminho(id,url);
  }

  public baixarFile(url:any){
    console.log(url)
  window.open(url.changingThisBreaksApplicationSecurity,"_blank")
  }
}
