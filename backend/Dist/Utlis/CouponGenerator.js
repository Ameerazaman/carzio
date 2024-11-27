"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomCouponCode = generateRandomCouponCode;
function generateRandomCouponCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
