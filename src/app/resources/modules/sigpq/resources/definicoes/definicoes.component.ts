import { Component, OnInit } from '@angular/core'; 
// import { StorageService } from '@core/services/storage.service';

@Component({
  selector: 'app-definicoes',
  templateUrl: './definicoes.component.html',
  styleUrls: ['./definicoes.component.css']
})
export class DefinicoesComponent implements OnInit {
  currentUser: any;

  // constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    // this.currentUser = this.storageService.getUser();
  }
}