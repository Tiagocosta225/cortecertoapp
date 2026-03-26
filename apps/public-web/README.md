# CorteCerto - Aplicativo de Agendamento para Barbearia

## Descrição
O CorteCerto é um aplicativo web completo para agendamento de horários em barbearias, desenvolvido com React e utilizando as cores da marca (preto, branco e laranja) baseadas na imagem fornecida.

## Funcionalidades

### 🔐 Autenticação
- Tela de login e cadastro com design moderno
- Formulários com validação
- Interface com abas para alternar entre login e cadastro

### 🏠 Tela Principal (Dashboard)
- Boas-vindas personalizadas ao usuário
- Visualização dos próximos agendamentos
- Botão destacado para novo agendamento
- Seção de serviços disponíveis com preços
- Avaliações da barbearia
- Navegação inferior fixa

### 📅 Sistema de Agendamento (4 Passos)
1. **Seleção de Serviço**: Corte Simples, Corte + Barba, Barba, Sobrancelha
2. **Escolha do Barbeiro**: Perfis com especialidades, avaliações e experiência
3. **Seleção de Data**: Calendário com datas disponíveis
4. **Escolha de Horário**: Grade de horários disponíveis + resumo do agendamento

### ✅ Confirmação de Agendamento
- Tela de sucesso com todos os detalhes
- Informações da barbearia (endereço, telefone)
- Ações rápidas: adicionar ao calendário, compartilhar
- Informações importantes e dicas
- Botões para novo agendamento ou voltar ao início

### 👤 Perfil do Usuário
- Informações pessoais editáveis
- Estatísticas (total de agendamentos e gastos)
- Histórico completo com avaliações por estrelas
- Configurações (notificações, privacidade)
- Opção de logout

## Design e UX

### 🎨 Paleta de Cores
- **Primária**: #FF6600 (Laranja) - Botões de ação, destaques
- **Secundária**: #1A1A1A (Preto) - Textos principais, ícones
- **Base**: #FFFFFF (Branco) - Fundos, textos secundários
- **Neutras**: Tons de cinza para elementos auxiliares

### 📱 Responsividade
- Design mobile-first otimizado para smartphones
- Layout adaptável para diferentes tamanhos de tela
- Navegação touch-friendly
- Componentes acessíveis

### 🎯 Experiência do Usuário
- Fluxo intuitivo de agendamento em 4 passos
- Feedback visual claro para seleções
- Barra de progresso durante o agendamento
- Navegação consistente entre telas
- Micro-interações e transições suaves

## Tecnologias Utilizadas

- **React 18** - Framework principal
- **React Router** - Navegação entre páginas
- **Tailwind CSS** - Estilização e design system
- **Shadcn/UI** - Componentes de interface
- **Lucide React** - Ícones modernos
- **Vite** - Build tool e desenvolvimento

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── LoginScreen.jsx     # Tela de login/cadastro
│   ├── HomeScreen.jsx      # Dashboard principal
│   ├── BookingScreen.jsx   # Sistema de agendamento
│   ├── ProfileScreen.jsx   # Perfil do usuário
│   └── ConfirmationScreen.jsx # Confirmação de agendamento
├── assets/
│   └── logo.png           # Logo da barbearia
├── App.jsx                # Componente principal com roteamento
├── App.css                # Estilos customizados e variáveis CSS
└── main.jsx               # Ponto de entrada da aplicação
```

## Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Build para produção:**
   ```bash
   npm run build
   ```

## Funcionalidades Implementadas

✅ Sistema completo de autenticação  
✅ Dashboard com agendamentos e serviços  
✅ Fluxo de agendamento em 4 etapas  
✅ Seleção de serviços, barbeiros, datas e horários  
✅ Tela de confirmação com detalhes completos  
✅ Perfil do usuário com histórico e estatísticas  
✅ Design responsivo e acessível  
✅ Navegação intuitiva entre telas  
✅ Paleta de cores consistente com a marca  
✅ Componentes reutilizáveis e modulares  

## Próximos Passos (Melhorias Futuras)

- Integração com backend real
- Sistema de notificações push
- Pagamento online integrado
- Avaliação de serviços
- Chat com a barbearia
- Integração com calendário do dispositivo
- Modo escuro
- Múltiplos idiomas

## Autor

Desenvolvido com base na imagem da marca CorteCerto, utilizando as melhores práticas de desenvolvimento React e design de interfaces modernas.

