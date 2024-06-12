const readline = require('readline');
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./voto.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const votingProto = grpc.loadPackageDefinition(packageDefinition).voting;

const client = new votingProto.VotingService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const leitor = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perguntar(question) {
  return new Promise((resolve) => leitor.question(question, resolve));
}

const computarVoto = async (cpf, candidateNumber) => {
  return new Promise((resolve, reject) => {
    client.computarVoto({ cpf, candidateNumber }, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};  

async function main() {
  while (true) {
    console.log('----Menu----');
    console.log('1 - Votar');
    console.log('2 - Sair');

    let option = await perguntar("\nDigite a sua escolha: ");

    if (option === "2") {
      break;
    }

    if (option !== "1") {
      console.log("Opção inválida, tente novamente.");
      continue;
    }

    const cpf = await perguntar("\nDigite seu CPF: ");
    const candidateNumber = await perguntar("Digite o número do candidato: ");

    try {
      const response = await computarVoto(cpf, Number(candidateNumber));
      console.log("");
      response.success ? console.log("Voto computado com sucesso!") : console.log("Erro ao computar voto!");
    } catch (error) {
      console.error(error.details);
    }
  }

  leitor.close();
}

main();
