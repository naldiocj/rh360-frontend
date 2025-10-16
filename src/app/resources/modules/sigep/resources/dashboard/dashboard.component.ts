import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OccurrenceService } from '../../core/service/occurrence.service';

@Component({
  selector: 'app-sigep-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  occurrences: any[] = [];
  filteredOccurrences: any[] = [];
  dateFilterEnabled: boolean = false;
  fromDateFilter: string = '';
  toDateFilter: string = '';
  typicityFilterEnabled: boolean = false;
  typicityFilter: string = '';
  legalFrameworkFilterEnabled: boolean = false;
  legalFrameworkFilter: string = '';
  securityLevelFilterEnabled: boolean = false;
  securityLevelFilter: string = '';
  objectFilterEnabled: boolean = false;
  objectFilter: string = '';
  damageTypeFilterEnabled: boolean = false;
  damageTypeFilter: string = '';
  provinceFilterEnabled: boolean = false;
  provinceFilter: string = '';
  victimNationalityFilterEnabled: boolean = false;
  victimNationalityFilter: string = '';
  suspectNationalityFilterEnabled: boolean = false;
  suspectNationalityFilter: string = '';

  constructor(private occurrenceService: OccurrenceService) { }

  ngOnInit() {
    this.getOccurrences();
  }

  getOccurrences() {
    this.occurrenceService.getOccurrences().subscribe(
      (response) => {
        this.occurrences = response;
        this.applyFilter();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applyFilter() {
    this.filteredOccurrences = this.occurrences.filter((occurrence) => {
      const dateMatch = !this.dateFilterEnabled || this.isDateInRange(occurrence.date);
      const typicityMatch = !this.typicityFilterEnabled || occurrence.typicity === this.typicityFilter;
      const legalFrameworkMatch = !this.legalFrameworkFilterEnabled || occurrence.legalFramework === this.legalFrameworkFilter;
      const securityLevelMatch = !this.securityLevelFilterEnabled || occurrence.securityLevel === this.securityLevelFilter;
      const objectMatch = !this.objectFilterEnabled || occurrence.object === this.objectFilter;
      const damageTypeMatch = !this.damageTypeFilterEnabled || occurrence.damageType === this.damageTypeFilter;
      const provinceMatch = !this.provinceFilterEnabled || occurrence.province === this.provinceFilter;
      const victimNationalityMatch = !this.victimNationalityFilterEnabled || occurrence.victimNationality === this.victimNationalityFilter;
      const suspectNationalityMatch = !this.suspectNationalityFilterEnabled || occurrence.suspectNationality === this.suspectNationalityFilter;
      return (
        dateMatch &&
        typicityMatch &&
        legalFrameworkMatch &&
        securityLevelMatch &&
        objectMatch &&
        damageTypeMatch &&
        provinceMatch &&
        victimNationalityMatch &&
        suspectNationalityMatch
      );
    });
  }

  isDateInRange(date: string): boolean {
    if (this.fromDateFilter && this.toDateFilter) {
      const fromDate = new Date(this.fromDateFilter);
      const toDate = new Date(this.toDateFilter);
      const occurrenceDate = new Date(date);
      return occurrenceDate >= fromDate && occurrenceDate <= toDate;
    }
    return true;
  }



}

