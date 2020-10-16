import { Pool } from 'pg';

export default new Pool ({
    max: 20,
    connectionString: 'postgres://admin:admin1234@:port/subji',
    idleTimeoutMillis: 30000
});