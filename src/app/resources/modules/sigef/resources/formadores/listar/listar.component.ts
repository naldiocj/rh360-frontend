import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { FormadoresService } from '@resources/modules/sigef/core/service/formadores.service';
import { FormadorModel } from '@resources/modules/sigef/shared/model/formador.model';
import { Pagination } from '@shared/models/pagination';
import { data } from 'jquery';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { finalize } from 'rxjs';


// npm install ngx-bootstrap --save Acabei de instalar essa lib


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  formadordados: FormadorModel = new FormadorModel();
  public pagination = new Pagination();
  formadores: any = []
  formador: any;
  id: number = 0
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ''
  }

  constructor(
    private funionariosService: FuncionarioService,
    private formadoresService: FormadoresService
  ) { }

  ngOnInit(): void {
    this.buscarFormadores();
  }

  buscarFormadores() {
    this.formadoresService
      .listar(this.filtro)
      .subscribe({
        next: (response: any) => {
          this.formadores = response.data;
          console.log(response);

          this.totalBase = response.meta.current_page
            ? response.meta.current_page === 1
              ? 1
              : (response.meta.current_page - 1) * response.meta.per_page + 1
            : this.totalBase;

          this.pagination = this.pagination.deserialize(response.meta);
        },
      });
  }

  novoFormador(){
    this.formador = new FormadorModel();
  }

  setFormador(item: FormadorModel){
    this.formador = item;
  }



  gerarPDF() {
    let pdf = new jsPDF('p', 'pt', 'a5');
    let ab = 'assets/img/insigniadarepublica.jpg';
    pdf.setFontSize(10);

    var x = 20;
    var y = 40;

    autoTable(pdf, {
      didDrawCell: (data) => {
        if(data.section === 'body' && data.column.index === 0){
          pdf.addImage(ab, 'jpg', data.cell.x + 2, data.cell.y + 2, 10, 10)
        }
      },
    })

    pdf.addImage(ab, 'jpg', x + 165, y, 30, 30);
    pdf.text('República de Angola', x + 135, y + 45);
    pdf.text('_________________', x + 135, y + 50);
    pdf.text('MINISTÉRIO DO INTERIOR', x + 120, y + 65);
    pdf.text('POLIÍCIA NACIONAL DE ANGOLA', x + 110, y + 82);

    pdf.text('Perfil do Formador', x + 10, y  + 150);
    pdf.setTextColor('#999999');
    pdf.text( `Nome completo: "${this.formadordados.formador_nome}"`, x + 10, y + 170);
    pdf.text( `NIP: "${this.formadordados.formador_nome}"`, x + 10, y + 185);
    pdf.text( `Patente: "${this.formadordados.formador_nome}"`, x + 10, y + 200);


    pdf.setTextColor('#000000');    
    pdf.text('Instituição de Ensino', x + 10, y + 240);
    pdf.setTextColor('#999999');
    pdf.text( `Instituição: "${this.formadordados.formador_nome}"`, x + 10, y + 260);
    pdf.text( `Curso: "${this.formadordados.formador_nome}"`, x + 10, y + 275);
    pdf.text( `Patente: "${this.formadordados.formador_nome}"`, x + 10, y + 292);




    pdf.output('dataurlnewwindow');
}

public Recarregar(){
  var filtro:any;
  this.filtro =  filtro = {
    page: 1,
    perPage: 10,
    regime: 1,
    search: '',
  }; 
}


  filtrarPagina (key: any, $e: any){
    if(key == 'page'){
      this.filtro.page = $e;
    }else if (key == 'perPage'){
      this.filtro.perPage = $e.target.value;
    }else if(key == 'search'){
      this.filtro.search = $e;
    }
  }

}