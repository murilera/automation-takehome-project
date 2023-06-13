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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
var readline = require("readline");
var playwright_1 = require("playwright");
var csv_writer_1 = require("csv-writer");
var csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
    path: 'products.csv',
    header: [
        { id: 'title', title: 'Title' },
        { id: 'price', title: 'Price' },
        { id: 'search', title: 'Search' },
        { id: 'url', title: 'URL' }
    ]
});
var delay = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
var baseUrl = 'https://www.amazon.com';
var scrape = function () { return __awaiter(void 0, void 0, void 0, function () {
    var search, products, sortedProducts, topThreeProducts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getInput('Enter a search term: ')];
            case 1:
                search = _a.sent();
                return [4 /*yield*/, (0, exports.getProducts)(search)];
            case 2:
                products = _a.sent();
                sortedProducts = sortByPrice(products);
                topThreeProducts = sortedProducts.slice(0, 3);
                return [4 /*yield*/, saveToCsv(topThreeProducts)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var requestWithRetry = function (page, link) { return __awaiter(void 0, void 0, void 0, function () {
    var MAX_RETRIES, retry_count, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                MAX_RETRIES = 5;
                retry_count = 0;
                _a.label = 1;
            case 1:
                if (!(retry_count < MAX_RETRIES)) return [3 /*break*/, 7];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 6]);
                return [4 /*yield*/, page.goto(link)];
            case 3:
                _a.sent();
                return [3 /*break*/, 7];
            case 4:
                error_1 = _a.sent();
                retry_count += 1;
                if (retry_count == MAX_RETRIES) {
                    console.log('request timed out');
                    return [3 /*break*/, 7];
                }
                return [4 /*yield*/, delay(1500)];
            case 5:
                _a.sent();
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
var getInput = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var rl;
    return __generator(this, function (_a) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return [2 /*return*/, new Promise(function (resolve) {
                rl.question(query, function (input) {
                    resolve(input.trim());
                    rl.close();
                });
            })];
    });
}); };
var getProducts = function (searchTerm) { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, productElements, products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, playwright_1.chromium.launch({
                    headless: false,
                    args: ["--headless=new"]
                })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage({ strictSelectors: false })];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, requestWithRetry(page, "".concat(baseUrl, "/s?k=").concat(searchTerm))];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.reload()];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.waitForLoadState()];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.reload()];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.waitForLoadState()];
            case 7:
                _a.sent();
                return [4 /*yield*/, page.$$("//div[@data-component-type='s-search-result']")
                    // await delay(15000)
                ];
            case 8:
                productElements = _a.sent();
                return [4 /*yield*/, Promise.all(productElements.map(function (productElement) { return __awaiter(void 0, void 0, void 0, function () {
                        var productUrl, productName, productPrice;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, productElement.$eval('a', function (a) { return a.href; })];
                                case 1:
                                    productUrl = _a.sent();
                                    return [4 /*yield*/, productElement.$eval("//span[@class='a-size-medium a-color-base a-text-normal']", function (span) { return span.textContent; })];
                                case 2:
                                    productName = _a.sent();
                                    return [4 /*yield*/, productElement.$eval("//span[@class='a-offscreen']", function (span) { return span.textContent; })];
                                case 3:
                                    productPrice = _a.sent();
                                    return [2 /*return*/, {
                                            title: productName !== null && productName !== void 0 ? productName : '',
                                            price: productPrice !== null && productPrice !== void 0 ? productPrice : '',
                                            search: searchTerm,
                                            url: productUrl !== null && productUrl !== void 0 ? productUrl : ''
                                        }];
                            }
                        });
                    }); }))];
            case 9:
                products = _a.sent();
                return [4 /*yield*/, browser.close()];
            case 10:
                _a.sent();
                return [2 /*return*/, products];
        }
    });
}); };
exports.getProducts = getProducts;
var sortByPrice = function (products) {
    return products.sort(function (p1, p2) {
        return parseFloat(p1.price.replace(/[^0-9.-]+/g, '')) -
            parseFloat(p2.price.replace(/[^0-9.-]+/g, ''));
    });
};
var saveToCsv = function (products) { return __awaiter(void 0, void 0, void 0, function () {
    var records;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                records = products.map(function (product) { return ({
                    title: product.title,
                    price: product.price,
                    search: product.search,
                    url: product.url
                }); });
                return [4 /*yield*/, csvWriter.writeRecords(records).then(function () {
                        console.log('Done!');
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scrape()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
