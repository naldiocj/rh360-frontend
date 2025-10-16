export interface Breadcrumb {
    label: string;
    url: string;
    icon?: string;          // Ícone para mostrar junto ao item
    parent?: string;       // Nome do item pai (hierarquia)
    isHome?: boolean;      // Se é o item inicial (home)
    // Adicione outras propriedades conforme necessário
  }