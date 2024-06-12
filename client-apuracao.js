const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./voto.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const votingProto = grpc.loadPackageDefinition(packageDefinition).voting;

const client = new votingProto.VotingService(
  "localhost:50052", // Conectar ao servidor de apuração
  grpc.credentials.createInsecure()
);

const apurar = async () => {
  return new Promise((resolve, reject) => {
    client.apuracaoVotos({}, (error, response) => {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
};

const main = async () => {
  try {
    const resultado = await apurar();
    console.log("Resultados da Apuração:");
    console.log(resultado);
    const totalVotes = resultado.results.reduce((acc, row) => acc + row.count, 0);

    if (resultado.results) {
      resultado.results.forEach((row) => {
        const percentage = ((row.count / totalVotes) * 100).toFixed(2);
        console.log(`${row.candidate}: ${row.count} votos (${percentage}%)`);
      });
    } else {
      console.log("Nenhum resultado encontrado.");
    }
  } catch (error) {
    console.error("Erro ao obter apuração de votos:", error);
  }
};

main();
