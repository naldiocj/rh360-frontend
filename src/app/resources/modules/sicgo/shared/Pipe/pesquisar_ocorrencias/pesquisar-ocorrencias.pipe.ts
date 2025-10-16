import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pesquisarOcorrencias'
})
export class PesquisarOcorrenciasPipe implements PipeTransform {

  transform(ocorrencias: any[], search: string): any[] {
    // Adicionando log para verificar o valor do termo de pesquisa
    console.log('Pesquisa:', search);

    if (!ocorrencias || !search) {
      console.log('Nenhuma ocorrência ou pesquisa vazia. Retornando todas as ocorrências.');
      return ocorrencias;
    }

    const searchTerm = search.toLowerCase();

    // Adicionando log para verificar as ocorrências filtradas
    const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
      return Object.values(ocorrencia).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(searchTerm)
      );
    });

    console.log('Ocorrências filtradas:', filteredOcorrencias);
    return filteredOcorrencias;
  }

}
