import {DateTime} from 'luxon'
interface IInputDay{
  day:string,
  descricao:string;
}

export class calcularDiasUteis {

async calcularDias(
  mes: number,
  ano: number,
  diasUteisDesejados: number,
  dias_selecionados_para_nao_fazer_parte: string[]
): Promise<IInputDay[]> {
  const diasUteis: IInputDay[] = [];


  const existeNoArray = (data:any, array:any) => {
    return array.includes(data);
};
  // Começa com o primeiro dia do mês
  const dataAtual = DateTime.local();

// Verifica se o ano e o mês fornecidos são equivalentes ao ano e mês atuais
  let diaAtual;
  if (ano == dataAtual.year && mes == dataAtual.month) {
      // Se for o mesmo ano e mês, usa o dia atual
      diaAtual = dataAtual.day;
  } else {
      // Caso contrário, começa no dia 1 do mês
      diaAtual = 1;
  }

// Cria a data com o dia apropriado
 diaAtual = DateTime.local(ano, mes, diaAtual);

  while (diasUteis.length < diasUteisDesejados) {
      // Verifica se o dia atual é um dia útil
      const diaString = diaAtual.toISODate(); // Formato YYYY-MM-DD
      const diaSemana = diaAtual.weekday; // 1 (segunda) a 7 (domingo)

      // Verificar se é dia útil (não fim de semana, não feriado e não está na lista de exclusão)
      if(!diaString) continue
      if (diaSemana !== 6 && diaSemana !== 7 &&
          !existeNoArray(diaString,dias_selecionados_para_nao_fazer_parte)) {
          diasUteis.push({ day: diaString, descricao: "pendente" });
      }

      // Avançar para o próximo dia
      diaAtual = diaAtual.plus({ days: 1 });

      // Verificar se ultrapassou o limite do ano
      if (diaAtual.year > ano) {
          break;
      }
  }
  return diasUteis; // Retorna a lista de dias úteis encontrados
}

}
