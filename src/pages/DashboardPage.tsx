import { useStore } from "@/contexts/StoreContext";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, AlertTriangle, DollarSign, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Movimentacao } from "@/data/mockData";

export default function DashboardPage() {
  const { produtos, entradas, saidas, getProdutoNome, getProduto } = useStore();
  const navigate = useNavigate();

  const produtosAtivos = produtos.filter(p => p.ativo);
  const abaixoMinimo = produtosAtivos.filter(p => p.estoque_atual < p.estoque_minimo);
  const valorEstoque = produtosAtivos.reduce((sum, p) => sum + p.estoque_atual * p.custo_unitario, 0);

  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());
  const entradasSemana = entradas.filter(e => new Date(e.data_entrada) >= inicioSemana);

  const movimentacoes: Movimentacao[] = [
    ...entradas.map(e => ({
      tipo: "Entrada" as const,
      produto: getProdutoNome(e.id_produto),
      quantidade: e.quantidade,
      unidade: getProduto(e.id_produto)?.unidade ?? "",
      data: e.data_entrada,
    })),
    ...saidas.map(s => ({
      tipo: "Saída" as const,
      produto: getProdutoNome(s.id_produto),
      quantidade: s.quantidade,
      unidade: getProduto(s.id_produto)?.unidade ?? "",
      data: s.data_saida,
    })),
  ]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Itens Cadastrados" value={produtosAtivos.length} icon={Package} />
        <KPICard title="Abaixo do Mínimo" value={abaixoMinimo.length} icon={AlertTriangle} variant={abaixoMinimo.length > 0 ? "warning" : "default"} />
        <KPICard title="Valor do Estoque" value={`R$ ${valorEstoque.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} icon={DollarSign} variant="success" />
        <KPICard title="Entradas na Semana" value={entradasSemana.length} icon={ArrowDownToLine} />
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => navigate("/entradas")} size="sm"><ArrowDownToLine className="mr-1 h-4 w-4" />Nova Entrada</Button>
        <Button onClick={() => navigate("/saidas")} size="sm" variant="outline"><ArrowUpFromLine className="mr-1 h-4 w-4" />Nova Saída</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Atenção agora */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Atenção Agora
            </CardTitle>
          </CardHeader>
          <CardContent>
            {abaixoMinimo.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum produto abaixo do mínimo 🎉</p>
            ) : (
              <div className="space-y-3">
                {abaixoMinimo.slice(0, 5).map(p => (
                  <div key={p.id_produto} className="flex items-center justify-between gap-2 text-sm">
                    <div>
                      <span className="font-medium">{p.nome_produto}</span>
                      <span className="text-muted-foreground ml-2">{p.estoque_atual} / {p.estoque_minimo} {p.unidade}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate("/entradas")}>
                      Registrar Entrada
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimos lançamentos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Últimos Lançamentos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoes.map((m, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <span className={m.tipo === "Entrada" ? "text-success font-medium" : "text-destructive font-medium"}>
                        {m.tipo}
                      </span>
                    </TableCell>
                    <TableCell>{m.produto}</TableCell>
                    <TableCell>{m.quantidade} {m.unidade}</TableCell>
                    <TableCell>{new Date(m.data).toLocaleDateString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
