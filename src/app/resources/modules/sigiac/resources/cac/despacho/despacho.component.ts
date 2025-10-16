import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QueixaService } from '@resources/modules/sigiac/core/service/Queixa.service';
import { ArguidoReclamacaoService } from '@resources/modules/sigpj/core/service/ArguidoReclamacao.service';
import { ParecerReclamacaoService } from '@resources/modules/sigpj/core/service/Parecer-reclamacao.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'sigiac-auto',
  templateUrl: './despacho.component.html',
  styleUrls: ['./despacho.component.css']
})
export class DespachoComponent implements OnInit {

  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public haveDespacho: boolean = false
  public despachoID:number = 0


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qService:QueixaService,
  ) { }


  arrayFiles!: File[]
  autoForm!: FormGroup

  ngOnInit(): void {

    this.createForm()
    this.setarProcesso()
    this.verifyDespacho()

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
    this.qService.listarUm(this.getID)
    .subscribe((response)=>{
      this.autoForm.patchValue(
        {
          processo:response.id
        }
      )

    })
   

  }
  onVoltar() {
    this.router.navigate(['/piips/sigiac/queixa/listagem'])
  }
  verifyDespacho() {
    this.qService.verDespacho(this.getID)
      .subscribe((response) => {

        console.log("list of despacho", response)
     if (!response || response == null || response == undefined) {

          this.haveDespacho = false
          return
        }
        this.autoForm.patchValue({
          processo: response.processo,
          assunto: response.assunto,
          oficio: response.oficio,
          data: response.data
        })
        this.haveDespacho = true
        this.despachoID = response.id
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

    if (this.haveDespacho) {

      const newDisciplinar = {
        processo: this.autoForm.get("processo")?.value,
        oficio: this.autoForm.get("oficio")?.value,
        assunto: this.autoForm.get("assunto")?.value,
        data: this.autoForm.get("data")?.value,
      }

      formData.append('processo', newDisciplinar.processo)
      formData.append('oficio', newDisciplinar.oficio)
      formData.append('assunto', newDisciplinar.assunto)
      formData.append('data', newDisciplinar.data)


      this.qService.editarDesp(formData, this.despachoID).pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      ).subscribe(evt => {

        this.router.navigate(['/piips/sigiac/queixa/listagem'])
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

    formData.append('processo', newDisciplinar.processo)
    formData.append('oficio', newDisciplinar.oficio)
    formData.append('assunto', newDisciplinar.assunto)
    formData.append('data', newDisciplinar.data)


    this.qService.registDesp(formData).pipe(
      finalize(() => {
        // this.isLoading = false;
      })
    ).subscribe(evt => {
      this.router.navigate(['/piips/sigiac/queixa/listagem'])
    })

    this.autoForm.reset()


  }
  onFileSelected(event: any) {
    this.arrayFiles = event.target.files
  }

}
