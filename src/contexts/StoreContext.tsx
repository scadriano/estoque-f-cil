import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Produto, Entrada, Saida,
  produtosIniciais, entradasIniciais, saidasIniciais,
} from "@/data/mockData";

interface StoreContextType {
  produtos: Produto[];
  entradas: Entrada[];
  saidas: Saida[];
  addProduto: (p: Produto) => void;
  updateProduto: (p: Produto) => void;
  addEntrada: (e: Entrada) => void;
  addSaida: (s: Saida) => void;
  getProdutoNome: (id: string) => string;
  getProduto: (id: string) => Produto | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [entradas, setEntradas] = useState<Entrada[]>(entradasIniciais);
  const [saidas, setSaidas] = useState<Saida[]>(saidasIniciais);

  const addProduto = useCallback((p: Produto) => setProdutos(prev => [...prev, p]), []);
  const updateProduto = useCallback((p: Produto) => setProdutos(prev => prev.map(x => x.id_produto === p.id_produto ? p : x)), []);

  const addEntrada = useCallback((e: Entrada) => {
    setEntradas(prev => [e, ...prev]);
    setProdutos(prev => prev.map(p => p.id_produto === e.id_produto ? { ...p, estoque_atual: p.estoque_atual + e.quantidade } : p));
  }, []);

  const addSaida = useCallback((s: Saida) => {
    setSaidas(prev => [s, ...prev]);
    setProdutos(prev => prev.map(p => p.id_produto === s.id_produto ? { ...p, estoque_atual: Math.max(0, p.estoque_atual - s.quantidade) } : p));
  }, []);

  const getProdutoNome = useCallback((id: string) => produtos.find(p => p.id_produto === id)?.nome_produto ?? id, [produtos]);
  const getProduto = useCallback((id: string) => produtos.find(p => p.id_produto === id), [produtos]);

  return (
    <StoreContext.Provider value={{ produtos, entradas, saidas, addProduto, updateProduto, addEntrada, addSaida, getProdutoNome, getProduto }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
