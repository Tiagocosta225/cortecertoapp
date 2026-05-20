# CorteCertoApp Mobile

Aplicativo Expo/React Native do CorteCertoApp para Android.

## Desenvolvimento

```bash
npm install
npm run dev -w @cortecerto/mobile
```

Por padrão, o build nativo usa a API pública:

```txt
https://app.cortecertoapp.com.br/api
```

Para apontar para outro backend durante desenvolvimento:

```bash
EXPO_PUBLIC_API_BASE_URL=http://SEU_IP_LOCAL:3000/api npm run dev -w @cortecerto/mobile
```

## Play Store

Antes de publicar, confira:

- `android.package`: `br.com.cortecertoapp.mobile`
- `android.versionCode`: incrementado a cada envio
- política de privacidade: `https://cortecertoapp.com.br/privacidade`
- exclusão de conta: `https://cortecertoapp.com.br/exclusao-de-conta`
- conta de teste para revisão do Google Play em App access
- formulário Data safety preenchido com nome, e-mail, telefone, dados de conta, barbearia, agenda e pagamentos

Build de teste instalável:

```bash
npm run build:android:preview -w @cortecerto/mobile
```

Build para Play Store em `.aab`:

```bash
npm run build:android:production -w @cortecerto/mobile
```

Envio para o track interno configurado no `eas.json`:

```bash
npm run submit:android -w @cortecerto/mobile
```

O primeiro upload no Google Play normalmente precisa ser feito manualmente no Play Console antes de automatizar o envio pelo EAS Submit.
