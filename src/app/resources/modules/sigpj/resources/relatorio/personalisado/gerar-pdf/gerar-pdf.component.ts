 

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-gerar-pdf',
  templateUrl: './gerar-pdf.component.html',
  styleUrls: ['./gerar-pdf.component.css']
})

export class GerarPdfComponent {
  editorContent: string = '';

  
}