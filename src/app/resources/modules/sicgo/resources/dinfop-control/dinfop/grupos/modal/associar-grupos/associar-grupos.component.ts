import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FicheiroService } from '@core/services/Ficheiro.service';
import { ObjectoCrimeService } from '@resources/modules/sicgo/core/config/ObjectoCrime.service';
import { AssociarGrupoComGrupoService } from '@resources/modules/sicgo/core/service/piquete/associacao/associar-grupo-com-grupo/associar-grupo-com-grupo.service';
import { DelituosoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/cart.service';
import { DinfopGrupoDelitousoService } from '@resources/modules/sicgo/core/service/piquete/dinfop/grupo_delitouso.service';
import { Select2OptionData } from 'ng-select2';
import { Validators } from 'ngx-editor';
import { finalize } from 'rxjs';

interface Grupo {
  id: number;
  nome: string;
  // Outros campos do grupo, conforme necessário
}

@Component({
  selector: 'sicgo-dinfop-associar-grupos',
  templateUrl: './associar-grupos.component.html',
  styleUrls: ['./associar-grupos.component.css']
})
export class AssociarGruposComponent implements OnInit {
  receivedData: string | any;
  currentStep = 1;
  totalBase: any;
  pagination: any;
  receiveData(data: string) {
    this.receivedData = data;
  }
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };
  optionsMultiplo: any = {
    placeholder: "Selecione uma opção",
    width: '100%',
    multiple: true
  }
  @Input() grupoSelecionados: any = [];
  @Input() grupoId: any = 0;
  @Input() delituosoId: any = 0;
  @Output() eventRegistarOuEditar  = new EventEmitter<any>();
 

  form: FormGroup;
  fileUrlFrontal: string | null = null;
  fileUrlLateralDireita: string | null = null;
  fileUrlLateralEsquerda: string | null = null;
  isLoading: boolean | undefined;
  fileUrl: any;
  idade: number | null = null;
  fotodfault = './assets/assets_sicgo/img/logopolice.png';

  grupos: any[] = []; // Lista de delituosos
  selectedGrupos: number[] = []; // IDs dos delituosos selecionados
  grupo: any;
  public objectoCrimes: Array<Select2OptionData> = [];

  constructor(
    private associarGrupos: AssociarGrupoComGrupoService,
    private objectoCrimeService: ObjectoCrimeService,
    private dinfopGrupoService: DinfopGrupoDelitousoService,
    private fb: FormBuilder,
    private grupoS: DelituosoService
  ) {
    this.form = this.fb.group({
      local_atuacao: ['', Validators.required],
      ponto_concentracao: ['', Validators.required],
      hora_concentracao: ['', Validators.required],
      hora_atuacao: ['', Validators.required],
      meios_id: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    // this.buscarDelituoso();
    this.buscarObjectoCrime();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupoId'] && this.grupoId) {
      this.buscarGrupos();
    }
  }




  buscarGrupo() {
    const id = Number(this.grupoId); // Converte para número
    if (isNaN(id)) {

      return; // Ou trate de forma adequada
    }

    this.dinfopGrupoService
      .ver(id) // Passa o ID convertido
      .pipe(finalize(() => { /* Aqui você pode esconder um loader se necessário */ }))
      .subscribe({
        next: (response: any) => {
          if (Array.isArray(response)) {
            this.grupo = response; // Atribui diretamente se for um array
          } else {
            this.grupo = [response]; // Converte o objeto em um array para evitar o erro
          }



        },
        error: (err) => {
          console.error('Erro ao buscar delituoso:', err);
          // Você pode mostrar uma mensagem de erro ao usuário aqui
        }
      });
  }

  buscarGrupos() {
    this.isLoading = true;

    this.dinfopGrupoService.listarTodos({})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response) => {
        // Filtrar grupos para remover o grupo com o id igual ao grupoId
        this.grupos = response.filter((grupo: any) => grupo.id !== this.grupoId);

        // Configurar a base de paginação
        this.totalBase = response.meta.current_page
          ? response.meta.current_page === 1
            ? 1
            : (response.meta.current_page - 1) * response.meta.per_page + 1
          : this.totalBase;

        // Atualizar a paginação
        this.pagination = this.pagination.deserialize(response.meta);
      });
  }


  buscarObjectoCrime() {
    const options = {};
    this.objectoCrimeService
      .listarTodos(options)
      .pipe(finalize(() => { }))
      .subscribe({
        next: (response: any) => {
          this.objectoCrimes = response.map((item: any) => ({
            id: item.id,
            text: item.nome,
          }));
        },
      });
  }



  toggleDelituoso(grupoId: number, event: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedGrupos.push(grupoId);
    } else {
      this.selectedGrupos = this.selectedGrupos.filter(id => id !== grupoId);
    }
  }




  submitAssociacao(): void {
    this.nextStep();
  }

  canAssociacaoSubmit(): boolean {
    return this.selectedGrupos.filter((field) => field.valueOf.length > 0)
      .length !== 3
      ? true
      : false;
  }


  // Progresso em %
  getProgressPercent(): number {
    return (this.currentStep / 2) * 100;
  }

  // Manipulação de passos
  nextStep(): void {
    if (this.currentStep < 2) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }


  addGrupoToGrupo(): void {
    if (this.form.valid) {
      const grupoData = this.form.value;

      // Confirme que os IDs dos delituosos estão presentes
      console.log('Grupos selecionados:', this.grupoSelecionados);

      this.associarGrupos.addGrupoToGrupos(this.grupoSelecionados, this.grupoId, grupoData)
        .subscribe({
          next: (response) => {
            this.eventRegistarOuEditar.emit(true);
            console.log('Formulário enviado com sucesso:', response);
            this.currentStep = 3;
            setTimeout(() => {
              window.location.reload();
            }, 15);
          },
          error: (error) => {
            console.error('Erro ao adicionar delituosos:', error);
          }
        });
    } else {
      console.log('Formulário inválido');
    }
  }

  removeGrupos(): void {
    this.associarGrupos.removeGrupo(this.grupoSelecionados, this.grupoId)
      .subscribe({
        next: (response) => {
          console.log('Grupos removidos:', response);
          // Adicionar lógica para mostrar mensagem de sucesso
        },
        error: (error) => {
          console.error('Erro ao remover grupos:', error);
        }
      });
  }

  // Calcular idade
  calculateAge(birthDate: string | Date): void {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();
    this.idade = today.getFullYear() - birth.getFullYear();

    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      this.idade--;
    }
  }

  selecionarGrupoParaGrupo(item: any): void {
    const conjuntoUnico = new Set(this.grupoSelecionados);
    const index = conjuntoUnico.has(item);
    if (!index) {
      conjuntoUnico.add(item);
    } else {
      conjuntoUnico.delete(item);
    }
    this.grupoSelecionados = Array.from(conjuntoUnico);
  }

  validarSelecionado(id: number | undefined): boolean {
    return !!this.grupoSelecionados.find((o: any) => o.id === id);
  }

  limparVariaveis(): void {
    this.grupoSelecionados = [];
  }

  removerDelituosoSelecionado(item: any): void {
    const posicao = this.grupoSelecionados.findIndex((o: any) => o.id === item.id);
    if (posicao !== -1) {
      this.grupoSelecionados.splice(posicao, 1);
    }
  }

  
}


