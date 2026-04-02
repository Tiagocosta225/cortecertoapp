Diretorio mantido apenas por compatibilidade historica.

O `nginx` da stack Docker nao termina mais TLS no origin e escuta somente na porta `80`, entao certificados locais neste diretorio nao sao mais usados pelo fluxo atual.

Se a aplicacao estiver atras da Cloudflare, a terminacao TLS deve acontecer na borda da Cloudflare e o acesso ate o origin segue em HTTP.
