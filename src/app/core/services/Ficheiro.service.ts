import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiService } from "@core/providers/http/api.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { debounceTime, distinctUntilChanged, Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FicheiroService {

  public api: string = '/api/v1';
  public base: string = this.api + '/files';
  //public baseStore: string = this.api + '/minios/files';
  public baseStore: string = this.api + '/files-minio/object';

  constructor(
    private httpApi: ApiService,
    private sanitizer: DomSanitizer) { }

  createImageBlob(file: any, extension: any = null): any {

    const typeMap: any = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
    };

    const ext = extension ? typeMap[extension] : file?.type
    const blob = new Blob([file], { type: ext });
    const url = window.URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getFile(opcoes: any): Observable<Blob> {
    let params = new HttpParams();
    params = params.append('pessoaId', opcoes.pessoaId);
    params = params.append('url', opcoes.url);
    return this.httpApi._getWhithFile(`${this.base}`, params);
  }

  getFileStore(opcoes: any): Observable<Blob> {
    let params = new HttpParams();
    params = params.append('pessoaId', opcoes.pessoaId);
    params = params.append('arquivo', opcoes.url);
    return this.httpApi._getWhithFile(`${this.baseStore}`, params)
  }
  
  getFileUsingUrl(url: string): Observable<Blob> {
    let params = new HttpParams();
    params = params.append('url', url);
    return this.httpApi._getWhithFile(`${this.base}`, params);
  }

  public downloadUsingUrl(url: string, name: string) {
    const link: HTMLAnchorElement = document.createElement('a');

    link.download = name;
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public download(file: any, name: any) {
    const url: string = URL.createObjectURL(file)
    const link: HTMLAnchorElement = <HTMLAnchorElement>document.createElement('a')

    link.download = name
    link.target = '_blank'
    link.href = url
    document.body.append(link)
    link.click()
    document.body.removeChild(link)
  }

  public async convertFileToBinary(file: any, type: any): Promise<any> {
    const promise = new Promise((resolve, error) => {
      const blob = new Blob([file], { type: `${type}` });
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
    return promise;
  }

  public async gerarPdf(idELement: any): Promise<any> {
    let blob: any = null;
    const element: any = document.querySelector(`#${idELement}`);
    const doc = new jsPDF('p', 'pt', 'a4')
    const options = {
      background: 'white',
      scale: 3
    }

    return html2canvas(element, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG')

      const bufferX = 15
      const bufferY = 15

      const imgProps = (doc as any).getImageProperties(img)
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST')
      return doc
    }).then((pdf) => {
      return pdf
    })
  }

  public async imprimir(idELement: any) {
    const source = await this.gerarPdf(idELement)
    const blob = source.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  public async download_(idELement: any) {
    const source = await this.gerarPdf(idELement)
    source.save(`${new Date().toISOString()}_guia_marcha.pdf`)
    // const blob = source.output('blob');
    // const url = URL.createObjectURL(blob);
    // window.open(url, '_blank');
  }

  // Método para salvar o arquivo usando File System Access API (se disponível)
  public async saveFileToLocalFolder(file: Blob, fileName: string): Promise<boolean> {
    // Verificar se a File System Access API está disponível
    if ('showSaveFilePicker' in window) {
      try {
        // Solicitar ao usuário para selecionar onde salvar o arquivo
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'PDF Files',
              accept: { 'application/pdf': ['.pdf'] },
            },
          ],
        });

        // Criar um stream para escrever o arquivo
        const writable = await fileHandle.createWritable();
        await writable.write(file);
        await writable.close();
        return true;
      } catch (error) {
        console.error('Erro ao salvar arquivo com File System Access API:', error);
        return false;
      }
    }
    return false;
  }

}
