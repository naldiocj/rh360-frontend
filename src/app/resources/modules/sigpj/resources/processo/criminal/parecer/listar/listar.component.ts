import { Component, OnInit,} from '@angular/core';
import { Pagination } from '@shared/models/pagination';

import { FormControl, FormGroup } from '@angular/forms'
import { shareReplay } from 'rxjs';

 

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'],                                         // remove formatting button

    ['link', 'image', 'video']                         // link and image, video
  ]
};

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {
  editorContent: string = '';

  content!: string;
   
  templateForm: FormGroup;
  textEditor: FormControl<string | null>;
    
  // quillModules: QuillModules = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike'], // opções de formatação de texto
  //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // opções de cabeçalho
  //     [{ 'align': [] }], // opções de alinhamento de texto
  //     ['link', 'image'], // opções de link e imagem
  //     [{ 'list': 'ordered' }, { 'list': 'bullet' }], // opções de lista
  //     ['clean'], // opção para remover formatação
  //     [{ 'indent': '-1' }, { 'indent': '+1' }], // opções de recuo
  //     [{ 'direction': 'rtl' }], // opção para texto da direita para a esquerda
  //     [{ 'size': ['small', false, 'large', 'huge'] }], // opções de tamanho de fonte
  //     [{ 'color': [] }, { 'background': [] }], // opções de cor de texto e fundo
  //     [{ 'font': [] }], // opções de tipo de fonte

  //   ]
  // };
  // modules = {
  //   toolbar: [
  //     ['bold', 'italic', 'underline', 'strike'], // opções para formatação de texto
  //     [{ 'list': 'ordered' }, { 'list': 'bullet' }], // opções para listas
  //     [{ 'align': [] }], // opções para alinhamento de texto
  //     [{ 'color': [] }, { 'background': [] }], // opções para cores de texto e de fundo
  //     [{ 'font': [] }], // opções para fontes
  //     [{ 'size': [] }], // opções para tamanho de texto
  //   ],
  //   // opção para parágrafo
  //   // OBS: o nome da propriedade deve ser "formats" e não "format" como no seu código
  //   formats: {
  //     paragraph: "html",
  //   },
  // };
 
  

























  
  public isLoading: boolean = false
  public pagination = new Pagination();
  totalBase: number = 0

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }

  
  constructor() {
    

    this.textEditor = new FormControl("");

    this.templateForm = new FormGroup({
      textEditor: this.textEditor
    });
  }


  ngOnInit() {

    // this.buscarFuncionario()
  }

  // buscarFuncionario() {

  //   this.isLoading = true;
  //   this.funcionarioServico.listar(this.filtro).pipe(
  //     finalize(() => {
  //       this.isLoading = false;
  //     })
  //   ).subscribe((response) => {

  //     this.funcionarios = response.data;

  //     this.totalBase = response.meta.current_page ?
  //       response.meta.current_page === 1 ? 1
  //         : (response.meta.current_page - 1) * response.meta.per_page + 1
  //       : this.totalBase;

  //     this.pagination = this.pagination.deserialize(response.meta);
  //   });
  // }

  filtrarPagina(key: any, $e: any) {

    //   if (key == 'page') {
    //     this.filtro.page = $e;
    //   } else if (key == 'perPage') {
    //     this.filtro.perPage = $e.target.value;
    //   } else if (key == 'search') {
    //     this.filtro.search = $e;
    //   }
    //   this.buscarFuncionario()
  }

  recarregarPagina() {
    //   this.filtro.page = 1
    //   this.filtro.perPage = 5
    //   this.filtro.search = ''
    //   this.buscarFuncionario()
  }

  construcao() {
    alert('Em construção')
  }







  
}
