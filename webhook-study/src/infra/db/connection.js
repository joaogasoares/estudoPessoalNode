import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/webhook_study",
    // Você pode adicionar outras opções aqui, como ssl, max, etc.
});
// Exemplo de função para testar a conexão
export async function testConnection() {
    const client = await pool.connect();
    try {
        await client.query("SELECT 1");
        console.log("Database connection OK");
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=connection.js.map