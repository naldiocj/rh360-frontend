 
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnDestroy,
  OnChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { EstadoCivilService } from '@core/services/EstadoCivil.service';
import { RegimeService } from '@core/services/Regime.service';
import { finalize } from 'rxjs/operators';
import { Select2OptionData } from 'ng-select2';
import { PaisService } from '@core/services/Pais.service'; 
import { UtilizadorService } from '@core/services/config/Utilizador.service';
import { PerfilService } from '../../../../core/service/Perfil.service';
@Component({
  selector: 'sigpj-registar-ou-editar-perfil',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css']
})
export class RegistarOuEditarComponent implements OnChanges {
 

  @Output() eventoRegistarOuEditarPerfil = new EventEmitter<boolean>()
  @Input() utilizador: any
  simpleForm: any

  isLoading: boolean = false
  submitted: boolean = false
 
  perfis: Array<Select2OptionData> = [] 

  options: any = { 
    placeholder: "Selecione uma opção",
    width: '100%'
  };

  
  constructor(
    private fb: FormBuilder, 
    private perfilService: PerfilService,  
   
    ) { }

  ngOnChanges(): void { 
    this.createForm()
    
    if(this.lerId()){
      this.editarUtilizador()
    }
  }

  lerId() {
    return this.utilizador?.id
  }

  createForm() {
    this.simpleForm = this.fb.group({
      nome: [null, [Validators.required, Validators.minLength(5)]],
      name: [null, [Validators.required, Validators.minLength(5)]],
      descricao: [null], 
    })

   
  }

  editarUtilizador() {
   // console.log(this.utilizador);

    this.simpleForm.patchValue({
      id: this.utilizador.id,
      nome: this.utilizador.nome,
      name: this.utilizador.name,
      descricao: this.utilizador.descricao, 
    })
  }

  onSubmit() {
 
   // console.log("id do perfil", this.lerId())
    this.isLoading = true
    this.submitted = true 
    const type = this.perfilService 
    this.lerId()?  type.editar( 
      this.simpleForm.value,this.lerId()
      )
      .pipe(
      finalize(() => {
        this.isLoading = false
        this.submitted = false
      })
    ).subscribe(() => {
      this.removerModal()
      this.onReset()
      this.eventoRegistarOuEditarPerfil.emit(true)  
    })
    :type.registar(this.simpleForm.value).pipe(
      finalize(() => {
        this.isLoading = false
        this.submitted = false
      })
    ).subscribe(() => {
      this.removerModal()
      this.onReset()
      this.eventoRegistarOuEditarPerfil.emit(true) 
    })
  }
  
  
  onReset(): void {
    this.simpleForm.reset()
    this.isLoading = false
  }

  removerModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
    // $('body').removeClass("modal-open");
  }

  ngOnDestroy(): void {
  }
  
}
