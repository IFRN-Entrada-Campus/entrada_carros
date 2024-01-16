# Frontend do sistema

## Variáveis de ambiente do sistema

Defina o host do certificado localmente adicionando um .env com(substitua localhost pelo seu domínio):

```bash
HOST=localhost
```

e no Dockerfile:

```Dockerfile
COPY .env .
ENV HOST=localhost
```

## Variáveis de ambiente para o angular

Crie uma pasta 'environments' dentro de src/ e dentro dela um arquivo environment.ts com a seguinte configuração(substitua localhost pelo seu domínio):

```Typescript
export const environment = {
    apiUrl: 'https://localhost/api'
}
```
