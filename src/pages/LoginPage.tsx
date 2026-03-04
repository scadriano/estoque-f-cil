import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, UserPlus } from "lucide-react";
import { toast } from "sonner";

const DEMO_USER = { usuario: "Adriano", senha: "sca452" };

export default function LoginPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"login" | "cadastro">("login");
  const [novoUsuario, setNovoUsuario] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario === DEMO_USER.usuario && senha === DEMO_USER.senha) {
      navigate("/dashboard");
    } else {
      toast.error("Usuário ou senha inválidos.");
    }
  };

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Usuário "${novoUsuario}" criado com sucesso! Faça login para continuar.`);
    setModo("login");
    setUsuario(novoUsuario);
    setNovoUsuario("");
    setNovaSenha("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Package className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl">Estoque de Restaurante</CardTitle>
          <CardDescription>
            {modo === "login" ? "Faça login para acessar o sistema" : "Crie uma nova conta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {modo === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário</Label>
                <Input id="usuario" placeholder="Seu usuário" value={usuario} onChange={e => setUsuario(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Entrar</Button>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setModo("cadastro")}>
                <UserPlus className="h-4 w-4" /> Criar novo usuário
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCadastro} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="novo-usuario">Usuário</Label>
                <Input id="novo-usuario" placeholder="Nome de usuário" value={novoUsuario} onChange={e => setNovoUsuario(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nova-senha">Senha</Label>
                <Input id="nova-senha" type="password" placeholder="••••••••" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Cadastrar</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setModo("login")}>
                Voltar ao login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
