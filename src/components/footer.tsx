export function Footer() {
  const sections = [
    {
      title: "Meu perfil",
      links: [
        ["Meu perfil", "#perfil"],
        ["Minha coleção", "#colecoes"],
        ["Atividade", "#atividade"],
        ["Estúdio do criador", "#criador"],
        ["Lista de interesse", "#interesses"],
      ],
    },
    {
      title: "Central de ajuda",
      links: [
        ["Central de ajuda", "#aprenda"],
        ["Como comprar NFTs", "#aprenda"],
        ["Carteira e segurança", "#aprenda"],
        ["Política do mercado", "#aprenda"],
        ["Denunciar item", "mailto:contato@kurio.com"],
      ],
    },
    {
      title: "Coleções",
      links: [
        ["Arte digital", "#nfts"],
        ["Fotografia", "#nfts"],
        ["Música", "#nfts"],
        ["Arte 3D", "#nfts"],
        ["Utilidade", "#nfts"],
      ],
    },
  ];

  const socials = [
    {
      network: "Facebook",
      icon: <span className="font-bold">f</span>,
    },
    {
      network: "Instagram",
      icon: (
        <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      network: "Twitter",
      icon: (
        <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.932 4.932 0 0 0 2.163-2.723 9.99 9.99 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.95 13.95 0 0 1 1.64 3.162a4.916 4.916 0 0 0 1.523 6.557 4.9 4.9 0 0 1-2.229-.616v.062a4.918 4.918 0 0 0 3.946 4.817 4.93 4.93 0 0 1-2.224.084 4.92 4.92 0 0 0 4.59 3.414A9.87 9.87 0 0 1 0 19.54a13.93 13.93 0 0 0 7.548 2.213c9.057 0 14.01-7.504 14.01-14.01 0-.213-.005-.425-.014-.636a10.01 10.01 0 0 0 2.46-2.548z" />
        </svg>
      ),
    },
    {
      network: "LinkedIn",
      icon: <span className="text-[9px] font-bold">in</span>,
    },
    {
      network: "YouTube",
      icon: (
        <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
          <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  const wallets = ["METAMASK", "WALLETCONNECT", "COINBASE"];
  const linkClass =
    "transition-colors hover:text-[#e99a4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e99a4a]";

  return (
  <>

      <section
        id="aprenda"
        aria-label="Vantagens e novidades da Kurio"
        className="mt-8 grid grid-cols-1 border-b border-[#3c281b] bg-[#241612] px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4"
      >
        <article className="border-b border-[#80532f] px-2 py-3 sm:border-b-0 sm:border-r sm:px-4">
          <span className="mb-2 grid size-10 place-items-center rounded-full bg-[#d28a4c] font-mono text-xs font-bold text-[#1a100a]">W</span>
          <h3 className="mb-1 mt-0 font-mono text-[11px] font-bold text-[#f4eee8] sm:text-xs">Segurança da carteira</h3>
          <p className="m-0 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
            Proteja sua carteira e colecione arte digital verificada com confiança.
          </p>
        </article>
        <article className="border-b border-[#80532f] px-2 py-3 sm:border-b-0 sm:border-r sm:px-4">
          <span className="mb-2 grid size-10 place-items-center rounded-full bg-[#d28a4c] font-mono text-xs font-bold text-[#1a100a]">C</span>
          <h3 className="mb-1 mt-0 font-mono text-[11px] font-bold text-[#f4eee8] sm:text-xs">Criadores em destaque</h3>
          <p className="m-0 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
            Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
          </p>
        </article>
        <article className="border-b border-[#80532f] px-2 py-3 sm:border-b-0 sm:border-r sm:px-4">
          <span className="mb-2 grid size-10 place-items-center rounded-full bg-[#d28a4c] font-mono text-xs font-bold text-[#1a100a]">D</span>
          <h3 className="mb-1 mt-0 font-mono text-[11px] font-bold text-[#f4eee8] sm:text-xs">Alertas de lançamentos</h3>
          <p className="m-0 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
            Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
          </p>
        </article>
        <article className="px-2 py-3 sm:px-4">
          <h3 className="mb-2 mt-0 font-mono text-[11px] font-bold leading-tight text-[#f4eee8] sm:text-xs">
            Antecipe-se ao próximo lançamento
          </h3>
          <form action="#aprenda" className="flex">
            <label className="sr-only" htmlFor="newsletter-email">Seu e-mail</label>
            <input
              className="min-w-0 flex-1 rounded-l border border-[#80532f] bg-[#1a100a] px-2 py-1.5 font-mono text-[9px] text-[#f4eee8] outline-none placeholder:text-[#aa9787] focus:border-[#e99a4a]"
              id="newsletter-email"
              name="email"
              placeholder="digite seu e-mail..."
              type="email"
            />
            <button className="rounded-r bg-[#d28a4c] px-2 font-mono text-[9px] font-bold text-[#1a100a] transition-colors hover:bg-[#e99a4a]" type="submit">
              Enviar
            </button>
          </form>
          <p className="mb-0 mt-2 font-mono text-[9px] leading-relaxed text-[#c5ad96] sm:text-[10px]">
            Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
          </p>
        </article>
      </section>
    <footer className="marketplace-footer mt-0 block w-full border-0 bg-[#21150f] p-0 font-mono text-[#e0d4c8]">
      <div className="border-b border-[#5b3b2a] bg-[#3a2415] px-6 py-4 text-[10px] text-[#f4eee8]">
        <div className="grid grid-cols-2 items-center gap-x-4 gap-y-2 sm:grid-cols-4 sm:gap-x-3">
          <a
            href="#inicio"
            className="text-[10px] font-bold tracking-[0.14em] text-[#f7f1eb]"
            aria-label="Kurio - início"
          >
            KURIO
          </a>

          <span className="leading-normal text-[#f3ece6]">
            Feito para colecionadores,
            <br />
            criadores e cultura
          </span>

          <a className={linkClass} href="mailto:contato@email.com">
            contato@email.com
          </a>

          <a className={`${linkClass} justify-self-end`} href="tel:+551140028922">
            +55 11 4002 8922
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-8 bg-[#21150f] px-6 py-6 md:grid-cols-4">
        {sections.map((section) => (
          <div key={section.title} className="min-w-0">
            <h2 className="mb-2 mt-0 font-mono text-[12px] font-bold text-[#f4eee8]">
              {section.title}
            </h2>

            <ul className="m-0 grid list-none gap-1.5 p-0 font-mono text-[10px] leading-[1.5] text-[#e0d4c8]">
              {section.links.map(([label, href]) => (
                <li key={label} className="min-w-0">
                  <a className={linkClass} href={href}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="min-w-0">
          <h2 className="mb-2 mt-0 font-mono text-[12px] font-bold text-[#f4eee8]">
            Redes sociais
          </h2>

          <div className="mb-5 flex flex-wrap items-center gap-1.5">
            {socials.map(({ icon, network }) => (
              <a
                aria-label={network}
                className="grid size-6 shrink-0 place-items-center rounded-[3px] border border-[#80532f] text-[10px] text-[#e99a4a] transition-colors hover:bg-[#3a2415] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e99a4a]"
                href="#social"
                key={network}
              >
                {icon}
              </a>
            ))}
          </div>

          <h3 className="mb-1 mt-0 font-mono text-[11px] font-bold text-[#f4eee8]">
            Carteiras compatíveis
          </h3>

          <div className="flex flex-wrap gap-1">
            {wallets.map((wallet) => (
              <span
                className="rounded-[3px] border border-[#80532f] bg-[#3a2415] px-1 py-0.5 font-mono text-[7px] text-[#d28a4c]"
                key={wallet}
              >
                {wallet}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#130d0a] py-1.5 text-center font-mono text-[9px] text-[#e0d4c8]">
        © 2026 Kurio. Propriedade digital para todos.
      </div>
    </footer>
  </>
  );
}
