
import { useState, type FormEvent } from "react";
import axios from "axios";
// import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn, X } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AuthTab = "login" | "signup";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return (
      error.response?.data?.message ??
      "Não foi possível conectar à API. Tente novamente."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}

export function LoginBtn() {
  // const navigate = useNavigate();
  const { login, register } = useAuth();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = activeTab === "login";

  function handleTabChange(tab: AuthTab) {
    setActiveTab(tab);
    setShowPassword(false);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleDialogChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setErrorMessage("");
      setSuccessMessage("");
      setShowPassword(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!isLogin) {
      const username = String(formData.get("username") ?? "").trim();
      const confirmPassword = String(
        formData.get("confirmPassword") ?? "",
      );

      if (password !== confirmPassword) {
        setErrorMessage("As senhas não coincidem.");
        return;
      }

      if (!username) {
        setErrorMessage("Informe seu nome de usuário.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      if (isLogin) {
        await login({ email, password });
      } else {
        const username = String(
          formData.get("username") ?? "",
        ).trim();

        await register({ username, email, password });
      }

      setSuccessMessage(
        isLogin
          ? "Login realizado com sucesso!"
          : "Conta criada com sucesso!",
      );

      // setOpen(false);
      // await navigate({ to: "/perfil" });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger
        render={
          <Button className="login-btn" variant="outline">
            <LogIn size={15} />
            Entrar
          </Button>
        }
      />

      <DialogContent
        className="top-6 flex w-[min(490px,calc(100%-2rem))] max-w-none translate-y-0 flex-col gap-0 overflow-y-auto rounded-none border border-[#168bd0] bg-[#21150f] p-0 text-[#f4eee8] ring-0 sm:max-w-none"
        style={{
          height: "min(650px, calc(100dvh - 2rem))",
          maxHeight: "calc(100dvh - 2rem)",
        }}
        showCloseButton={false}
      >
        <DialogClose
          render={
            <button
              aria-label="Fechar diálogo"
              className="absolute right-3 top-3 z-10 rounded-sm p-1 text-[#d28a4c] transition-colors hover:text-[#f4eee8] focus-visible:outline-2 focus-visible:outline-[#d28a4c]"
              type="button"
            >
              <X size={18} />
            </button>
          }
        />

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-11 sm:px-10">
            <DialogHeader className="mb-7 items-center gap-0">
              <DialogTitle className="flex items-center gap-2 font-mono text-xl font-medium tracking-wide">
                <button
                  aria-pressed={isLogin}
                  className={`transition-colors ${
                    isLogin
                      ? "font-bold text-[#e99a4a]"
                      : "text-[#f4eee8] hover:text-[#e99a4a]"
                  }`}
                  onClick={() => handleTabChange("login")}
                  type="button"
                >
                  Entrar
                </button>

                <span
                  aria-hidden="true"
                  className="font-normal text-[#d28a4c]"
                >
                  |
                </span>

                <button
                  aria-pressed={!isLogin}
                  className={`transition-colors ${
                    !isLogin
                      ? "font-bold text-[#e99a4a]"
                      : "text-[#f4eee8] hover:text-[#e99a4a]"
                  }`}
                  onClick={() => handleTabChange("signup")}
                  type="button"
                >
                  Criar conta
                </button>
              </DialogTitle>

              <DialogDescription className="mt-8 max-w-[390px] text-center font-mono text-[13px] leading-relaxed text-[#f4eee8]">
                {isLogin
                  ? "Entre para gerenciar sua carteira, coleção e perfil de criador."
                  : "Crie seu perfil de colecionador e conecte uma carteira quando quiser."}
              </DialogDescription>
            </DialogHeader>

            <form
              className="flex w-full max-w-[333px] flex-col"
              onSubmit={handleSubmit}
            >
              {!isLogin && (
                <>
                  <label className="sr-only" htmlFor="signup-username">
                    Nome de usuário
                  </label>

                  <input
                    autoComplete="username"
                    className="h-10 w-full rounded-md border border-[#3f2319] bg-transparent px-3.5 font-mono text-[13px] text-[#f4eee8] outline-none placeholder:text-[#aa8660] focus:border-[#d28a4c]"
                    id="signup-username"
                    name="username"
                    placeholder="Nome de usuário"
                    required
                  />
                </>
              )}

              <label
                className="sr-only"
                htmlFor={isLogin ? "login-email" : "signup-email"}
              >
                E-mail
              </label>

              <input
                autoComplete="email"
                className={`${isLogin ? "" : "mt-3"} h-10 w-full rounded-md border border-[#3f2319] bg-transparent px-3.5 font-mono text-[13px] text-[#f4eee8] outline-none placeholder:text-[#aa8660] focus:border-[#d28a4c]`}
                id={isLogin ? "login-email" : "signup-email"}
                name="email"
                placeholder={
                  isLogin ? "contato@email.com" : "Digite seu e-mail"
                }
                required
                type="email"
              />

              <label
                className="sr-only"
                htmlFor={isLogin ? "login-password" : "signup-password"}
              >
                Senha
              </label>

              <div className="relative mt-3">
                <input
                  autoComplete={
                    isLogin ? "current-password" : "new-password"
                  }
                  className="h-10 w-full rounded-md border border-[#d28a4c] bg-transparent px-3.5 pr-11 font-mono text-[13px] text-[#f4eee8] outline-none placeholder:text-[#aa8660] focus:border-[#e99a4a]"
                  id={isLogin ? "login-password" : "signup-password"}
                  name="password"
                  placeholder={isLogin ? "••••••••••••" : "Senha"}
                  required
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                />

                <button
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center text-[#aa8660] transition-colors hover:text-[#e99a4a]"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? (
                    <Eye size={17} />
                  ) : (
                    <EyeOff size={17} />
                  )}
                </button>
              </div>

              {!isLogin && (
                <>
                  <label
                    className="sr-only"
                    htmlFor="signup-confirm-password"
                  >
                    Confirmar senha
                  </label>

                  <input
                    autoComplete="new-password"
                    className="mt-3 h-10 w-full rounded-md border border-[#3f2319] bg-transparent px-3.5 font-mono text-[13px] text-[#f4eee8] outline-none placeholder:text-[#aa8660] focus:border-[#d28a4c]"
                    id="signup-confirm-password"
                    name="confirmPassword"
                    placeholder="Confirmar senha"
                    required
                    type="password"
                    minLength={6}
                  />
                </>
              )}

              {isLogin && (
                <a
                  className="mt-3 self-end font-mono text-[13px] text-[#e99a4a] hover:text-[#f4eee8]"
                  href="#recuperar-senha"
                  onClick={(event) => {
                    event.preventDefault();
                    setErrorMessage(
                      "A recuperação de senha ainda não foi implementada.",
                    );
                  }}
                >
                  Esqueceu a senha?
                </a>
              )}

              {errorMessage && (
                <p
                  role="alert"
                  className="mt-3 rounded-sm border border-red-500/30 bg-red-950/30 p-2 font-mono text-xs text-red-300"
                >
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p
                  role="status"
                  className="mt-3 font-mono text-xs text-green-400"
                >
                  {successMessage}
                </p>
              )}

              <Button
                className="mt-5 h-11 w-full rounded-md bg-[#d28a4c] font-mono text-sm font-bold text-[#140d0a] hover:bg-[#e99a4a]"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting
                  ? "Aguarde..."
                  : isLogin
                    ? "Entrar"
                    : "Criar conta"}
              </Button>
            </form>

            <div className="my-6 flex w-full max-w-[333px] items-center gap-3">
              <span className="h-px flex-1 bg-[#3f2319]" />
              <span className="font-mono text-xs text-[#f4eee8]">
                Ou continue com
              </span>
              <span className="h-px flex-1 bg-[#3f2319]" />
            </div>

            <div className="flex w-full max-w-[333px] flex-col gap-3">
              <Button
                className="h-10 w-full justify-center gap-3 rounded-md border border-[#3f2319] bg-transparent font-mono text-xs text-[#c5ad96] hover:bg-[#2a1b13] hover:text-[#f4eee8]"
                disabled
                type="button"
                variant="outline"
              >
                <span
                  aria-hidden="true"
                  className="bg-[conic-gradient(from_-45deg,#4285f4_0deg_90deg,#34a853_90deg_180deg,#fbbc05_180deg_270deg,#ea4335_270deg_360deg)] bg-clip-text font-sans text-lg font-black text-transparent"
                >
                  G
                </span>
                Continuar com Google
              </Button>

              <Button
                className="h-10 w-full justify-center gap-3 rounded-md border border-[#3f2319] bg-transparent font-mono text-xs text-[#c5ad96] hover:bg-[#2a1b13] hover:text-[#f4eee8]"
                disabled
                type="button"
                variant="outline"
              >
                <span
                  aria-hidden="true"
                  className="font-sans text-lg font-bold text-[#4267b2]"
                >
                  f
                </span>
                Continuar com Facebook
              </Button>
            </div>
          </div>

          <div aria-hidden="true" className="h-2 w-full bg-[#d28a4c]" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
