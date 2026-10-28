
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  CircleHelp,
  Download,
  Eye,
  EyeOff,
  Heart,
  LogOut,
  ShoppingCart,
  Tag,
  UserRound,
  Wallet,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import axios from "axios";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  changePassword,
  updateProfile,
  type User,
} from "@/api/auth";

const profileLinks = [
  { label: "Dados do perfil", icon: UserRound },
  { label: "Carteiras", icon: Wallet },
  { label: "Atividade", icon: ShoppingCart },
  { label: "Lista de interesse", icon: Heart },
  { label: "Ofertas", icon: Tag },
  { label: "Arquivos baixados", icon: Download },
  { label: "Suporte", icon: CircleHelp },
];

const profileFields = [
  { label: "Nome de exibição", id: "displayName", required: true },
  { label: "Nome de usuário", id: "username", required: true },
  { label: "E-mail", id: "email", required: true, type: "email" },
  { label: "Nome ENS", id: "ensName", required: false, placeholder: ".eth" },
  { label: "Apelido da carteira", id: "walletName", required: false },
] as const;

type ProfileForm = Pick<
  User,
  "displayName" | "username" | "email" | "ensName" | "walletName"
>;

const emptyProfile: ProfileForm = {
  displayName: "",
  username: "",
  email: "",
  ensName: "",
  walletName: "",
};

const AVATAR_STORAGE_KEY = "kurio_profile_avatar";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      "Não foi possível concluir a operação."
    );
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}

function loadAvatar(): string | null {
  try {
    return localStorage.getItem(AVATAR_STORAGE_KEY);
  } catch {
    return null;
  }
}

