const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("voting.db");

const displayResults = () => {
  db.all(
    `
      SELECT candidates.name as candidate, COALESCE(COUNT(votes.candidateNumber), 0) as count
      FROM candidates
      LEFT JOIN votes ON candidates.number = votes.candidateNumber
      GROUP BY candidates.name
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error("Erro no banco de dados:", err.message);
        return;
      }

      const totalVotes = rows.reduce((acc, row) => acc + row.count, 0);
      console.log("Resultados da Votação:");

      rows.forEach((row) => {
        const percentage = ((row.count / totalVotes) * 100).toFixed(2);
        console.log(`${row.candidate}: ${row.count} votos (${percentage}%)`);
      });

      console.log("");
    }
  );
};

const monitorVotes = () => {
  let lastVoteCount = 0;

  setInterval(() => {
    db.get("SELECT COUNT(*) as count FROM votes", (err, row) => {
      if (err) {
        console.error("Erro no banco de dados:", err.message);
        return;
      }

      const currentVoteCount = row.count;
      if (currentVoteCount > lastVoteCount) {
        lastVoteCount = currentVoteCount;
        displayResults();
      }
    });
  }, 2000);
};

monitorVotes();
