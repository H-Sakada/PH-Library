/**
 * ABA PayWay Integration Helper
 * 
 * When your client provides the official ABA PayWay Merchant ID and API Key,
 * update the environment variables in `.env.local`:
 * 
 * ABA_PAYWAY_API_URL="https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase"
 * ABA_PAYWAY_MERCHANT_ID="your_merchant_id"
 * ABA_PAYWAY_API_KEY="your_api_key"
 */

export interface AbaPaywayPurchaseParams {
  req_time: string; // YYYYMMDDHHmmss
  merchant_id: string;
  tran_id: string; // Unique transaction id (up to 20 chars)
  amount: string; // Format: "5.00"
  items: string; // Base64 encoded JSON array of items
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  type?: 'purchase';
  payment_option?: 'abapay_khqr' | 'cards' | '';
  return_url?: string;
  continue_success_url?: string;
  return_params?: string;
}

/**
 * Format timestamp as YYYYMMDDHHmmss in Phnom Penh Time (UTC+7)
 */
export function getPaywayTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Generate unique transaction ID for PayWay
 */
export function generateTransactionId(): string {
  const dateStr = Date.now().toString().slice(-6);
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `TRX${dateStr}${randomStr}`;
}

/**
 * SVG generator for simulated ABA PayWay / KHQR Code
 */
export function generateSimulatedKhqrSvg(amountUSD: number, title: string): string {
  // Generates a decorative, realistic-looking KHQR with ABA red accent
  return `
    <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="#ffffff" rx="16"/>
      <!-- Outer Border -->
      <rect x="12" y="12" width="276" height="276" fill="none" stroke="#e2e8f0" stroke-width="2" rx="12"/>
      
      <!-- KHQR Header Banner -->
      <rect x="12" y="12" width="276" height="42" fill="#E11D48" rx="12 12 0 0"/>
      <text x="150" y="38" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">KHQR • ABA PAYWAY</text>

      <!-- Corner Alignment Squares (QR pattern standard) -->
      <!-- Top Left -->
      <rect x="35" y="70" width="45" height="45" fill="#0f172a" rx="6"/>
      <rect x="42" y="77" width="31" height="31" fill="#ffffff" rx="3"/>
      <rect x="48" y="83" width="19" height="19" fill="#0f172a" rx="2"/>

      <!-- Top Right -->
      <rect x="220" y="70" width="45" height="45" fill="#0f172a" rx="6"/>
      <rect x="227" y="77" width="31" height="31" fill="#ffffff" rx="3"/>
      <rect x="233" y="83" width="19" height="19" fill="#0f172a" rx="2"/>

      <!-- Bottom Left -->
      <rect x="35" y="215" width="45" height="45" fill="#0f172a" rx="6"/>
      <rect x="42" y="222" width="31" height="31" fill="#ffffff" rx="3"/>
      <rect x="48" y="228" width="19" height="19" fill="#0f172a" rx="2"/>

      <!-- Simulated QR Data Matrix -->
      <g fill="#0f172a" opacity="0.9">
        <rect x="95" y="75" width="10" height="10"/>
        <rect x="120" y="75" width="20" height="10"/>
        <rect x="160" y="75" width="10" height="10"/>
        <rect x="180" y="75" width="15" height="10"/>
        
        <rect x="95" y="95" width="25" height="10"/>
        <rect x="135" y="95" width="15" height="10"/>
        <rect x="170" y="95" width="20" height="10"/>
        
        <rect x="35" y="130" width="20" height="10"/>
        <rect x="70" y="130" width="15" height="10"/>
        <rect x="100" y="130" width="15" height="10"/>
        <rect x="185" y="130" width="20" height="10"/>
        <rect x="225" y="130" width="15" height="10"/>
        <rect x="250" y="130" width="15" height="10"/>
        
        <rect x="50" y="150" width="15" height="10"/>
        <rect x="80" y="150" width="25" height="10"/>
        <rect x="195" y="150" width="25" height="10"/>
        <rect x="235" y="150" width="15" height="10"/>

        <rect x="35" y="170" width="15" height="10"/>
        <rect x="65" y="170" width="30" height="10"/>
        <rect x="200" y="170" width="15" height="10"/>
        <rect x="230" y="170" width="25" height="10"/>

        <rect x="35" y="190" width="25" height="10"/>
        <rect x="75" y="190" width="15" height="10"/>
        <rect x="105" y="190" width="15" height="10"/>
        <rect x="180" y="190" width="25" height="10"/>
        <rect x="225" y="190" width="15" height="10"/>

        <rect x="95" y="220" width="20" height="10"/>
        <rect x="130" y="220" width="15" height="10"/>
        <rect x="160" y="220" width="20" height="10"/>
        <rect x="195" y="220" width="15" height="10"/>

        <rect x="105" y="240" width="25" height="10"/>
        <rect x="145" y="240" width="15" height="10"/>
        <rect x="175" y="240" width="20" height="10"/>
        <rect x="210" y="240" width="25" height="10"/>
      </g>

      <!-- Center KHQR / Bakong Emblem -->
      <circle cx="150" cy="155" r="26" fill="#ffffff" stroke="#E11D48" stroke-width="3"/>
      <circle cx="150" cy="155" r="20" fill="#003554"/>
      <text x="150" y="161" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="#ffffff" text-anchor="middle">ABA</text>

      <!-- Footer prompt -->
      <text x="150" y="280" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#64748b" text-anchor="middle">Scan with ABA Mobile or any Bakong App</text>
    </svg>
  `;
}
