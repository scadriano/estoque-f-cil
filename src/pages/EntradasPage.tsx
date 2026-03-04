import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownToLine } from "lucide-react";
import { toast } from "sonner";

export default function EntradasPage() {
  const { produtos, entradas, addEntrada, getProdutoNome, getProduto } = useStore();
  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState(today);
  const [idProduto, setIdProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [notaFiscal, setNotaFiscal] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data) e.data = "Campo obrigatório";
    if (!idProduto) e.idProduto = "Selecione um produto";
    if (!quantidade || Number(quantidade) <= 0) e.quantidade = "Informe uma quantidade válida";
    if (!valorTotal || Number(valorTotal) < 0) e.valorTotal = "Informe um valor válido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        acao: "registrarEntrada",
        id_produto: idProduto,
        nome_produto: getProdutoNome(idProduto),
        quantidade: Number(quantidade),
        valor_total: Number(valorTotal),
        nota_fiscal: notaFiscal,
        data_entrada: data,
      };

      const res = await fetch("https://hook.us2.make.com/nyrla912vy1dpkmf4g3jrxjl8cd2ghsi", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      addEntrada({
        id: `E${Date.now()}`,
        data_entrada: data,
        id_produto: idProduto,
        quantidade: Number(quantidade),
        valor_total: Number(valorTotal),
        nota_fiscal: notaFiscal,
      });
      toast.success("Entrada de novo produto registrada com sucesso.");
      setIdProduto(""); setQuantidade(""); setValorTotal(""); setNotaFiscal("");
    } catch (err) {
      console.error("Erro ao registrar entrada:", err);
      toast.error("Erro ao registra entrada de produto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const produtosAtivos = produtos.filter(p => p.ativo);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Entradas</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowDownToLine className="h-4 w-4" /> Registrar Entrada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Data *</Label>
              <Input type="date" value={data} onChange={e => setData(e.target.value)} />
              {errors.data && <p className="text-sm text-destructive mt-1">{errors.data}</p>}
            </div>
            <div>
              <Label>Produto *</Label>
              <Select value={idProduto} onValueChange={setIdProduto}>
                <SelectTrigger><SelectValue placeholder="Selecione o produto" /></SelectTrigger>
                <SelectContent>
                  {produtosAtivos.map(p => (
                    <SelectItem key={p.id_produto} value={p.id_produto}>
                      {p.nome_produto} ({p.estoque_atual} {p.unidade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.idProduto && <p className="text-sm text-destructive mt-1">{errors.idProduto}</p>}
            </div>
            <div>
              <Label>Quantidade *</Label>
              <Input type="number" min={0} step={0.01} value={quantidade} onChange={e => setQuantidade(e.target.value)} placeholder="0" />
              {errors.quantidade && <p className="text-sm text-destructive mt-1">{errors.quantidade}</p>}
            </div>
            <div>
              <Label>Valor Total (R$) *</Label>
              <Input type="number" min={0} step={0.01} value={valorTotal} onChange={e => setValorTotal(e.target.value)} placeholder="0,00" />
              {errors.valorTotal && <p className="text-sm text-destructive mt-1">{errors.valorTotal}</p>}
            </div>
            <div>
              <Label>Nota Fiscal</Label>
              <Input value={notaFiscal} onChange={e => setNotaFiscal(e.target.value)} placeholder="Opcional" />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={saving}>{saving ? "Registrando..." : "Registrar Entrada"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Histórico de Entradas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {entradas.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Nenhuma entrada registrada</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Nota Fiscal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entradas.map(e => {
                  const prod = getProduto(e.id_produto);
                  return (
                    <TableRow key={e.id}>
                      <TableCell>{new Date(e.data_entrada).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{getProdutoNome(e.id_produto)}</TableCell>
                      <TableCell className="text-right">{e.quantidade} {prod?.unidade}</TableCell>
                      <TableCell className="text-right">R$ {e.valor_total.toFixed(2)}</TableCell>
                      <TableCell>{e.nota_fiscal || "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
