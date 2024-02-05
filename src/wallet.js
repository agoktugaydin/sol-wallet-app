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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var web3 = require("@solana/web3.js");
var connection = new web3.Connection(web3.clusterApiUrl('testnet'));
var wallets = [];
var currentWalletIndex = -1;
function loadWallets() {
    try {
        var data = fs.readFileSync('wallets.json', 'utf-8');
        wallets = JSON.parse(data);
        // publicKey özelliklerini PublicKey nesnelerine dönüştür
        wallets.forEach(function (wallet) {
            wallet.publicKey = new web3.PublicKey(wallet.publicKey);
        });
    }
    catch (err) {
        console.error("Error loading wallets:", err);
    }
}
function saveWallets() {
    try {
        fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));
    }
    catch (err) {
        console.error("Error saving wallets:", err);
    }
}
function switchWallet(index) {
    if (index >= 0 && index < wallets.length) {
        currentWalletIndex = index;
        console.log("Switched to wallet ".concat(currentWalletIndex));
    }
    else {
        console.error("Invalid wallet index.");
    }
}
function createWallet() {
    return __awaiter(this, void 0, void 0, function () {
        var newKeypair, balance, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    newKeypair = web3.Keypair.generate();
                    return [4 /*yield*/, connection.getBalance(newKeypair.publicKey)];
                case 1:
                    balance = _a.sent();
                    wallets.push({
                        publicKey: newKeypair.publicKey,
                        balance: balance / web3.LAMPORTS_PER_SOL
                    });
                    saveWallets();
                    console.log("Wallet created. Public Key: ".concat(newKeypair.publicKey.toBase58(), ", Balance: ").concat(balance / web3.LAMPORTS_PER_SOL, " SOL"));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error("Error creating wallet:", err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function airdrop(amount) {
    if (amount === void 0) { amount = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var wallet, signature, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (currentWalletIndex === -1) {
                        console.error("No wallet selected.");
                        return [2 /*return*/];
                    }
                    wallet = wallets[currentWalletIndex];
                    return [4 /*yield*/, connection.requestAirdrop(wallet.publicKey, amount * web3.LAMPORTS_PER_SOL)];
                case 1:
                    signature = _a.sent();
                    return [4 /*yield*/, connection.confirmTransaction(signature)];
                case 2:
                    _a.sent();
                    console.log("Airdrop of ".concat(amount, " SOL completed to wallet ").concat(currentWalletIndex, "."));
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error("Error during airdrop:", err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function checkBalance() {
    return __awaiter(this, void 0, void 0, function () {
        var wallet, balance, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (currentWalletIndex === -1) {
                        console.error("No wallet selected.");
                        return [2 /*return*/];
                    }
                    wallet = wallets[currentWalletIndex];
                    return [4 /*yield*/, connection.getBalance(wallet.publicKey)];
                case 1:
                    balance = _a.sent();
                    console.log("Balance for wallet ".concat(currentWalletIndex, ": ").concat(balance / web3.LAMPORTS_PER_SOL, " SOL"));
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.error("Error checking balance:", err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function menu() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    console.log("=== Wallet Management Menu ===");
                    console.log("1. Create Wallet");
                    console.log("2. Switch Wallet");
                    console.log("3. Airdrop");
                    console.log("4. Check Balance");
                    console.log("5. Exit");
                    return [4 /*yield*/, getInput("Enter your choice: ")];
                case 1:
                    choice = _f.sent();
                    _a = choice;
                    switch (_a) {
                        case '1': return [3 /*break*/, 2];
                        case '2': return [3 /*break*/, 4];
                        case '3': return [3 /*break*/, 7];
                        case '4': return [3 /*break*/, 10];
                        case '5': return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 13];
                case 2: return [4 /*yield*/, createWallet()];
                case 3:
                    _f.sent();
                    return [3 /*break*/, 14];
                case 4:
                    _b = switchWallet;
                    _c = parseInt;
                    return [4 /*yield*/, getInput("Enter wallet index: ")];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_c.apply(void 0, [_f.sent()])])];
                case 6:
                    _f.sent();
                    return [3 /*break*/, 14];
                case 7:
                    _d = airdrop;
                    _e = parseFloat;
                    return [4 /*yield*/, getInput("Enter airdrop amount (default 1): ")];
                case 8: return [4 /*yield*/, _d.apply(void 0, [_e.apply(void 0, [(_f.sent()) || '1'])])];
                case 9:
                    _f.sent();
                    return [3 /*break*/, 14];
                case 10: return [4 /*yield*/, checkBalance()];
                case 11:
                    _f.sent();
                    return [3 /*break*/, 14];
                case 12:
                    process.exit(0);
                    _f.label = 13;
                case 13:
                    console.log("Invalid choice. Please try again.");
                    _f.label = 14;
                case 14: return [4 /*yield*/, menu()];
                case 15:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getInput(prompt) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            process.stdout.write(prompt);
            return [2 /*return*/, new Promise(function (resolve) {
                    process.stdin.once('data', function (data) {
                        resolve(data.toString().trim());
                    });
                })];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadWallets();
                    return [4 /*yield*/, menu()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (err) { return console.error(err); });
