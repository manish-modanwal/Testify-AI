"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepositories = void 0;
const rest_1 = require("@octokit/rest");
const getRepositories = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = new rest_1.Octokit({ auth: token });
    try {
        const { data } = yield octokit.repos.listForAuthenticatedUser({
            type: 'all',
            sort: 'updated',
        });
        return data;
    }
    catch (error) {
        console.error('Error fetching repositories:', error);
        throw new Error('Failed to fetch repositories from GitHub.');
    }
});
exports.getRepositories = getRepositories;
