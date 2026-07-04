const crypto = require('crypto');
const axios = require('axios');

// ============================================
// THÔNG SỐ MÃ HÓA
// ============================================
const KEY = Buffer.from('gksekfidjrqjfwk1', 'utf8');
const IV = Buffer.from('towerdefense_amo', 'utf8');

// Pad key cho AES-256 (32 bytes)
const PADDED_KEY = Buffer.alloc(32);
KEY.copy(PADDED_KEY);

// ============================================
// HÀM MÃ HÓA / GIẢI MÃ
// ============================================
function encrypt(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', PADDED_KEY, IV);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decrypt(data) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', PADDED_KEY, IV);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    try { return JSON.parse(decrypted); } 
    catch { return decrypted; }
}

// ============================================
// DỮ LIỆU CẦN GỬI
// ============================================
const requestData = {
    UNIQ_ID: "TDI7620yBP",
    HOST_ID: "000208.c1337b4702d44b54a0edd3c84da5435b.0142",
    CUR_RUBY: 38,
    CUR_DIA: 3552,
    CUR_GOLD: 478850,
    CUR_MILEAGE: 14,
    CUR_MAGIC: 10,
    CUR_P_TICKET: 0,
    CUR_N_TICKET: 0,
    RUBY_ADD: 0,
    RUBY_WHY: "",
    DIA_ADD: -800,
    DIA_WHY: "타워뽑기:dia:1회:800",
    GOLD_ADD: 0,
    GOLD_WHY: "",
    MILEAGE_ADD: 0,
    MILEAGE_WHY: "",
    MAGIC_ADD: 0,
    MAGIC_WHY: "",
    P_TICKET_ADD: 0,
    P_TICKET_WHY: "",
    N_TICKET_ADD: 0,
    N_TICKET_WHY: "",
    COMMENT: "재화사용:타워뽑기다이아:1",
    RUN_COUNT: 7,
    MOBILE_CONNECT: "",
    GICHAPO: "424064XMQB",
    LANG: 3
};

// ============================================
// GỬI REQUEST
// ============================================
async function main() {
    try {
        // Mã hóa dữ liệu
        const encryptedData = encrypt(requestData);
        console.log('🔑 Encrypted:', encryptedData.substring(0, 100) + '...');

        // Gửi request
        const response = await axios.post(
            'https://game.busidol.com/TOWERDEFENCE_COMMON/php/put_userinfo_gacha_AES2.php',
            `DATA=${encodeURIComponent(encryptedData)}`,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                timeout: 15000
            }
        );

        // Giải mã response
        const decrypted = decrypt(response.data);
        console.log('✅ Response:', JSON.stringify(decrypted, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

main();