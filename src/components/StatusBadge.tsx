import { Badge } from "@/components/ui/badge";

export function StatusBadge({ atual, minimo }: { atual: number; minimo: number }) {
  if (atual === 0) {
    return <Badge variant="destructive" className="font-semibold">Sem estoque</Badge>;
  }
  if (atual < minimo) {
    return <Badge variant="destructive">Baixo</Badge>;
  }
  return <Badge className="bg-success text-success-foreground hover:bg-success/90">OK</Badge>;
}
