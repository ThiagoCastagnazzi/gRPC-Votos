const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("voting.db");

db.serialize(() => {
  db.run(
    `
      CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpf TEXT,
      candidateNumber INTEGER,
      UNIQUE(cpf)
      );
    `
  );
  db.run(
    `
      CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      number INTEGER,
      UNIQUE(number)
    );
    `
  );

  const candidates = [
    { name: "Lula", number: 13 },
    { name: "Bolsonaro", number: 22 },
    { name: "Véio da Van", number: 51 },
  ];

  candidates.forEach((candidate) => {
    db.run("INSERT OR IGNORE INTO candidates(name, number) VALUES(?, ?)", [
      candidate.name,
      candidate.number,
    ]);
  });
});

const PROTO_PATH = "./voto.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const votingProto = grpc.loadPackageDefinition(packageDefinition).voting;

const computarVoto = (call, callback) => {
  const { cpf, candidateNumber } = call.request;

  db.get("SELECT cpf FROM votes WHERE cpf = ?", [cpf], (err, row) => {
    if (err) {
      callback(
        { code: grpc.status.INTERNAL, message: "Erro no banco de dados" },
        null
      );
      return;
    }
    if (row) {
      callback(
        {
          code: grpc.status.ALREADY_EXISTS,
          message: "CPF já utilizado",
        },
        null
      );
      return;
    }

    db.get(
      "SELECT number FROM candidates WHERE number = ?",
      [candidateNumber],
      (err, row) => {
        if (err) {
          callback(
            { code: grpc.status.INTERNAL, message: "Erro no banco de dados" },
            null
          );
          return;
        }
        if (!row) {
          callback(
            { code: grpc.status.NOT_FOUND, message: "Candidato não existente" },
            null
          );
          return;
        }

        db.run(
          "INSERT INTO votes(cpf, candidateNumber) VALUES(?, ?)",
          [cpf, candidateNumber],
          (err) => {
            if (err) {
              callback(
                {
                  code: grpc.status.INTERNAL,
                  message: "Erro ao registrar voto",
                },
                null
              );
              return;
            }
            callback(null, { success: true });
          }
        );
      }
    );
  });
};

const server = new grpc.Server();
server.addService(votingProto.VotingService.service, { computarVoto });

const PORT = "50051";
server.bindAsync(
  `127.0.0.1:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
    server.start();
  }
);
