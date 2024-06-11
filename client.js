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
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.computarVoto(
  { cpf: "12345675909", candidateNumber: 13 },
  (error, response) => {
    if (!error) {
      console.log("Reposta:", response);
    } else {
      console.error("Error:", error.message);
    }
  }
);
