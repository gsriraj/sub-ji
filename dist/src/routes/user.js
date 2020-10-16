"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_1 = __importDefault(require("../controllers/user"));
var router = express_1.Router();
var userController = new user_1.default();
var UserRoutes = /** @class */ (function () {
    function UserRoutes(router) {
        this.router = router;
        this.userController = new user_1.default();
        this.config();
    }
    UserRoutes.prototype.config = function () {
        this.router.get('/user/:username', userController.get);
    };
    return UserRoutes;
}());
exports.default = UserRoutes;
//# sourceMappingURL=user.js.map