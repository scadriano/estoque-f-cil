import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Ban } from "lucide-react";
import { Produto, CATEGORIAS, UNIDADES } from "@/data/mockData";
import { toast } from "sonner";

const emptyProduto: Produto = {
  id_produto: "", nome_produto: "", categoria: "", unidade: "Kg",
  estoque_atual: 0, estoque_minimo: 0, custo_unitario: 0, fornecedor: "", ativo: true,
};

export default function ProdutosPage() {
  const { produtos, addProduto, updateProduto } = useStore();
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Produto>(emptyProduto);
  const [isNew, setIsNew] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = produtos.filter(p => {
    if (!p.ativo) return false;
    if (busca && !p.nome_produto.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroCategoria !== "todas" && p.categoria !== filtroCategoria) return false;
    return true;
  });

  const openNew = () => { setEditando(emptyProduto); setIsNew(true); setErrors({}); setModalOpen(true); };
  const openEdit = (p: Produto) => { setEditando({ ...p }); setIsNew(false); setErrors({}); setModalOpen(true); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!editando.id_produto.trim()) e.id_produto = "Campo obrigatório";
    if (!editando.nome_produto.trim()) e.nome_produto = "Campo obrigatório";
    if (!editando.categoria) e.categoria = "Campo obrigatório";
    if (!editando.unidade) e.unidade = "Campo obrigatório";
    if (editando.estoque_atual < 0) e.estoque_atual = "Valor deve ser >= 0";
    if (editando.estoque_minimo < 0) e.estoque_minimo = "Valor deve ser >= 0";
    if (editando.custo_unitario < 0) e.custo_unitario = "Valor deve ser >= 0";
    if (isNew && produtos.some(p => p.id_produto === editando.id_produto)) e.id_produto = "Código já existe";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (isNew) addProduto(editando);
    else updateProduto(editando);
    setModalOpen(false);
    toast.success(isNew ? "Produto cadastrado!" : "Produto atualizado!");
  };

  const handleInativar = (p: Produto) => {
    updateProduto({ ...p, ativo: false });
    toast.success("Produto inativado");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" />Novo Produto</Button>
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

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhum produto encontrado</p>
          <p className="text-sm">Cadastre um novo produto para começar.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
                <TableHead className="text-right">Mínimo</TableHead>
                <TableHead className="text-right">Custo Unit.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id_produto}>
                  <TableCell className="font-medium">{p.nome_produto}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell>{p.unidade}</TableCell>
                  <TableCell className="text-right">{p.estoque_atual} {p.unidade}</TableCell>
                  <TableCell className="text-right">{p.estoque_minimo} {p.unidade}</TableCell>
                  <TableCell className="text-right">R$ {p.custo_unitario.toFixed(2)}</TableCell>
                  <TableCell><StatusBadge atual={p.estoque_atual} minimo={p.estoque_minimo} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleInativar(p)} title="Inativar">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isNew ? "Novo Produto" : "Editar Produto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Código *</Label>
              <Input value={editando.id_produto} onChange={e => setEditando({ ...editando, id_produto: e.target.value })} disabled={!isNew} />
              {errors.id_produto && <p className="text-sm text-destructive mt-1">{errors.id_produto}</p>}
            </div>
            <div>
              <Label>Nome do Produto *</Label>
              <Input value={editando.nome_produto} onChange={e => setEditando({ ...editando, nome_produto: e.target.value })} />
              {errors.nome_produto && <p className="text-sm text-destructive mt-1">{errors.nome_produto}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoria *</Label>
                <Select value={editando.categoria} onValueChange={v => setEditando({ ...editando, categoria: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.categoria && <p className="text-sm text-destructive mt-1">{errors.categoria}</p>}
              </div>
              <div>
                <Label>Unidade *</Label>
                <Select value={editando.unidade} onValueChange={v => setEditando({ ...editando, unidade: v as Produto["unidade"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNIDADES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Estoque Atual</Label>
                <Input type="number" min={0} value={editando.estoque_atual} onChange={e => setEditando({ ...editando, estoque_atual: Number(e.target.value) })} />
                {errors.estoque_atual && <p className="text-sm text-destructive mt-1">{errors.estoque_atual}</p>}
              </div>
              <div>
                <Label>Estoque Mínimo</Label>
                <Input type="number" min={0} value={editando.estoque_minimo} onChange={e => setEditando({ ...editando, estoque_minimo: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Custo Unit. (R$)</Label>
                <Input type="number" min={0} step={0.01} value={editando.custo_unitario} onChange={e => setEditando({ ...editando, custo_unitario: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <Label>Fornecedor</Label>
              <Input value={editando.fornecedor} onChange={e => setEditando({ ...editando, fornecedor: e.target.value })} placeholder="Opcional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
