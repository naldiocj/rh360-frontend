import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EntidadesService } from '@resources/modules/sigae/core/entidades.service';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: ['./entidades.component.css']
})
export class EntidadesComponent implements OnInit {
  public ent: any = [];
public form !:FormGroup;
  public pagination = new Pagination();
  public totalBase: number = 0;
  public marcaId: any;
  public id: any;
  public carregando:boolean = false 
  private editar:any
  filtro = {
    page: 1,
    perPage: 10,
    search: "",
  };

  constructor(private entidades:EntidadesService ,
     private fb:FormBuilder) {}

  ngOnInit(): void {
    this.startForm()
    this.buscarMarcas();
  }

  private buscarMarcas() {
    const options = { ...this.filtro };

    // this.isLoading = true;
    this.entidades .listar(options)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
        this.ent = response.data;
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
    this.filtro.search = "";
    this.buscarMarcas();
    this.nullMarca()
  }


  public resetForm = (): void => {
    this.form.reset();
  };

  public filtrarPagina(key: any, $e: any) {
    if (key == "page") {
      this.filtro.page = $e;
    } else if (key == "perPage") {
      this.filtro.perPage = $e.target.value;
    } else if (key == "search") {
      this.filtro.search = $e;
    }

    this.buscarMarcas();
  }



  public startForm(){
 this.form=this.fb.group({
nome:[''],
sigla:[''],
descricao:[''],
 })
  }

  public setForm(item:object|any){
    this.editar=true;
    this.form.patchValue({
   nome:item.nome,
   sigla:item.nome,
   descricao:item.descricao,
    })
     }

  public nullMarca() {
    this.id = null;
  }

  public setId(item: any) {
    var {id}=item
    this.setForm(item)
    this.id = id;
    console.log(id)
  }

  public delete_(id: number) {
    this.carregando =  false
    console.log(id)
    this.entidades
   .deletar(id)
      .subscribe({
        next: () => {
          this.removeModal();
          this.recarregarPagina()
        },
      });
  }

  private removeModal() {
    $(".modal").hide();
    $(".modal-backdrop").hide();
  }

  On(){
   this.editar==true?this.onEdit():this.onSubmit;
  }

  public onSubmit() {
    this.carregando = true;
    this.editar = false;
 this.form.value.descricao==null?'sem texto':this.form.value.descricao;
    
  //  const type = this.marcaId
      this.entidades.registar(this.form.value)
      .subscribe({
        next: (): void => {
          this.resetForm();
this.removeModal()
         this.recarregarPagina()
        //  this.onSucess.emit({ success: true });
        },
      });
  }

  public onEdit() {
    this.carregando = true;
  //  const type = this.marcaId
      this.entidades.actualizar(this.id,this.form.value)
      .subscribe({
        next: (): void => {
          this.resetForm();
this.removeModal()
         this.recarregarPagina()
        //  this.onSucess.emit({ success: true });
        },
      });
  }















  
}
