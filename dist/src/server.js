"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var db_config_1 = __importDefault(require("./db-config/db-config"));
var router_1 = __importDefault(require("./routes/router"));
var Server = /** @class */ (function () {
    function Server() {
        var _this = this;
        this.start = function (port) {
            return new Promise(function (resolve, reject) {
                _this.app.listen(port, function () {
                    resolve(port);
                }).on('error', function (err) { return reject(err); });
            });
        };
        this.app = express_1.default();
        this.route = router_1.default;
        this.config();
        this.routerConfig();
        this.dbConnect();
    }
    Server.prototype.config = function () {
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(body_parser_1.default.json({ limit: '1mb' }));
    };
    Server.prototype.dbConnect = function () {
        db_config_1.default.connect(function (err, client, done) {
            if (err)
                throw new Error(err);
            console.log('Database connected!');
        });
    };
    Server.prototype.routerConfig = function () {
        this.app.use('/', this.route);
    };
    return Server;
}());
exports.default = Server;
//# sourceMappingURL=server.js.map