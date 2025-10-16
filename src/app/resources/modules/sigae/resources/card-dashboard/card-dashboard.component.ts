import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpingService } from '../../core/helping.service';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrls: ['./card-dashboard.component.css'],
})
export class CardDashboardComponent implements OnInit {
  @Input() dashboard: any ;
  constructor(private router: Router,
    private help:HelpingService
  ) {}

  ngOnInit(): void {
    console.log(this.dashboard)

  }

  public redirect(url: any) {
    this.router.navigate([url]);
  }

  public get GetIpInfo(){
    return this.help.DataPorIp;
  }
}
