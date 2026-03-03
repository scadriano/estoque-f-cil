import { useState } from "react";
import { Settings, Send, Copy, Check, Loader2, Globe, FileJson } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const PAYLOAD_EXAMPLES = {
  registrarEntrada: {
    label: "Registrar Entrada",
    method: "POST",
    endpoint: "/webhook/entradas",
    request: {
      id_produto: "PROD-001",
      quantidade: 10,
      valor_total: 89.90,
      nota_fiscal: "NF-12345",
      data_entrada: "2026-03-03",
    },
    response: { success: true },
  },
  registrarSaida: {
    label: "Registrar Saída",
    method: "POST",
    endpoint: "/webhook/saidas",
    request: {
      id_produto: "PROD-001",
      quantidade: 5,
      motivo: "Produção",
      data_saida: "2026-03-03",
    },
    response: { success: true },
  },
  cadastrarProduto: {
    label: "Cadastrar Produto",
    method: "POST",
    endpoint: "/webhook/produtos",
    request: {
      id_produto: "PROD-009",
      nome_produto: "Farinha de Trigo",
      categoria: "Grãos e Cereais",
      unidade: "Kg",
      estoque_atual: 25,
      estoque_minimo: 10,
      custo_unitario: 4.50,
      fornecedor: "Distribuidora Sul",
    },
    response: { success: true },
  },
};

function JsonBlock({ data, label }: { data: object; label: string }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleCopy}>
          {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? "Copiado" : "Copiar"}
        </Button>
      </div>
      <pre className="rounded-md bg-muted p-4 text-sm overflow-x-auto font-mono leading-relaxed">
        {json}
      </pre>
    </div>
  );
}

export default function WebhooksPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("registrarEntrada");
  const [testing, setTesting] = useState(false);
  const [lastTestStatus, setLastTestStatus] = useState<"idle" | "success" | "error">("idle");

  const handleTest = async () => {
    if (!webhookUrl.trim()) {
      toast.error("Insira a URL do webhook antes de testar.");
      return;
    }
    setTesting(true);
    setLastTestStatus("idle");

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1500));

    // Simulate success
    setTesting(false);
    setLastTestStatus("success");
    toast.success("Conexão testada com sucesso! Resposta: { success: true }");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Webhooks</h1>
          <p className="text-sm text-muted-foreground">Configure integrações externas via Make / Google Sheets</p>
        </div>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config" className="gap-1.5">
            <Globe className="h-4 w-4" /> Configuração
          </TabsTrigger>
          <TabsTrigger value="payloads" className="gap-1.5">
            <FileJson className="h-4 w-4" /> Documentação de Payloads
          </TabsTrigger>
        </TabsList>

        {/* ── Configuração ── */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">URL do Webhook (Make)</CardTitle>
              <CardDescription>
                Cole aqui a URL gerada pelo cenário do Make que receberá os dados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://hook.us1.make.com/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Evento para teste</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAYLOAD_EXAMPLES).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleTest} disabled={testing}>
                  {testing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {testing ? "Enviando..." : "Testar Conexão"}
                </Button>
                {lastTestStatus === "success" && (
                  <Badge variant="outline" className="border-success text-success gap-1">
                    <Check className="h-3 w-3" /> Sucesso
                  </Badge>
                )}
                {lastTestStatus === "error" && (
                  <Badge variant="destructive" className="gap-1">Falha</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview do payload selecionado */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview do Payload</CardTitle>
              <CardDescription>
                Este é o JSON que será enviado ao clicar em "Testar Conexão".
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JsonBlock
                data={PAYLOAD_EXAMPLES[selectedEvent as keyof typeof PAYLOAD_EXAMPLES].request}
                label={`POST ${PAYLOAD_EXAMPLES[selectedEvent as keyof typeof PAYLOAD_EXAMPLES].endpoint}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Documentação de Payloads ── */}
        <TabsContent value="payloads" className="space-y-6">
          {Object.entries(PAYLOAD_EXAMPLES).map(([key, example]) => (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                    {example.method}
                  </Badge>
                  <CardTitle className="text-base">{example.label}</CardTitle>
                </div>
                <CardDescription className="font-mono text-xs">{example.endpoint}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <JsonBlock data={example.request} label="Request Body" />
                <JsonBlock data={example.response} label="Response 200 OK" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
