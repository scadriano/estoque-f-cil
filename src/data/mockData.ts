export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria: string;
  unidade: "Kg" | "L" | "Unidade";
  estoque_atual: number;
  estoque_minimo: number;
  custo_unitario: number;
  fornecedor: string;
  ativo: boolean;
}

export interface Entrada {
  id: string;
  data_entrada: string;
  id_produto: string;
  quantidade: number;
  valor_total: number;
  nota_fiscal: string;
}

export interface Saida {
  id: string;
  data_saida: string;
  id_produto: string;
  quantidade: number;
  motivo: "Produção" | "Perda" | "Venda";
}

export type Movimentacao = {
  tipo: "Entrada" | "Saída";
  produto: string;
  quantidade: number;
  unidade: string;
  data: string;
};

export const CATEGORIAS = [
  "Grãos e Cereais",
  "Carnes",
  "Bebidas",
  "Óleos e Temperos",
  "Descartáveis",
];

export const UNIDADES: Produto["unidade"][] = ["Kg", "L", "Unidade"];

export const MOTIVOS: Saida["motivo"][] = ["Produção", "Perda", "Venda"];

export const produtosIniciais: Produto[] = [
  { id_produto: "P001", nome_produto: "Arroz", categoria: "Grãos e Cereais", unidade: "Kg", estoque_atual: 50, estoque_minimo: 20, custo_unitario: 5.90, fornecedor: "Distribuidora Silva", ativo: true },
  { id_produto: "P002", nome_produto: "Feijão", categoria: "Grãos e Cereais", unidade: "Kg", estoque_atual: 8, estoque_minimo: 15, custo_unitario: 7.50, fornecedor: "Distribuidora Silva", ativo: true },
  { id_produto: "P003", nome_produto: "Carne Bovina", categoria: "Carnes", unidade: "Kg", estoque_atual: 25, estoque_minimo: 10, custo_unitario: 42.00, fornecedor: "Frigorífico Central", ativo: true },
  { id_produto: "P004", nome_produto: "Frango", categoria: "Carnes", unidade: "Kg", estoque_atual: 3, estoque_minimo: 10, custo_unitario: 15.90, fornecedor: "Frigorífico Central", ativo: true },
  { id_produto: "P005", nome_produto: "Óleo de Soja", categoria: "Óleos e Temperos", unidade: "L", estoque_atual: 20, estoque_minimo: 5, custo_unitario: 8.20, fornecedor: "Atacado Bom Preço", ativo: true },
  { id_produto: "P006", nome_produto: "Refrigerante", categoria: "Bebidas", unidade: "Unidade", estoque_atual: 100, estoque_minimo: 30, custo_unitario: 4.50, fornecedor: "Bebidas Express", ativo: true },
  { id_produto: "P007", nome_produto: "Água Mineral", categoria: "Bebidas", unidade: "Unidade", estoque_atual: 200, estoque_minimo: 50, custo_unitario: 1.50, fornecedor: "Bebidas Express", ativo: true },
  { id_produto: "P008", nome_produto: "Copo Descartável", categoria: "Descartáveis", unidade: "Unidade", estoque_atual: 500, estoque_minimo: 100, custo_unitario: 0.10, fornecedor: "Descartáveis Ltda", ativo: true },
];

export const entradasIniciais: Entrada[] = [];

export const saidasIniciais: Saida[] = [];
