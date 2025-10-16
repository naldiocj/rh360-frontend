import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Validators } from 'ngx-editor';
import { PermissionService } from '@resources/modules/sigpj/core/service/Permission.service';
import { UtilizadorService } from '@resources/modules/sigpj/core/service/Utilizador.service';

@Component({
  selector: 'sigpj-utilizador-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

  filtro = {
    page: 1,
    perPage: 5,
    regime: 1,
    search: ""
  }
  public allPermission = new Array()
  public permissionExisted = new Array()
  public funcionario: any
  public user: any
  permissionForm!: FormGroup

  // Global variables to manage which role permission deletion

  public keyDelete = new Array()
  public positionDelete = new Array()


  // :: Control for General permissions

  public painelShow: boolean = false
  public disciplinarShow: boolean = false
  public disciplinarArguidoStore: boolean = false
  public reclamacaoShow: boolean = false
  public diversoShow: boolean = false

  // :: control  for the permission system
  // 1. control for disciplinar process

  public disciplinarIndex: boolean = false
  public disciplinarUpdate: boolean = false
  public disciplinarStore: boolean = false
  public disciplinarDetalhesShow: boolean = false
  public disciplinarPecasShow: boolean = false
  public disciplinarPecasStore: boolean = false

  // 2. control for complain process

  public reclamacaoIndex: boolean = false
  public reclamacaoUpdate: boolean = false
  public reclamacaoStore: boolean = false
  public reclamacaoDetalhesShow: boolean = false
  public reclamacaoPecasShow: boolean = false
  public reclamacaoPecasStore: boolean = false

  // 3. control for diverses documents

  public diversoIndex: boolean = false
  public diversoUpdate: boolean = false
  public diversoStore: boolean = false
  public diversoDetalhesShow: boolean = false
  public diversoPecasShow: boolean = false
  public diversoPecasStore: boolean = false

  // :: control for seems 
  // 1. control for disciplinar process

  public disciplinarParecerIndex: boolean = false
  public disciplinarParecerUpdate: boolean = false
  public disciplinarParecerStore: boolean = false
  public disciplinarParecerPecasShow: boolean = false

  // 2. control for complain process 

  public reclamacaoParecerIndex: boolean = false
  public reclamacaoParecerUpdate: boolean = false
  public reclamacaoParecerStore: boolean = false
  public reclamacaoParecerPecasShow: boolean = false



  // :: control for decision
  // 1. control for disciplinar process

  public disciplinarDecisaoIndex: boolean = false
  public disciplinarDecisaoUpdate: boolean = false
  public disciplinarDecisaoStore: boolean = false
  public disciplinarDecisaoPecasShow: boolean = false

  // 2. control for complain process 

  public reclamacaoDecisaoIndex: boolean = false
  public reclamacaoDecisaoUpdate: boolean = false
  public reclamacaoDecisaoStore: boolean = false
  public reclamacaoDecisaoPecasShow: boolean = false

  //  Array of  permission allowed to pass to the backend

  public permitedArray = [
    {
      key: this.painelShow,
      name: 'sigpj-painel-show'
    },
    {
      key: this.disciplinarShow,
      name: 'disciplinar-show'
    },
    {
      key: this.disciplinarArguidoStore,
      name: 'disciplinar-arguido-store'
    },

    {
      key: this.reclamacaoShow,
      name: 'reclamacao-show'
    },
    {
      key: this.diversoShow,
      name: 'diverso-show'
    },

    {
      key: this.disciplinarIndex,
      name: 'disciplinar-index'
    },

    {
      key: this.disciplinarUpdate,
      name: 'disciplinar-update'
    },

    {
      key: this.disciplinarStore,
      name: 'disciplinar-store'
    },

    {
      key: this.disciplinarDetalhesShow,
      name: 'disciplinar-detalhes-show'
    },

    {
      key: this.disciplinarPecasShow,
      name: 'disciplinar-pecas-show'
    },

    {
      key: this.disciplinarPecasStore,
      name: 'disciplinar-pecas-store'
    },

    {
      key: this.reclamacaoIndex,
      name: 'reclamacao-index'
    },

    {
      key: this.reclamacaoUpdate,
      name: 'reclamacao-update'
    },

    {
      key: this.reclamacaoStore,
      name: 'reclamacao-store'
    },

    {
      key: this.reclamacaoDetalhesShow,
      name: 'reclamacao-detalhes-show'
    },

    {
      key: this.reclamacaoPecasShow,
      name: 'reclamacao-pecas-show'
    },

    {
      key: this.reclamacaoPecasStore,
      name: 'reclamacao-pecas-store'
    },

    {
      key: this.diversoIndex,
      name: 'diverso-index'
    },

    {
      key: this.diversoUpdate,
      name: 'diverso-update'
    },

    {
      key: this.diversoStore,
      name: 'diverso-store'
    },

    {
      key: this.diversoDetalhesShow,
      name: 'diverso-detalhes-show'
    },

    {
      key: this.diversoPecasShow,
      name: 'diverso-pecas-show'
    },

    {
      key: this.diversoPecasStore,
      name: 'diverso-pecas-store'
    },

    {
      key: this.disciplinarParecerIndex,
      name: 'disciplinar-parecer-index'
    },

    {
      key: this.disciplinarParecerUpdate,
      name: 'disciplinar-parecer-update'
    },

    {
      key: this.disciplinarParecerStore,
      name: 'disciplinar-parecer-store'
    },

    {
      key: this.disciplinarParecerPecasShow,
      name: 'disciplinar-parecer-pecas-show'
    },

    {
      key: this.reclamacaoParecerIndex,
      name: 'reclamacao-parecer-index'
    },

    {
      key: this.reclamacaoParecerUpdate,
      name: 'reclamacao-parecer-update'
    },

    {
      key: this.reclamacaoParecerStore,
      name: 'reclamacao-parecer-store'
    },

    {
      key: this.reclamacaoParecerPecasShow,
      name: 'reclamacao-parecer-pecas-show'
    },
    {
      key: this.disciplinarDecisaoIndex,
      name: 'disciplinar-decisao-index'
    },

    {
      key: this.disciplinarDecisaoUpdate,
      name: 'disciplinar-decisao-update'
    },

    {
      key: this.disciplinarDecisaoStore,
      name: 'disciplinar-decisao-store'
    },

    {
      key: this.disciplinarDecisaoPecasShow,
      name: 'disciplinar-decisao-pecas-show'
    },
    {
      key: this.reclamacaoDecisaoIndex,
      name: 'reclamacao-decisao-index'
    },
    {
      key: this.reclamacaoDecisaoUpdate,
      name: 'reclamacao-decisao-update'
    },
    {
      key: this.reclamacaoDecisaoStore,
      name: 'reclamacao-decisao-store'
    },
    {
      key: this.reclamacaoDecisaoPecasShow,
      name: 'reclamacao-decisao-pecas-show'
    },
  ]


  constructor(
    private User: UtilizadorService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private permission: PermissionService,
    private router: Router
  ) { }


  ngOnInit(): void {

    this.buscarRole()
    this.createForm()

    this.buscarPermission()
    this.setPermission()

    // this.verifyChanges()

  }

  public getId() {
    return this.route.snapshot.params['id'] as number
  }


  createForm() {
    this.permissionForm = this.fb.group({
      sigpj_painel_show: [null, [Validators.required]],
      disciplinar_show: [null, [Validators.required]],
      disciplinar_arguido_store: [null, [Validators.required]],
      reclamacao_show: [null, [Validators.required]],
      diverso_show: [null, [Validators.required]],
      disciplinar_index: [null, [Validators.required]],
      disciplinar_update: [null, [Validators.required]],
      disciplinar_store: [null, [Validators.required]],
      disciplinar_detalhes_show: [null, [Validators.required]],
      disciplinar_pecas_show: [null, [Validators.required]],
      disciplinar_pecas_store: [null, [Validators.required]],
      reclamacao_index: [null, [Validators.required]],
      reclamacao_update: [null, [Validators.required]],
      reclamacao_store: [null, [Validators.required]],
      reclamacao_detalhes_show: [null, [Validators.required]],
      reclamacao_pecas_show: [null, [Validators.required]],
      reclamacao_pecas_store: [null, [Validators.required]],
      diverso_index: [null, [Validators.required]],
      diverso_update: [null, [Validators.required]],
      diverso_store: [null, [Validators.required]],
      diverso_detalhes_show: [null, [Validators.required]],
      diverso_pecas_show: [null, [Validators.required]],
      diverso_pecas_store: [null, [Validators.required]],
      disciplinar_parecer_index: [null, [Validators.required]],
      disciplinar_parecer_update: [null, [Validators.required]],
      disciplinar_parecer_store: [null, [Validators.required]],
      disciplinar_parecer_pecas_show: [null, [Validators.required]],
      reclamacao_parecer_index: [null, [Validators.required]],
      reclamacao_parecer_update: [null, [Validators.required]],
      reclamacao_parecer_store: [null, [Validators.required]],
      reclamacao_parecer_pecas_show: [null, [Validators.required]],
      disciplinar_decisao_index: [null, [Validators.required]],
      disciplinar_decisao_update: [null, [Validators.required]],
      disciplinar_decisao_store: [null, [Validators.required]],
      disciplinar_decisao_pecas_show: [null, [Validators.required]],
      reclamacao_decisao_index: [null, [Validators.required]],
      reclamacao_decisao_update: [null, [Validators.required]],
      reclamacao_decisao_store: [null, [Validators.required]],
      reclamacao_decisao_pecas_show: [null, [Validators.required]],
    })
  }



  setPermission() {
    this.permission.listarUserPermission(this.getId())
      .subscribe((array_permission) => {

        console.log("permission existed", array_permission, this.getId())

        if (!array_permission || array_permission == null) { return }
        this.permissionExisted = array_permission
        for (var item of this.permissionExisted) {
          for (let id = 0; id < this.permitedArray.length; id++) {
            const element = this.permitedArray[id];
            if (item.name == element.name) {
              element.key = true
              switch (id) {
                case 0: this.painelShow = true
                  break;

                case 1: this.disciplinarShow = true
                  break;

                case 2: this.disciplinarArguidoStore = true
                  break;

                case 3: this.reclamacaoShow = true
                  break;

                case 4: this.diversoShow = true
                  break;

                case 5: this.disciplinarIndex = true
                  break;

                case 6: this.disciplinarUpdate = true
                  break;

                case 7: this.disciplinarStore = true
                  break;

                case 8: this.disciplinarDetalhesShow = true
                  break;

                case 9: this.disciplinarPecasShow = true
                  break;

                case 10: this.disciplinarPecasStore = true
                  break;

                case 11: this.reclamacaoIndex = true
                  break;

                case 12: this.reclamacaoUpdate = true
                  break;

                case 13: this.reclamacaoStore = true
                  break;

                case 14: this.reclamacaoDetalhesShow = true
                  break;

                case 15: this.reclamacaoPecasShow = true
                  break;

                case 16: this.reclamacaoPecasStore = true
                  break;

                case 17: this.diversoIndex = true
                  break;

                case 18: this.diversoUpdate = true
                  break;

                case 19: this.diversoStore = true
                  break;

                case 20: this.diversoDetalhesShow = true
                  break;

                case 21: this.diversoPecasShow = true
                  break;

                case 22: this.diversoPecasStore = true
                  break;

                case 23: this.disciplinarParecerIndex = true
                  break;

                case 24: this.disciplinarParecerUpdate = true
                  break;

                case 25: this.disciplinarParecerStore = true
                  break;

                case 26: this.disciplinarParecerPecasShow = true
                  break;

                case 27: this.reclamacaoParecerIndex = true
                  break;

                case 28: this.reclamacaoParecerUpdate = true
                  break;

                case 29: this.reclamacaoParecerStore = true
                  break;

                case 30: this.reclamacaoParecerPecasShow = true
                  break;

                case 31: this.disciplinarDecisaoIndex = true
                  break;

                case 32: this.disciplinarDecisaoUpdate = true
                  break;

                case 33: this.disciplinarDecisaoStore = true
                  break;

                case 34: this.disciplinarDecisaoPecasShow = true
                  break;

                case 35: this.reclamacaoDecisaoIndex = true
                  break;

                case 36: this.reclamacaoDecisaoUpdate = true
                  break;

                case 37: this.reclamacaoDecisaoStore = true
                  break;

                case 38: this.reclamacaoDecisaoPecasShow = true
                  break;

                default: console.log("identifer not found")
                  break;
              }
            }

          }
        }
      })
  }


  buscarPermission() {
    const options = {}
    this.permission.listar(options)
      .subscribe(response => {
        // console.log("lista das permissions", response)
        this.allPermission = response
      })
  }
  buscarRole() {

    this.User.verUm(this.getId())
      .subscribe(response => {
        // console.log("the value returned", response)
        this.user = response
      })

  }


  verifyChanges(name: string, position: number) {
    const result = this.permissionForm.get(`${name}`)?.value
    const element = this.permitedArray[position];
    element.key = !result

    // setting the global variables for deletion
    this.keyDelete.push({ value: result })
    this.positionDelete.push({ position: position })

  }



  onSubmit() {
    //  alert('clicked')

    // delete desabled role permissions
    for (let id1 = 0; id1 < this.positionDelete.length; id1++) {
      const controlPosition = this.positionDelete[id1];
      const permission = this.permitedArray[controlPosition.position]

      const keys = this.keyDelete[id1]
      for (const existedPermission of this.permissionExisted) {
        if (keys.value && permission.name == existedPermission.name) {
          const options = {
            permission_id: existedPermission.permission_id,
            user_id: this.getId()
          }
          this.permission.deleteUserPermission(options)
            .subscribe(function () {
              console.log("delete complete", permission.name)
            })

        }
      }

    }

    const options = {
      user_id: this.getId(),
      permission: this.permitedArray
    }
    //console.log(options)
    this.permission.registarUserPermission(options).subscribe((evt) => { this.router.navigate(['/piips/sigpj/admin/utilizador/listagem']) })
  }

}
