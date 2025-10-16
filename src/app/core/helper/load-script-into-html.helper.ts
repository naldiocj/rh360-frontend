import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadScriptIntoHtmlHelper {

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  public loadCss(renderer: any, document: any, url: string) {
    const head = document.getElementsByTagName('head')[0];

    // Crie um elemento `<link>` para adicionar o CSS
    const linkElement = renderer.createElement('link');
    renderer.setAttribute(linkElement, 'rel', 'stylesheet');
    renderer.setAttribute(linkElement, 'href', './../../../' + url);

    // Adicione o `<link>` ao `<head>` do documento
    renderer.appendChild(head, linkElement);
  }

}
