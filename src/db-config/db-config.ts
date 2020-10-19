import { Pool } from 'pg';

export default new Pool({
    max: 20,
    // connectionString: 'postgres://admin:admin1234@localhost:5433/sub-ji',
    // To do add from env
    connectionString: 'postgres://admin:admin1234@postgres:5432/sub-ji',
    idleTimeoutMillis: 30000
});