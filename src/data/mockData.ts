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

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];

export const entradasIniciais: Entrada[] = [
  { id: "E001", data_entrada: today, id_produto: "P001", quantidade: 30, valor_total: 177.00, nota_fiscal: "NF-1234" },
  { id: "E002", data_entrada: today, id_produto: "P003", quantidade: 15, valor_total: 630.00, nota_fiscal: "NF-1235" },
  { id: "E003", data_entrada: yesterday, id_produto: "P006", quantidade: 48, valor_total: 216.00, nota_fiscal: "NF-1230" },
  { id: "E004", data_entrada: yesterday, id_produto: "P007", quantidade: 100, valor_total: 150.00, nota_fiscal: "" },
  { id: "E005", data_entrada: twoDaysAgo, id_produto: "P005", quantidade: 10, valor_total: 82.00, nota_fiscal: "NF-1228" },
];

export const saidasIniciais: Saida[] = [
  { id: "S001", data_saida: today, id_produto: "P001", quantidade: 5, motivo: "Produção" },
  { id: "S002", data_saida: today, id_produto: "P002", quantidade: 3, motivo: "Produção" },
  { id: "S003", data_saida: yesterday, id_produto: "P004", quantidade: 4, motivo: "Produção" },
  { id: "S004", data_saida: yesterday, id_produto: "P008", quantidade: 50, motivo: "Venda" },
  { id: "S005", data_saida: twoDaysAgo, id_produto: "P003", quantidade: 2, motivo: "Perda" },
];
