import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArguidoReclamacaoService } from '@resources/modules/sigpj/core/service/ArguidoReclamacao.service';
import { DecisaoReclamacaoService } from '@resources/modules/sigpj/core/service/Decisao-reclamacao.service';
import { TipoDecisaoReclamacaoService } from '@resources/modules/sigpj/core/service/TipoDecisao-reclamacao.service';
import { Select2OptionData } from 'ng-select2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registar-ou-editar',
  templateUrl: './registar-ou-editar.component.html',
  styleUrls: ['./registar-ou-editar.component.css'],
})
export class RegistarOuEditarComponent implements OnInit {
  options = {
    placeholder: 'Selecione uma opção',
    width: '100%',
  };

  public decisaos: Array<Select2OptionData> = [];
  public decisaoID: number = 0
  public isVerified: boolean = false;
  public haveDatasDecisao: boolean = false



  constructor(
    private decisaoService: DecisaoReclamacaoService,
    private arguidoService: ArguidoReclamacaoService,
    private route: ActivatedRoute,
    private tipoServe: TipoDecisaoReclamacaoService,
    private router: Router
  ) { }

  arrayFiles!: File[];
  decisaoForm!: FormGroup;

  ngOnInit(): void {
    this.createForm();
    this.setDecisao();
    this.setarProcesso()
    this.verifyDecisaoArguido()
  }

  createForm() {
    this.decisaoForm = new FormGroup({
      id: new FormControl(''),
      despacho: new FormControl('', [Validators.required]),
      oficio: new FormControl('', [Validators.required]),
      transcricao: new FormControl('', [Validators.required]),
      tipo_id: new FormControl('', [Validators.required]),
      processo: new FormControl('', [Validators.required]),
      data: new FormControl('', [Validators.required]),
    });
  }


  get getID() {
    return this.route.snapshot.params['id'] as number;
  }
  onVoltar() {
    this.router.navigate(['/piips/sigpj/processo/reclamacao/listagem'])
  }
  setarProcesso() {

    this.decisaoForm.patchValue({
      processo: this.getID
    })
  }

  verifyDecisaoArguido() {
    this.decisaoService.verUm(this.getID)
      .subscribe((response) => {
        // console.log('Dados do parecer do arguido Disciplinar', response)

        if (!response || response == null || response == undefined) {

          this.haveDatasDecisao = false
          return
        }
        this.decisaoForm.patchValue({
          processo: response.processo,
          despacho: response.despacho,
          transcricao: response.transcricao,
          tipo_id: response.tipo_id,
          oficio: response.oficio,
          data: response.data
        })
        this.decisaoID = response.id
        this.haveDatasDecisao = true
      })
  }

  setDecisao() {
    const options = {};
    this.tipoServe
      .listar(options)
      .pipe(finalize(() => { }))
      .subscribe((response) => {

        this.decisaos = response.map((item: any) => ({
          id: item.id,
          text: item.nome,
          sigla: item.sigla,
        }));
      });
  }

  registrar() {
    if (
      !this.decisaoForm.get('despacho')?.value ||
      !this.decisaoForm.get('transcricao')?.value ||
      !this.decisaoForm.get('tipo_id')?.value ||
      !this.decisaoForm.get('data')?.value
    ) {
      window.alert('Campos vazios!');
      return;
    }

    const formData = new FormData();

    if (this.arrayFiles === undefined || !this.arrayFiles) {
      formData.append('files[]', '');
    } else {
      for (let i = 0; i < this.arrayFiles.length; i++) {
        const file = this.arrayFiles[i];
        formData.append('files[]', file);
      }
    }

    if (this.haveDatasDecisao) {
      const newDisciplinar = {
        processo: this.decisaoForm.get('processo')?.value,
        oficio: this.decisaoForm.get('oficio')?.value,
        transcricao: this.decisaoForm.get('transcricao')?.value,
        despacho: this.decisaoForm.get('despacho')?.value,
        tipo_id: this.decisaoForm.get('tipo_id')?.value,
        data: this.decisaoForm.get('data')?.value,
      };

      formData.append('reclamacao_id', `${this.getID}`);
      formData.append('processo', newDisciplinar.processo);
      formData.append('oficio', newDisciplinar.oficio);
      formData.append('transcricao', newDisciplinar.transcricao);
      formData.append('despacho', newDisciplinar.despacho);
      formData.append('data', newDisciplinar.data);
      formData.append('tipo_id', newDisciplinar.tipo_id);

      this.decisaoService
        .editar(formData, this.decisaoID)
        .pipe(
          finalize(() => {
            // this.isLoading = false;
          })
        )
        .subscribe((evt) => {
          this.router.navigate(['/piips/sigpj/processo/reclamacao/listagem']);
        });

      this.decisaoForm.reset();
      return;
    }

    const newDisciplinar = {
      processo: this.decisaoForm.get('processo')?.value,
      oficio: this.decisaoForm.get('oficio')?.value,
      transcricao: this.decisaoForm.get('transcricao')?.value,
      despacho: this.decisaoForm.get('despacho')?.value,
      data: this.decisaoForm.get('data')?.value,
      tipo_id: this.decisaoForm.get('tipo_id')?.value,
    };

    formData.append('reclamacao_id', `${this.getID}`);
    formData.append('processo', newDisciplinar.processo);
    formData.append('oficio', newDisciplinar.oficio);
    formData.append('transcricao', newDisciplinar.transcricao);
    formData.append('despacho', newDisciplinar.despacho);
    formData.append('data', newDisciplinar.data);
    formData.append('tipo_id', newDisciplinar.tipo_id);

    this.decisaoService
      .registar(formData)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
        })
      )
      .subscribe((evt) => {
        this.router.navigate(['/piips/sigpj/processo/reclamacao/listagem']);
      });

    this.decisaoForm.reset();
  }
  onFileSelected(event: any) {
    this.arrayFiles = event.target.files;
  }
}
