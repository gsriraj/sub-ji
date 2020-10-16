"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
exports.default = new pg_1.Pool({
    max: 20,
    connectionString: 'postgres://admin:admin1234@localhost:5433/sub-ji',
    idleTimeoutMillis: 30000
});
//# sourceMappingURL=db-config.js.map