// src/app/criminal.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Criminal {
  id: number;
  name: string;
}

export interface Occurrence {
  id: number;
  description: string;
  criminals: Criminal[];
}

@Injectable({
  providedIn: 'root'
})
export class CriminalService {
  private criminals: Criminal[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
  ];

  private occurrences: Occurrence[] = [
    { id: 1, description: 'Robbery at bank', criminals: [] },
    { id: 2, description: 'Homicide at park', criminals: [] },
  ];

  getCriminals(): Observable<Criminal[]> {
    return of(this.criminals);
  }

  getOccurrences(): Observable<Occurrence[]> {
    return of(this.occurrences);
  }

  associateCriminalToOccurrence(criminalId: number, occurrenceId: number): void {
    const occurrence = this.occurrences.find(o => o.id === occurrenceId);
    const criminal = this.criminals.find(c => c.id === criminalId);
    if (occurrence && criminal && !occurrence.criminals.includes(criminal)) {
      occurrence.criminals.push(criminal);
    }
  }

  removeCriminalFromOccurrence(criminalId: number, occurrenceId: number): void {
    const occurrence = this.occurrences.find(o => o.id === occurrenceId);
    if (occurrence) {
      occurrence.criminals = occurrence.criminals.filter(c => c.id !== criminalId);
    }
  }
}
