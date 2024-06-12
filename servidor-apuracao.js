const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./voto.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const votingProto = grpc.loadPackageDefinition(packageDefinition).voting;

const client = new votingProto.VotingService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const apuracaoVotos = (call, callback) => {
  client.apuracaoVotos({}, (error, response) => {
    if (!error) {
      callback(null, response);
    } else {
      callback(error, null);
    }
  });
};

const server = new grpc.Server();
server.addService(votingProto.VotingService.service, { apuracaoVotos });

const PORT = "50052";
server.bindAsync(
  `127.0.0.1:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Apuracao Server running at http://127.0.0.1:${PORT}`);
    server.start();
  }
);
