"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = __importDefault(require("./user"));
var Routes = /** @class */ (function () {
    function Routes() {
        this.router = express_1.default.Router();
        this.config();
    }
    Routes.prototype.config = function () {
        new user_1.default(this.router);
    };
    return Routes;
}());
exports.default = new Routes().router;
//# sourceMappingURL=router.js.map