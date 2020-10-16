"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./server"));
var port = parseInt(process.env.PORT || '19093');
var starter = new server_1.default().start(port)
    .then(function (port) { return console.log("Running on port " + port); })
    .catch(function (error) { return console.log(error); });
exports.default = starter;
//# sourceMappingURL=index.js.map