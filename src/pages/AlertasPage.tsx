import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle } from "lucide-react";
import { CATEGORIAS } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function AlertasPage() {
  const { produtos } = useStore();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");

  const abaixoMinimo = produtos.filter(p => {
    if (!p.ativo || p.estoque_atual >= p.estoque_minimo) return false;
    if (busca && !p.nome_produto.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroCategoria !== "todas" && p.categoria !== filtroCategoria) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <h1 className="text-2xl font-bold">Alertas de Estoque</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome..." className="pl-9" value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {abaixoMinimo.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhum alerta no momento 🎉</p>
          <p className="text-sm">Todos os produtos estão com estoque adequado.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-right">Estoque Atual</TableHead>
                <TableHead className="text-right">Estoque Mínimo</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {abaixoMinimo.map(p => (
                <TableRow key={p.id_produto}>
                  <TableCell className="font-medium">{p.nome_produto}</TableCell>
                  <TableCell className="text-right">{p.estoque_atual} {p.unidade}</TableCell>
                  <TableCell className="text-right">{p.estoque_minimo} {p.unidade}</TableCell>
                  <TableCell>{p.fornecedor || "—"}</TableCell>
                  <TableCell>
                    {p.estoque_atual === 0 ? (
                      <Badge variant="destructive" className="font-semibold">Crítico</Badge>
                    ) : (
                      <StatusBadge atual={p.estoque_atual} minimo={p.estoque_minimo} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => navigate("/entradas")}>
                      Registrar Entrada
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
