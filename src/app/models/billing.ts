
export interface BillingList {
  DETALLES: Bill[];
  ALERTA: string;
}

export interface Bill{
  PRECIO: number;
  CODIGO_ARTICULO: string;
  LINEA: number;
  ARTICULO: string;
  CANTIDAD: number;
  TOTAL_LINEA: number;
}
