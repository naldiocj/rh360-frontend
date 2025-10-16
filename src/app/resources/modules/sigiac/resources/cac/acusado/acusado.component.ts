import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioService } from '@core/services/Funcionario.service';
import { AcusadoService } from '@resources/modules/sigiac/core/service/Acusado.service'; 
import { Funcionario } from '@shared/models/Funcionario.model';
import { Pagination } from '@shared/models/pagination';
import { finalize } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'sigiac-acusado',
  templateUrl: './acusado.component.html',
  styleUrls: ['./acusado.component.css'],
})
export class AcusadoComponent implements OnInit {
  inicializador2!: string;
  private inicializador = 'piis_v2';  
  idDecifrado!: string;
  public acusados: Funcionario[] = [];
  @Input()  dadosFormAcusado:any   
  public pagination = new Pagination();
  totalBase: number = 0;
  id_queixa!: string;
  listedArguido: boolean = false; 
  arguidoForm!: FormGroup;
  public funcionarios:Funcionario[] = [];

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: '',
  };

  constructor(
    private funcionarioServico: FuncionarioService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private acusadoservice: AcusadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.buscarFuncionarios()
    // this.preSettedArguido()
  }

  criarFormulario() {
    this.arguidoForm = this.fb.group({
      Funcionario_id: ['', [Validators.required]],
    });
  }

  public get getId() {
    return this.route.snapshot.params['id'] as number;
  } 
  buscarFuncionarios() { 
    // this.isLoading = true;
    this.funcionarioServico
      .listar(this.filtro)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((response) => {
       // console.log("Rebuscar funcionarios", response)
        this.funcionarios = response.data

        
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        this.pagination = this.pagination.deserialize(response.meta);

      });
  }

  verifyArguido(acusado: any) {
   
    // console.log('dados do arguido', acusado)
    this.acusadoservice.verUm(acusado.id)
      .subscribe((response) => {
        if (!response || response === null || response === undefined) {
          this.acusados.push(acusado);
          return;
        }

        window.alert('Acusado já existe!');
        return
      });

  }
 

  addacusados() {

    this.route.paramMap.subscribe(params => {  
      this.id_queixa = params.get('id') || '';
      //alert('ID codificado:' + this.id_queixa);
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(this.id_queixa), this.inicializador);
      this.idDecifrado = bytes.toString(CryptoJS.enc.Utf8);
     // alert('novo ID decifrado:' + this.idDecifrado);
    });
    let nome_completo_acusado = document.getElementById('nome_completo_acusado')!.textContent;
    let id_acusado = document.getElementById('id_acusado')!.textContent;
    let orgao_acusado = document.getElementById('orgao_acusado')!.textContent;
    let apelido_acusado = document.getElementById('apelido_acusado')!.textContent;
    let patente_nome_acusado = document.getElementById('patente_nome_acusado')!.textContent;
    let nip_acusado = document.getElementById('nip_acusado')!.textContent;
    let genero_acusado = document.getElementById('genero_acusado')!.textContent;
    let idDecifrado = this.idDecifrado;

  //  alert(nome_completo_acusado); 
       $("#btn-processando").show();
      // $("#tabela-acusado").hide();
      $("#btn-adicionar-acusado").hide();
    if (this.idDecifrado == '') {
      window.alert('selecione primeiro!');
      $("#btn-adicionar-acusado").hide();
      //$("#tabela-acusado").hide();
      return;
    }

    const inputs = {
      //dados acusado
      nome_completo_acusado: nome_completo_acusado, 
      id_acusado: id_acusado,
      orgao_acusado: orgao_acusado,
      apelido_acusado: apelido_acusado,
      patente_nome_acusado: patente_nome_acusado,
      nip_acusado: nip_acusado,
      genero_acusado: genero_acusado, 
      idDecifrado: idDecifrado,
      
    }

    this.acusadoservice.registarAcusado(inputs)

    .subscribe((value) => {
      
     // this.router.navigate(['/piips/sigiac/queixa/listagem'])
    })
     
       setInterval(() => {
        $("#btn-processando").hide();
    }, 2000);
     
    /*const options = {
      object: this.acusados,
      queixoso_id: this.getId,
    };

    // console.log('atribuido', item);

    this.acusadoservice
      .registar(options)
      .pipe(finalize(() => {}))
      .subscribe((item) => {
        this.router.navigate(['/piips/sigiac/queixa/listagem']);
      });*/
  }

  
  selectedFuncionario(response:any){
    //console.log("selecionado", response)
   /* this.listedArguido = false
    this.acusados.forEach(item=>{
      if(item.id === response.id){
        this.listedArguido = true
        alert('Ja atribuido');
        return;
      }
    }) 
     if (this.listedArguido) { 
       return;
     } 
     this.verifyArguido(response);
 */
    //alert("Adicionado " + response.orgao.nome);  
    $("#btn-adicionar-acusado").show();
    $("#tabela-acusado").show();
    $("#btn-processando").hide();

    
     if (document.getElementById("nome_completo_acusado")) {
      document.getElementById("nome_completo_acusado")!.innerText = response.nome_completo;
       }
     document.getElementById("apelido_acusado")!.innerText = response.apelido ;
     document.getElementById("patente_nome_acusado")!.innerText = response.patente_nome ;
     document.getElementById("nip_acusado")!.innerText = response.nip;
     document.getElementById("genero_acusado")!.innerText = response.genero;
     document.getElementById("id_acusado")!.innerText = response.id;
     document.getElementById("orgao_acusado")!.innerText = response.orgao.nome;


       }

   recarregarPagina() {
    this.filtro.page = 1;
    this.filtro.perPage = 5;
    this.filtro.search = '';
    this.buscarFuncionarios();
  }

  filtrarPagina(key: any, $e: any) {
    if (key == 'page') {
      this.filtro.page = $e;
    } else if (key == 'perPage') {
      this.filtro.perPage = $e.target.value;
    } else if (key == 'search') {
      this.filtro.search = $e;
    }
    this.buscarFuncionarios();
  }

 
}
