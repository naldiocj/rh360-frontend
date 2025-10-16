import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArguidoReclamacaoService } from '@resources/modules/sigpj/core/service/ArguidoReclamacao.service';
import { ParecerReclamacaoService } from '@resources/modules/sigpj/core/service/Parecer-reclamacao.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigiac-auto',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css']
})
export class AutoComponent implements OnInit {

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public haveDatasParecer: boolean = false
  public parecerID: number = 0
  public reclamacaoID: number = 0



  constructor(
    private route: ActivatedRoute,
    private parecerService: ParecerReclamacaoService,
    private router: Router,
    private arguidoService: ArguidoReclamacaoService
  ) { }


  arrayFiles!: File[]
  autoForm!: FormGroup

  ngOnInit(): void {

    this.createForm()
    this.setarProcesso()
    this.verifyParecerArguido()

  }

  get getID() {
    return this.route.snapshot.params["id"] as number
  }

  createForm() {
    this.autoForm = new FormGroup({
      id: new FormControl(''),
      assunto: new FormControl('', [Validators.required]),
      oficio: new FormControl('', [Validators.required]),
      processo: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required])
    })


  }

  setarProcesso() {

    this.autoForm.patchValue({
      processo: this.getID
    })

  }
  onVoltar() {
    this.router.navigate(['/piips/sigiac/queixa/listagem'])
  }
  verifyParecerArguido() {
    this.parecerService.verUm(this.getID)
      .subscribe((response) => {
        // console.log('Dados do parecer do arguido Disciplinar', response)

        if (!response || response == null || response == undefined) {

          this.haveDatasParecer = false
          return
        }
        this.autoForm.patchValue({
          processo: response.processo,
          assunto: response.assunto,
          oficio: response.oficio,
          data: response.data
        })
        this.parecerID = response.id
        this.haveDatasParecer = true
      })


  }

  registrar() {

    if (!this.autoForm.get("data")?.value || !this.autoForm.get("oficio")?.value || !this.autoForm.get("assunto")?.value || !this.autoForm.get("processo")?.value) {

      window.alert("Campos vazios!")
      return
    }

    const formData = new FormData()

    if (this.arrayFiles === undefined || !this.arrayFiles) {
      formData.append('files[]', '');
    } else {
      for (let i = 0; i < this.arrayFiles.length; i++) {
        const file = this.arrayFiles[i]
        formData.append('files[]', file);
      }
    }

    if (this.haveDatasParecer) {

      const newDisciplinar = {
        processo: this.autoForm.get("processo")?.value,
        oficio: this.autoForm.get("oficio")?.value,
        assunto: this.autoForm.get("assunto")?.value,
        data: this.autoForm.get("data")?.value,
      }

      formData.append('reclamacao_id', `${this.getID}`)
      formData.append('processo', newDisciplinar.processo)
      formData.append('oficio', newDisciplinar.oficio)
      formData.append('assunto', newDisciplinar.assunto)
      formData.append('data', newDisciplinar.data)


      this.parecerService.editar(formData, this.parecerID).pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      ).subscribe(evt => {

        this.router.navigate(['/piips/sigpj/processo/reclamacao/listagem'])
      })

      this.autoForm.reset()
      return
    }


    const newDisciplinar = {
      processo: this.autoForm.get("processo")?.value,
      oficio: this.autoForm.get("oficio")?.value,
      assunto: this.autoForm.get("assunto")?.value,
      data: this.autoForm.get("data")?.value,
    }

    formData.append('reclamacao_id', `${this.getID}`)
    formData.append('processo', newDisciplinar.processo)
    formData.append('oficio', newDisciplinar.oficio)
    formData.append('assunto', newDisciplinar.assunto)
    formData.append('data', newDisciplinar.data)


    this.parecerService.registar(formData).pipe(
      finalize(() => {
        // this.isLoading = false;
      })
    ).subscribe(evt => {
      // console.log('resultado do registro', evt)
      // this.verifyParecerArguido() 
      this.router.navigate(['/piips/sigpj/processo/reclamacao/listagem'])
    })

    this.autoForm.reset()


  }
  onFileSelected(event: any) {
    this.arrayFiles = event.target.files
  }

}
