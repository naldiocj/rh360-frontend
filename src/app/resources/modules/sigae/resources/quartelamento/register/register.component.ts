import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IziToastService } from '@core/services/IziToastService.service';
import { AquartelamentoService } from '@resources/modules/sigae/core/aquartelamento.service';
import { MaterialService } from '@resources/modules/sigae/core/material.service';
import { error } from 'jquery';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public form!: FormGroup;
  public fd = new FormData();

  ficheiro: any;
  filtro = {
    page: 1,
    perPage: 10,
    search: '',
    orgao_id: '',
  };
  public mat: any;
  options: any = {
    placehlder: 'selecione uma opção',
    width: '100%',
  };
  constructor(
    private fb: FormBuilder,
    private toast: IziToastService,
    private aqua: AquartelamentoService,
    private material: MaterialService
  ) {}

  ngOnInit(): void {
    this.formularios();
    this.listaMaterial();
  }

  public formularios() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      quantidade: ['', Validators.required],
      foto: [''],
      descricao: ['', Validators.required],
    });
  }

  public listaMaterial() {
    this.material.listar({}).subscribe((res) => {
      this.mat = res.map((item: any) => ({
        id: item.id,
        text: item.nome,
      }));
      console.log(this.mat);
    });
  }

  // public setForm() {

  // }

  public pegarFile($event: any = null) {
    let ficheiro = $event.target;
    if (ficheiro.files[0].size > 0 && ficheiro.files[0].size < 5587134) {
      var file = $event.target.files[0];
      this.ficheiro = file;
    } else {
      this.toast.erro('Ficheiro escolhido Excede o tamanho permitido');
      throw error('File big');
    }
  }

  public guardar() {
    console.log(this.form.value);
    let fdata = new FormData();
    fdata.append('nome', this.form.value.nome);
    fdata.append('quantidade', this.form.value.quantidade);
    fdata.append('descricao', this.form.value.descricao);
    fdata.append('foto', this.ficheiro);

    console.log(fdata)
    this.aqua.registar(fdata).subscribe({
      next: () => {
        this.removeModal();
        window.location.reload()
      },
      error: () => {
        this.toast.erro('houve um erro no registo');
      },
    });
  }

  private removeModal() {
    $('.modal').hide();
    $('.modal-backdrop').hide();
  }
}
