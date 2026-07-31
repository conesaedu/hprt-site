# Plano: Agenda de Treinamentos HPRT Brasil

## O que vamos construir

Uma página dedicada `/treinamentos` para divulgar a agenda de treinamentos técnicos e comerciais da HPRT Brasil, com inscrição direta no site. O diferencial será destacado: **treinamentos sem custo para clientes que compram com a HPRT Brasil**.

## Decisões já confirmadas
- Formato: **página dedicada** (não apenas seção na home).
- Conteúdo: treinamentos **técnicos e comerciais**.
- Inscrição: **formulário no site** (nome, e-mail, empresa, telefone opcional).

## Backend: Lovable Cloud

O projeto agora usa Lovable Cloud. Precisamos de duas tabelas para armazenar os treinamentos e as inscrições.

### 1. Migration de banco
Criar tabelas:

- `public.trainings` — treinamentos disponíveis:
  - `title` (título do treinamento)
  - `type` (técnico ou comercial)
  - `audience` (público-alvo)
  - `date` (data e hora)
  - `format` (presencial, online, híbrido)
  - `location` (local/link)
  - `seats` (vagas totais)
  - `spots` (vagas restantes)
  - `description` (resumo)
  - `is_active` (se está aberto para inscrição)

- `public.training_registrations` — inscrições:
  - `training_id` (qual treinamento)
  - `name`, `email`, `company`, `phone`
  - `is_client` (se é cliente HPRT)
  - `status` (pending, confirmed, cancelled)

Aplicar GRANTs e RLS:
- `trainings`: leitura pública (anon) para visitantes verem a agenda; gerenciamento por `service_role`.
- `training_registrations`: inserção pública (anon) para permitir inscrição sem login; leitura apenas por `service_role`.

### 2. Server functions
- `listTrainings()`: retorna treinamentos ativos ordenados por data.
- `registerForTraining(data)`: valida com Zod e insere inscrição no banco.

## Frontend

### 3. Página `/treinamentos`
Criar `src/routes/treinamentos.tsx` com:
- Head SEO específico (título, descrição, OG).
- Nav e Footer reutilizados.
- Hero da página com headline forte sobre capacitação e o benefício "grátis para clientes".
- Lista de treinamentos em cards, mostrando:
  - data/horário,
  - tipo (técnico/comercial),
  - formato,
  - vagas restantes,
  - botão "Inscrever-se".
- Modal/formulário de inscrição ao clicar no botão.
- Seção de FAQ rápido: "É necessário ser cliente?", "Como recebo o link?", "Há certificado?".

### 4. Navegação
- Adicionar "Treinamentos" no menu do `Nav.tsx`.
- Adicionar link no `Footer.tsx`.
- Adicionar um CTA curto na home (`src/routes/index.tsx`) após o catálogo, convidando para a agenda.

### 5. Seed inicial
Inserir 3 treinamentos de exemplo na migration para a página já nascer populada:
- Instalação e configuração de impressoras de etiquetas (técnico)
- Operacionalização de coletores de dados (técnico)
- Venda consultiva de soluções de identificação (comercial)

## Texto sugerido para aprovação

Vou manter o tom arrojado e direto que usamos no posicionamento:

- **H1 da página:** "Capacite sua equipe direto com quem entende de impressão e identificação."
- **Subhead:** "Treinamentos técnicos e comerciais com a engenharia HPRT. Gratuitos para clientes que compram conosco."
- **Benefício em destaque:** "Sem custo para clientes HPRT Brasil."

## Critério de conclusão
- Página `/treinamentos` acessível e renderizando os treinamentos do banco.
- Formulário de inscrição validando campos e salvando no banco.
- Menu e footer atualizados.
- Typecheck e build passando.

Se quiser, posso ajustar o texto da página, a quantidade de treinamentos iniciais ou os campos do formulário antes de começar.