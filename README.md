# IA.Agency — Landing Page

Landing page para agência de criação de sites com IA. Dark mode, gradientes neon (roxo `#8A05BE` + azul elétrico `#00D2FF`), inspirada na fluidez de interfaces como Nubank e Apple.

## Stack

- **React 18** + **Vite**
- **Tailwind CSS** — design tokens de cor/tipografia em `tailwind.config.js`
- **Framer Motion** — reveals de entrada (Hero, card de contato)
- **GSAP + ScrollTrigger** — rotação do núcleo 3D e o efeito "pin + fade" da seção "Como funciona"
- **React Three Fiber + drei** — o núcleo 3D da Hero
- **Lenis** — smooth scroll estilo Apple, sincronizado com o ScrollTrigger
- **React Router** — rotas públicas (`/`, `/login`, `/admin`) e protegidas (`/dashboard`, `/admin/dashboard`)
- **Firebase** — Authentication (e-mail/senha) e Firestore (leads e pedidos)

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

Build de produção:

```bash
npm run build
npm run preview
```

> **Nota sobre o Lenis:** o pacote foi renomeado de `@studio-freight/lenis` para `lenis`. Se o `npm install` falhar por causa dessa dependência, troque `"lenis"` por `"@studio-freight/lenis"` no `package.json` e ajuste o import em `src/hooks/useLenis.js`.

## Configurando o Firebase

O arquivo `.env` já vem preenchido com as credenciais do projeto `agencia-ia-db` que você me passou. Antes de rodar, faça isso **no Firebase Console** (https://console.firebase.google.com):

1. **Authentication** → aba "Sign-in method" → ative o provedor **E-mail/senha**.
2. **Firestore Database** → crie o banco (modo produção é o recomendado).
3. **Firestore Database → Regras** → cole o conteúdo de `firestore.rules` (arquivo na raiz do projeto) e publique.
   - Sem isso, o Firestore fica no modo padrão: totalmente bloqueado (nada funciona) ou totalmente aberto por 30 dias (qualquer um lê/escreve tudo), dependendo de como o banco foi criado.
4. **Criando o primeiro administrador**: como não há um back-end separado neste projeto, a promoção a admin é manual:
   - Crie a conta normalmente pela tela `/login` (ela nasce com `role: "client"`).
   - No Firebase Console → Firestore Database → coleção `users` → abra o documento com o UID desse usuário → troque o campo `role` de `"client"` para `"admin"`.
   - A partir daí, essa conta pode logar em `/admin` e acessar `/admin/dashboard`.

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | público | landing page |
| `/login` | público | login e cadastro de cliente |
| `/admin` | público | login do administrador |
| `/dashboard` | cliente autenticado | novo pedido + lista dos próprios pedidos |
| `/admin/dashboard` | admin autenticado | lista de todos os leads e pedidos |

## Coleções do Firestore

- **`users/{uid}`** — perfil de cada conta (`name`, `email`, `role: "client" | "admin"`).
- **`leads`** — envios do formulário de contato da landing page (público, sem login).
- **`orders`** — pedidos feitos por clientes logados em `/dashboard` (`userId`, `siteType`, `description`, `budget`, `deadline`, `status`).

## Estrutura

```
src/
├── App.jsx                        # roteador (AuthProvider + BrowserRouter + Routes)
├── main.jsx                       # entry point
├── index.css                      # Tailwind + tokens de componente (glass, gradiente)
├── lib/
│   ├── gsap.js                    # registro único do plugin ScrollTrigger
│   └── firebase.js                # initializeApp + exports de auth/db
├── context/AuthContext.jsx        # user, role, login, register, logout
├── services/
│   ├── leads.js                   # createLead + subscribeToLeads (Firestore)
│   └── orders.js                  # createOrder + subscribeToUserOrders/AllOrders
├── hooks/useLenis.js               # smooth scroll <-> ScrollTrigger
├── components/
│   ├── auth/ProtectedRoute.jsx     # guarda de rota (login + role)
│   ├── layout/Navbar.jsx           # navbar com glass ao rolar + estado de login
│   ├── layout/Footer.jsx
│   ├── sections/Hero.jsx           # título gigante + núcleo 3D rotacionando no scroll
│   ├── sections/HowItWorks.jsx     # seção pinada com fade entre os 3 passos
│   ├── sections/Contact.jsx        # card glassmorphism + formulário (grava lead no Firestore)
│   ├── three/AICore.jsx            # cena R3F (icosaedro distorcido + wireframe neon)
│   └── ui/GlowButton.jsx           # botão com brilho neon no hover
└── pages/
    ├── Landing.jsx                 # monta a landing page (antigo conteúdo do App.jsx)
    ├── Login.jsx                   # login/cadastro de cliente
    ├── AdminLogin.jsx               # login do administrador
    ├── ClientDashboard.jsx          # /dashboard — novo pedido + meus pedidos
    └── AdminDashboard.jsx           # /admin/dashboard — todos os leads e pedidos
```

## Decisões de design

- **Tipografia**: `Space Grotesk` (display, headlines) + `Inter` (corpo/UI) + `JetBrains Mono` (labels, números dos passos) — reforça o caráter "tech/IA" sem parecer genérico.
- **Cores**: roxo Nubank (`#8A05BE`) e azul elétrico (`#00D2FF`) como duotone de gradiente, sobre fundo quase-preto (`#05050A`).
- **Elemento-assinatura**: o núcleo 3D da Hero não gira sozinho — a rotação é escrita diretamente via `ref.current.rotation` dentro do `onUpdate` do `ScrollTrigger`, então o objeto literalmente "responde" ao gesto de scroll do usuário, reforçando a narrativa "a IA projeta enquanto você navega".
- **Acessibilidade**: `prefers-reduced-motion` é respeitado em `index.css`, e o foco de teclado permanece visível (nenhum `outline` foi removido globalmente).

## Formulário de contato e pedidos

O `Contact.jsx` da landing page já chama `createLead()` (`src/services/leads.js`), que grava direto na coleção `leads` do Firestore — não precisa de nenhum backend extra. O formulário de "Novo pedido" em `/dashboard` funciona da mesma forma, via `createOrder()` (`src/services/orders.js`), na coleção `orders`.
