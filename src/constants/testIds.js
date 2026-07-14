// Test IDs for data-testid attributes used in automated testing.
// These are NOT secrets - they are stable selectors for test automation.
export const AUTH = {
  registerForm: 'register-form',
  registerSubmit: 'register-form-submit-button',
  registerOtpInput: 'register-otp-input',
  registerSuccess: 'register-success-continue-button',
  loginForm: 'login-form',
  loginSubmit: 'login-submit-button',
  loginIdentifier: 'login-identifier',
  loginPasswordField: 'login-password-field',
};

export const DASHBOARD = {
  walletBalance: 'dashboard-wallet-balance',
  winnersTicker: 'dashboard-winners-ticker',
  usersTicker: 'dashboard-users-ticker',
  spinnerCard: 'dashboard-spinner-card',
  prizeCard: 'dashboard-prize-card',
  bazaarCard: 'dashboard-bazaar-card',
  gameCard: 'dashboard-game-card',
};

export const SPINNER = {
  wheel: 'spin-page-wheel',
  spinButton: 'spin-page-spin-button',
  resultDialog: 'spin-result-dialog',
};

export const PRIZES = {
  grid: 'prize-house-grid',
  buyButton: 'prize-buy-button',
};

export const BAZAAR = {
  grid: 'bazaar-grid',
  redeemButton: 'bazaar-redeem-button',
};

export const GAME = {
  tabs: 'game-zone-tabs',
  createButton: 'game-create-button',
  joinButton: 'game-join-button',
};

export const PROFILE = {
  referralCode: 'profile-referral-code',
  copyReferral: 'profile-copy-referral-button',
  transactionTable: 'profile-transaction-table',
};

export const NAV = {
  walletBadge: 'wallet-badge',
  notificationsButton: 'notifications-button',
  profileAvatar: 'profile-avatar',
};
