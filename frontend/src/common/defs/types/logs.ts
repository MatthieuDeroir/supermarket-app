export interface StockLogsType {
  id: number;
  ean: string;
  type: string;
  de: string;
  pour: string;
  qt: number;
  date: string;
  par: number;
}

export enum LogType {
  TRANS = 'Trans',
  SOLD = 'Sold',
  AJOUT = 'Ajout',
  SUPPRIMER = 'Supprimer',
}
