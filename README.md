# Sistema de Votação usando gRPC e SQLite

Este projeto implementa um sistema de votação distribuído utilizando gRPC para comunicação entre cliente e servidor, e SQLite para armazenamento dos dados. O sistema consiste em dois componentes principais: um servidor de votação e um servidor de apuração.

## Requisitos

Para executar este projeto, você precisa ter os seguintes requisitos instalados:

- Node.js (v20.11.1 ou superior)
- npm (geralmente vem junto com o Node.js)
- SQLite (certifique-se de que o SQLite esteja instalado e configurado no seu sistema operacional)

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando na raiz do projeto:

```bash
npm install
```

## Execução

Para executar o servidor de votação, execute o seguinte comando na raiz do projeto:

```bash
node servidor-votacao.js
```

Para executar o servidor de apuração, execute o seguinte comando na raiz do projeto:

```bash
node servidor-apuracao.js
```

## Uso

Para votar em um candidato, coloque os dados dentro da função client.computarVoto() no arquivo client.js e execute o seguinte comando na raiz do projeto:

```bash
node client.js
```

## Autores

- [Thiago Castagnazzi](https://github.com/ThiagoCastagnazzi)
- [Lucas Monteiro](https://github.com/LucasMonteiroS)
- [Gustavo Cruz](https://github.com/Gustavo-Cruz-Pinheiro)