export default function PerfilPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});

  const [avatar, setAvatar] = useState<string | null>(loadAvatar);
  const [avatarError, setAvatarError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!user) return;

    setProfile({
      displayName: user.displayName ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      ensName: user.ensName ?? "",
      walletName: user.walletName ?? "",
    });
  }, [user]);

  const saveMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth", "user"], updatedUser);

      setProfile({
        displayName: updatedUser.displayName ?? "",
        username: updatedUser.username ?? "",
        email: updatedUser.email ?? "",
        ensName: updatedUser.ensName ?? "",
        walletName: updatedUser.walletName ?? "",
      });

      setSuccessMessage("Perfil atualizado com sucesso!");
      setErrorMessage("");
    },
    onError: (error: unknown) => {
      setErrorMessage(getErrorMessage(error));
      setSuccessMessage("");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (result) => {
      setPasswordMessage(result.message || "Senha alterada com sucesso.");
      setPasswordError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: unknown) => {
      setPasswordError(getErrorMessage(error));
      setPasswordMessage("");
    },
  });

  function handleFieldChange(field: keyof ProfileForm, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile.displayName.trim() || !profile.username.trim()) {
      setErrorMessage("Preencha o nome de exibição e o nome de usuário.");
      setSuccessMessage("");
      return;
    }

    if (!profile.email.trim()) {
      setErrorMessage("Informe seu endereço de e-mail.");
      setSuccessMessage("");
      return;
    }

    saveMutation.mutate({
      displayName: profile.displayName.trim(),
      username: profile.username.trim(),
      email: profile.email.trim(),
      ensName: profile.ensName.trim(),
      walletName: profile.walletName.trim(),
    });
  }

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Preencha os três campos de senha.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("A nova senha deve ser diferente da atual.");
      return;
    }

    passwordMutation.mutate({
      currentPassword,
      newPassword,
    });
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("Selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("A imagem deve ter no máximo 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setAvatarError("Não foi possível carregar a imagem.");
        return;
      }

      try {
        localStorage.setItem(AVATAR_STORAGE_KEY, reader.result);
        setAvatar(reader.result);
        setAvatarError("");
      } catch {
        setAvatarError(
          "Não foi possível salvar a imagem. Tente uma imagem menor.",
        );
      }
    };

    reader.onerror = () => {
      setAvatarError("Ocorreu um erro ao ler a imagem.");
    };

    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    try {
      localStorage.removeItem(AVATAR_STORAGE_KEY);
      setAvatar(null);
      setAvatarError("");
    } catch {
      setAvatarError("Não foi possível remover a imagem.");
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      setErrorMessage("Não foi possível encerrar a sessão. Tente novamente.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#110B08] text-xs text-[#E8D9CE]">
        Carregando perfil...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#110B08] text-[#E8D9CE]">
        <Header search={search} setSearch={setSearch} />

        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="mb-3 text-lg font-semibold text-[#F4EEE8]">
            Entre na sua conta
          </h1>

          <p className="mb-6 text-sm text-[#B39463]">
            Você precisa estar autenticado para acessar seu perfil.
          </p>

          <Link
            to="/"
            className="inline-flex rounded-sm bg-[#D98845] px-5 py-3 text-xs font-bold text-[#110B08] hover:bg-[#E8A15F]"
          >
            Voltar ao início e entrar
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110B08] text-[#E8D9CE]">
      <Header search={search} setSearch={setSearch} />

      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-center gap-6 px-6 py-6 md:grid-cols-[216px_minmax(0,600px)]">
        <aside className="h-fit border border-[#D98845]/50 bg-[#241612] p-2">
          <h1 className="mb-1 px-1 py-1 text-xs font-bold text-[#F4EEE8]">
            Meu perfil
          </h1>

          <nav aria-label="Navegação do perfil" className="flex flex-col">
            {profileLinks.map(({ label, icon: Icon }, index) => (
              <Link
                key={label}
                to="/perfil"
                aria-current={index === 0 ? "page" : undefined}
                className={`flex items-center gap-2 border-l-2 px-2 py-2 text-[10px] transition-colors hover:bg-[#55321F]/40 hover:text-[#F4EEE8] ${
                  index === 0
                    ? "border-[#D98845] text-[#D98845]"
                    : "border-transparent text-[#D98845]/80"
                }`}
              >
                <Icon aria-hidden="true" size={12} />
                <span>{label}</span>
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 border-l-2 border-transparent px-2 py-2 text-left text-[10px] text-[#D98845]/80 transition-colors hover:bg-[#55321F]/40 hover:text-[#F4EEE8]"
            >
              <LogOut aria-hidden="true" size={12} />
              <span>Sair</span>
            </button>
          </nav>
        </aside>

        <section className="min-w-0">
          <h2 className="mb-5 text-xs font-semibold text-[#F4EEE8]">
            Perfil do colecionador
          </h2>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:gap-x-6">
              {profileFields.map((field) => (
                <label
                  key={field.id}
                  htmlFor={field.id}
                  className="flex min-w-0 flex-col gap-1.5 text-[10px] text-[#E8D9CE]"
                >
                  <span>
                    {field.label}
                    {field.required && (
                      <span className="text-[#F0805F]"> *</span>
                    )}
                  </span>

                  <Input
                    id={field.id}
                    name={field.id}
                    type={"type" in field ? field.type : "text"}
                    placeholder={
                      "placeholder" in field ? field.placeholder : undefined
                    }
                    value={profile[field.id]}
                    required={field.required}
                    onChange={(event) =>
                      handleFieldChange(field.id, event.target.value)
                    }
                    className="h-8 rounded-sm border-[#D98845]/20 bg-[#160F0C] px-2 text-xs text-[#E8D9CE] placeholder:text-[#8D7667] focus-visible:border-[#D98845] focus-visible:ring-[#D98845]/30"
                  />
                </label>
              ))}

              <div className="flex min-w-0 items-center gap-3 sm:col-start-2 sm:row-span-2 sm:row-start-3 sm:pl-1">
                <div
                  aria-label={`Avatar de ${profile.displayName || profile.username}`}
                  className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D98845]/40 bg-[#2A211D] text-2xl font-semibold text-[#D98845] shadow-lg"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Foto de perfil"
                      className="size-full object-cover"
                    />
                  ) : (
                    (profile.displayName || profile.username || "T")
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer rounded-sm bg-[#D98845] px-3 py-2 text-[10px] font-semibold text-[#110B08] transition-colors hover:bg-[#E8A15F]">
                    Alterar
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      aria-label="Alterar foto do perfil"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={removeAvatar}
                    disabled={!avatar}
                    className="px-2 py-2 text-[10px] text-[#E8D9CE] transition-colors hover:text-[#D98845] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>

            {avatarError && (
              <p role="alert" className="mt-3 text-xs text-[#F0805F]">
                {avatarError}
              </p>
            )}

            {errorMessage && (
              <p role="alert" className="mt-4 text-xs text-[#F0805F]">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p role="status" className="mt-4 text-xs text-emerald-400">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="mt-4 rounded-sm bg-[#D98845] px-5 py-2 text-[10px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D98845] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveMutation.isPending ? "Salvando..." : "Salvar alterações"}
            </button>
          </form>

          <form onSubmit={handlePasswordChange} className="mt-7 max-w-md">
            <fieldset>
              <legend className="mb-3 text-xs font-semibold text-[#F4EEE8]">
                Alterar senha
              </legend>

              <p className="mb-4 text-[10px] leading-relaxed text-[#B39463]">
                Informe sua senha atual e escolha uma nova senha com pelo
                menos 8 caracteres.
              </p>

              {[
                {
                  label: "Senha atual",
                  id: "current-password",
                  value: currentPassword,
                  onChange: setCurrentPassword,
                  autoComplete: "current-password",
                },
                {
                  label: "Nova senha",
                  id: "new-password",
                  value: newPassword,
                  onChange: setNewPassword,
                  autoComplete: "new-password",
                },
                {
                  label: "Confirmar nova senha",
                  id: "confirm-password",
                  value: confirmPassword,
                  onChange: setConfirmPassword,
                  autoComplete: "new-password",
                },
              ].map((field) => {
                const isVisible = visiblePasswords[field.id] ?? false;
                const ToggleIcon = isVisible ? EyeOff : Eye;

                return (
                  <label
                    key={field.id}
                    htmlFor={field.id}
                    className="mt-3 flex flex-col gap-1.5 text-[10px] text-[#E8D9CE]"
                  >
                    <span>{field.label}</span>

                    <span className="relative">
                      <Input
                        id={field.id}
                        name={field.id}
                        type={isVisible ? "text" : "password"}
                        autoComplete={field.autoComplete}
                        value={field.value}
                        required
                        onChange={(event) => {
                          field.onChange(event.target.value);
                          setPasswordError("");
                          setPasswordMessage("");
                        }}
                        className="h-8 rounded-sm border-[#D98845]/20 bg-[#160F0C] px-2 pr-9 text-xs text-[#E8D9CE] focus-visible:border-[#D98845] focus-visible:ring-[#D98845]/30"
                      />

                      <button
                        type="button"
                        aria-label={
                          isVisible ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() =>
                          setVisiblePasswords((current) => ({
                            ...current,
                            [field.id]: !isVisible,
                          }))
                        }
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-[#B39463] hover:text-[#D98845]"
                      >
                        <ToggleIcon aria-hidden="true" size={12} />
                      </button>
                    </span>
                  </label>
                );
              })}

              {passwordError && (
                <p role="alert" className="mt-3 text-xs text-[#F0805F]">
                  {passwordError}
                </p>
              )}

              {passwordMessage && (
                <p role="status" className="mt-3 text-xs text-emerald-400">
                  {passwordMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordMutation.isPending}
                className="mt-4 rounded-sm bg-[#D98845] px-5 py-2 text-[10px] font-bold text-[#110B08] transition-colors hover:bg-[#E8A15F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D98845] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordMutation.isPending
                  ? "Atualizando..."
                  : "Alterar senha"}
              </button>
            </fieldset>
          </form>
        </section>
      </main>
    </div>
  );
}
