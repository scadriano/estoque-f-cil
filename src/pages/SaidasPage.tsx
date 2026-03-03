import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowUpFromLine, AlertTriangle } from "lucide-react";
import { MOTIVOS, Saida } from "@/data/mockData";
import { toast } from "sonner";

export default function SaidasPage() {
  const { produtos, saidas, addSaida, getProdutoNome, getProduto } = useStore();
  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState(today);
  const [idProduto, setIdProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState<Saida["motivo"] | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDialog, setConfirmDialog] = useState(false);

  const produtosAtivos = produtos.filter(p => p.ativo);
  const produtoSelecionado = getProduto(idProduto);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data) e.data = "Campo obrigatório";
    if (!idProduto) e.idProduto = "Selecione um produto";
    if (!quantidade || Number(quantidade) <= 0) e.quantidade = "Informe uma quantidade válida";
    if (!motivo) e.motivo = "Selecione um motivo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const doRegister = () => {
    addSaida({
      id: `S${Date.now()}`,
      data_saida: data,
      id_produto: idProduto,
      quantidade: Number(quantidade),
      motivo: motivo as Saida["motivo"],
    });
    toast.success("Movimentação registrada!");
    setIdProduto(""); setQuantidade(""); setMotivo("");
    setConfirmDialog(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (produtoSelecionado && Number(quantidade) > produtoSelecionado.estoque_atual) {
      setConfirmDialog(true);
      return;
    }
    doRegister();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Saídas</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowUpFromLine className="h-4 w-4" /> Registrar Saída
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
              {produtoSelecionado && Number(quantidade) > produtoSelecionado.estoque_atual && (
                <p className="text-sm text-warning mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Acima do estoque atual ({produtoSelecionado.estoque_atual} {produtoSelecionado.unidade})
                </p>
              )}
            </div>
            <div>
              <Label>Motivo *</Label>
              <Select value={motivo} onValueChange={v => setMotivo(v as Saida["motivo"])}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {MOTIVOS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.motivo && <p className="text-sm text-destructive mt-1">{errors.motivo}</p>}
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-2">
              <Button type="submit" className="w-full sm:w-auto">Registrar Saída</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Histórico de Saídas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {saidas.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Nenhuma saída registrada</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saidas.map(s => {
                  const prod = getProduto(s.id_produto);
                  return (
                    <TableRow key={s.id}>
                      <TableCell>{new Date(s.data_saida).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{getProdutoNome(s.id_produto)}</TableCell>
                      <TableCell className="text-right">{s.quantidade} {prod?.unidade}</TableCell>
                      <TableCell>{s.motivo}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirm over-stock dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> Quantidade acima do estoque
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            A quantidade informada ({quantidade}) é maior que o estoque atual
            ({produtoSelecionado?.estoque_atual} {produtoSelecionado?.unidade}) de <strong>{produtoSelecionado?.nome_produto}</strong>.
            Deseja continuar mesmo assim?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={doRegister}>Confirmar Saída</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
