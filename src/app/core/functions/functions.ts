import { Select2OptionData } from "ng-select2";


export function funcaoGenericaGerarAnos() {
  const anos: Array<Select2OptionData> = []
  anos.push({id:'null',text:'TODOS'})
  for (let ano = 2020; ano <= 2030; ano++) {
    anos.push({ id: ano.toString(), text: ano.toString() });
  }
  return anos;
}

export function funcaoGenericaGerarMeses() {
  const _meses: Array<Select2OptionData> = []
  _meses.push({id:'null',text:'TODOS'})
  const meses = [
    'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
    'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
  ];
  // Preencher os meses
  let countmes:number=1
  meses.forEach(mes => {
    _meses.push({ id: countmes.toString(), text: mes });
    countmes=countmes+1
  });
  return _meses;
}
