// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${BACKEND_URL}/api`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.token;
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: [
//     "Wallet",
//     "Transactions",
//     "Profile",
//     "Notifications",
//     "Prizes",
//     "Products",
//     "Leaderboard",
//     "Winners",
//     "RecentUsers",
//     "Games",
//     "SpinnerHistory",
//   ],
//   endpoints: (builder) => ({
//     // Auth
//     sendOtp: builder.mutation({
//       query: (body) => ({ url: "/auth/send-otp", method: "POST", body }),
//     }),
//     verifyOtp: builder.mutation({
//       query: (body) => ({ url: "/auth/verify-otp", method: "POST", body }),
//     }),
//     register: builder.mutation({
//       query: (body) => ({ url: "/auth/register", method: "POST", body }),
//     }),
//     login: builder.mutation({
//       query: (body) => ({ url: "/auth/login", method: "POST", body }),
//     }),

//     // Profile
//     getProfile: builder.query({
//       query: () => "/profile/me",
//       providesTags: ["Profile"],
//     }),
//     updateProfile: builder.mutation({
//       query: (body) => ({ url: "/profile/me", method: "PUT", body }),
//       invalidatesTags: ["Profile"],
//     }),

//     // Wallet
//     getWallet: builder.query({
//       query: () => "/wallet",
//       providesTags: ["Wallet"],
//     }),
//     getTransactions: builder.query({
//       query: ({ limit = 50, skip = 0 } = {}) =>
//         `/transactions?limit=${limit}&skip=${skip}`,
//       providesTags: ["Transactions"],
//     }),

//     // Spinner
//     spin: builder.mutation({
//       query: () => ({ url: "/spinner/spin", method: "POST" }),
//       invalidatesTags: [
//         "Wallet",
//         "Transactions",
//         "SpinnerHistory",
//         "Winners",
//         "Leaderboard",
//       ],
//     }),
//     getSpinnerSegments: builder.query({
//       query: () => "/spinner/segments",
//     }),
//     getSpinnerHistory: builder.query({
//       query: ({ limit = 20 } = {}) => `/spinner/history?limit=${limit}`,
//       providesTags: ["SpinnerHistory"],
//     }),

//     // Prizes
//     getPrizes: builder.query({
//       query: () => "/prizes/",
//       providesTags: ["Prizes"],
//     }),
//     buyPrize: builder.mutation({
//       query: (prizeId) => ({ url: `/prizes/${prizeId}/buy`, method: "POST" }),
//       invalidatesTags: [
//         "Wallet",
//         "Transactions",
//         "Prizes",
//         "Winners",
//         "Notifications",
//       ],
//     }),

//     // Products
//     getProducts: builder.query({
//       query: () => "/products/",
//       providesTags: ["Products"],
//     }),
//     redeemProduct: builder.mutation({
//       query: (productId) => ({
//         url: `/products/${productId}/redeem`,
//         method: "POST",
//       }),
//       invalidatesTags: ["Wallet", "Transactions", "Products", "Notifications"],
//     }),

//     // Leaderboard
//     getLeaderboard: builder.query({
//       query: ({ limit = 50 } = {}) => `/leaderboard/?limit=${limit}`,
//       providesTags: ["Leaderboard"],
//     }),

//     // Notifications
//     getNotifications: builder.query({
//       query: ({ limit = 50 } = {}) => `/notifications/?limit=${limit}`,
//       providesTags: ["Notifications"],
//     }),
//     markNotificationRead: builder.mutation({
//       query: (id) => ({ url: `/notifications/${id}/read`, method: "POST" }),
//       invalidatesTags: ["Notifications"],
//     }),
//     markAllNotificationsRead: builder.mutation({
//       query: () => ({ url: "/notifications/read-all", method: "POST" }),
//       invalidatesTags: ["Notifications"],
//     }),

//     // Contact
//     submitContact: builder.mutation({
//       query: (body) => ({ url: "/contact/", method: "POST", body }),
//     }),

//     // Public data
//     getWinners: builder.query({
//       query: ({ limit = 20 } = {}) => `/winners?limit=${limit}`,
//       providesTags: ["Winners"],
//     }),
//     getRecentUsers: builder.query({
//       query: ({ limit = 20 } = {}) => `/recent-users?limit=${limit}`,
//       providesTags: ["RecentUsers"],
//     }),
//     getStats: builder.query({
//       query: () => "/stats",
//     }),

//     // Games
//     createGame: builder.mutation({
//       query: (body) => ({ url: "/game/create", method: "POST", body }),
//       invalidatesTags: ["Wallet", "Transactions", "Games"],
//     }),
//     getAvailableGames: builder.query({
//       query: () => "/game/available",
//       providesTags: ["Games"],
//     }),
//     joinGame: builder.mutation({
//       query: (sessionId) => ({
//         url: `/game/${sessionId}/join`,
//         method: "POST",
//       }),
//       invalidatesTags: ["Wallet", "Transactions", "Games"],
//     }),
//     chooseSymbol: builder.mutation({
//       query: ({ sessionId, symbol }) => ({
//         url: `/game/${sessionId}/choose-symbol?symbol=${symbol}`,
//         method: "POST",
//       }),
//     }),
//     rollDice: builder.mutation({
//       query: (sessionId) => ({
//         url: `/game/${sessionId}/roll-dice`,
//         method: "POST",
//       }),
//       invalidatesTags: ["Wallet", "Transactions"],
//     }),
//     getGameSession: builder.query({
//       query: (sessionId) => `/game/${sessionId}`,
//       providesTags: ["Games"],
//     }),

//     // Seed
//     seedData: builder.mutation({
//       query: () => ({ url: "/seed", method: "POST" }),
//       invalidatesTags: ["Prizes", "Products"],
//     }),
//   }),
// });

// export const {
//   useSendOtpMutation,
//   useVerifyOtpMutation,
//   useRegisterMutation,
//   useLoginMutation,
//   useGetProfileQuery,
//   useUpdateProfileMutation,
//   useGetWalletQuery,
//   useGetTransactionsQuery,
//   useSpinMutation,
//   useGetSpinnerSegmentsQuery,
//   useGetSpinnerHistoryQuery,
//   useGetPrizesQuery,
//   useBuyPrizeMutation,
//   useGetProductsQuery,
//   useRedeemProductMutation,
//   useGetLeaderboardQuery,
//   useGetNotificationsQuery,
//   useMarkNotificationReadMutation,
//   useMarkAllNotificationsReadMutation,
//   useSubmitContactMutation,
//   useGetWinnersQuery,
//   useGetRecentUsersQuery,
//   useGetStatsQuery,
//   useCreateGameMutation,
//   useGetAvailableGamesQuery,
//   useJoinGameMutation,
//   useChooseSymbolMutation,
//   useRollDiceMutation,
//   useGetGameSessionQuery,
//   useSeedDataMutation,
// } = apiSlice;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: [
    'Profile',
    'Wallet',
    'Transactions',
    'Spinner',
    'SpinnerSegments',
    'Products',
    'Orders',
    'Leaderboard',
    'Referral',
    'Transactions',
    'RecentUsers',
    'AppConfig'
  ],

  endpoints: (builder) => ({

    // ─── AUTH ────────────────────────────────────────────────────────────────

    // POST /auth/send-otp  { mobile }
    sendOtp: builder.mutation({
      query: (body) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/verify-otp  { mobile, otp_code }
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/register  { full_name, username, email, mobile, password, referred_by_code? }
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/login  { identifier, password }
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/forgot-password  { mobile }
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/verify-forgot-otp  { mobile, otp_code }
    verifyForgotOtp: builder.mutation({
      query: (body) => ({
        url: '/auth/verify-forgot-otp',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/reset-password  { mobile, new_password }
    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // ─── USER PROFILE ────────────────────────────────────────────────────────

    // GET /auth/user/me
    getMe: builder.query({
      query: () => '/auth/user/me',
      providesTags: ['Profile', 'Wallet'],
    }),

    // PATCH /auth/user/me  { full_name?, username?, email?, profile_image? }
    // Replace the existing updateMe endpoint with this:
updateMe: builder.mutation({
  query: (formData) => ({
    url: '/auth/user/me',
    method: 'PATCH',
    body: formData,
    // Don't set Content-Type — browser sets it automatically with boundary for FormData
    formData: true,
  }),
  invalidatesTags: ['Profile'],
}),

    // GET /auth/user/transactions?page&limit&wallet_type&type
    getMyTransactions: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.wallet_type && { wallet_type: params.wallet_type }),
          ...(params.type && { type: params.type }),
        }).toString();
        return `/auth/user/transactions?${query}`;
      },
      providesTags: ['Transactions'],
    }),

    // GET /auth/recent-users?limit=20
getRecentUsers: builder.query({
  query: ({ limit = 20 } = {}) => `/auth/recent-users?limit=${limit}`,
  providesTags: ['RecentUsers'],
}),

// Wallet is folded into getMe — this is an alias so Navbar doesn't break
// It just calls getMe and we extract wallet from it
getWallet: builder.query({
  query: () => '/auth/user/me',
  providesTags: ['Wallet'],
  transformResponse: (response) => ({
    data: response.data?.wallet || null,
  }),
}),

// Stub — returns empty until notifications module is built
getNotifications: builder.query({
  query: () => '/auth/user/me', // temporary safe endpoint
  providesTags: ['Notifications'],
  transformResponse: () => ({
    data: { notifications: [], unread_count: 0 },
  }),
}),

    // ─── ADMIN — USERS ───────────────────────────────────────────────────────

    // GET /auth/admin/users?page&limit&search&role&status&sort&order
    adminGetUsers: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.search && { search: params.search }),
          ...(params.role && { role: params.role }),
          ...(params.status && { status: params.status }),
          ...(params.sort && { sort: params.sort }),
          ...(params.order && { order: params.order }),
        }).toString();
        return `/auth/admin/users?${query}`;
      },
      providesTags: ['Profile'],
    }),

    // GET /auth/admin/users/:id
    adminGetUserById: builder.query({
      query: (id) => `/auth/admin/users/${id}`,
      providesTags: ['Profile'],
    }),

    // POST /auth/admin/users  { full_name, username, email, mobile, password, role? }
    adminCreateUser: builder.mutation({
      query: (body) => ({
        url: '/auth/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    // PATCH /auth/admin/users/:id
    adminUpdateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/auth/admin/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    // DELETE /auth/admin/users/:id
    adminDeleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    // ─── SPINNER ─────────────────────────────────────────────────────────────

    // GET /spinner/segments?page&limit&is_active&search&sort&order
    getSpinnerSegments: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.is_active !== undefined && { is_active: params.is_active }),
          ...(params.search && { search: params.search }),
          ...(params.sort && { sort: params.sort }),
          ...(params.order && { order: params.order }),
        }).toString();
        return `/spinner/segments?${query}`;
      },
      providesTags: ['SpinnerSegments'],
    }),

    // POST /spinner/segments/bulk  { segments: [...] }
    bulkUpsertSegments: builder.mutation({
      query: (body) => ({
        url: '/spinner/segments/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SpinnerSegments'],
    }),

    // PATCH /spinner/segments/:id
    updateSegment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/spinner/segments/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['SpinnerSegments'],
    }),

    // DELETE /spinner/segments/bulk-delete  { ids: [...] }
    bulkDeleteSegments: builder.mutation({
      query: (body) => ({
        url: '/spinner/segments/bulk-delete',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['SpinnerSegments'],
    }),

    // POST /spinner/spin
    spin: builder.mutation({
      query: () => ({
        url: '/spinner/spin',
        method: 'POST',
      }),
      invalidatesTags: ['Wallet', 'Spinner', 'Leaderboard','Transactions'],
    }),

    // GET /spinner/history?page&limit
    getSpinnerHistory: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 20,
        }).toString();
        return `/spinner/history?${query}`;
      },
      providesTags: ['Spinner'],
    }),

    // ─── PRODUCTS ────────────────────────────────────────────────────────────

    // GET /products?page&limit&search&sort&order
    getProducts: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.search && { search: params.search }),
          ...(params.sort && { sort: params.sort }),
          ...(params.order && { order: params.order }),
        }).toString();
        return `/products?${query}`;
      },
      providesTags: ['Products'],
    }),

    // GET /products/:id
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),

    // POST /products/admin
    adminCreateProduct: builder.mutation({
      query: (body) => ({
        url: '/products/admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),

    // GET /products/admin/all?page&limit&search&is_active&sort&order
    adminGetProducts: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.search && { search: params.search }),
          ...(params.is_active !== undefined && { is_active: params.is_active }),
          ...(params.sort && { sort: params.sort }),
          ...(params.order && { order: params.order }),
        }).toString();
        return `/products/admin/all?${query}`;
      },
      providesTags: ['Products'],
    }),

    // PATCH /products/admin/:id
    adminUpdateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/products/admin/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Products'],
    }),

    // DELETE /products/admin/:id
    adminDeleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    // ─── ORDERS ──────────────────────────────────────────────────────────────

    // POST /orders/redeem  { product_id }
    redeemProduct: builder.mutation({
      query: (body) => ({
        url: '/orders/redeem',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet', 'Orders', 'Products','Transactions'],
    }),

    // GET /orders/my?page&limit&status
    getMyOrders: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.status && { status: params.status }),
        }).toString();
        return `/orders/my?${query}`;
      },
      providesTags: ['Orders'],
    }),

    // GET /orders/admin/all?page&limit&status&search&sort&order
    adminGetOrders: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.status && { status: params.status }),
          ...(params.search && { search: params.search }),
          ...(params.sort && { sort: params.sort }),
          ...(params.order && { order: params.order }),
        }).toString();
        return `/orders/admin/all?${query}`;
      },
      providesTags: ['Orders'],
    }),

    // GET /orders/admin/:id
    adminGetOrderById: builder.query({
      query: (id) => `/orders/admin/${id}`,
      providesTags: ['Orders'],
    }),

    // PATCH /orders/admin/:id  { status, admin_note? }
    adminUpdateOrderStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/orders/admin/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Orders', 'Wallet','Transactions'],
    }),

    // ─── LEADERBOARD ─────────────────────────────────────────────────────────

    // GET /leaderboard  — top 50
    getLeaderboard: builder.query({
      query: () => '/leaderboard',
      providesTags: ['Leaderboard'],
    }),

    // GET /leaderboard/me
    getMyRank: builder.query({
      query: () => '/leaderboard/me',
      providesTags: ['Leaderboard'],
    }),

    // ─── REFERRAL ────────────────────────────────────────────────────────────

    // GET /referral/link
    getReferralLink: builder.query({
      query: () => '/referral/link',
      providesTags: ['Referral'],
    }),

getRecentUsers: builder.query({
  query: ({ limit = 20 } = {}) => `/auth/recent-users?limit=${limit}`,
  providesTags: ['RecentUsers'],
}),

    // GET /referral/history?page&limit
    getReferralHistory: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams({
          page: params.page || 1,
          limit: params.limit || 10,
        }).toString();
        return `/referral/history?${query}`;
      },
      providesTags: ['Referral'],
    }),

  // token purchase
  // Token packages
getTokenPackages: builder.query({
  query: () => '/token-packages',
  providesTags: ['TokenPackages'],
}),
adminGetTokenPackages: builder.query({
  query: () => '/admin/token-packages',
  providesTags: ['TokenPackages'],
}),
adminCreateTokenPackage: builder.mutation({
  query: (body) => ({ url: '/admin/token-packages', method: 'POST', body }),
  invalidatesTags: ['TokenPackages'],
}),
adminUpdateTokenPackage: builder.mutation({
  query: ({ id, ...body }) => ({ url: `/admin/token-packages/${id}`, method: 'PATCH', body }),
  invalidatesTags: ['TokenPackages'],
}),
adminDeleteTokenPackage: builder.mutation({
  query: (id) => ({ url: `/admin/token-packages/${id}`, method: 'DELETE' }),
  invalidatesTags: ['TokenPackages'],
}),

// Token purchases
submitTokenPurchase: builder.mutation({
  query: (body) => ({ url: '/token-purchases', method: 'POST', body }),
  invalidatesTags: ['TokenPurchases'],
}),
getMyTokenPurchases: builder.query({
  query: (params = {}) => {
    const query = new URLSearchParams({ page: params.page || 1, limit: params.limit || 10 }).toString();
    return `/token-purchases/my?${query}`;
  },
  providesTags: ['TokenPurchases'],
}),
adminGetTokenPurchases: builder.query({
  query: (params = {}) => {
    const query = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search }),
    }).toString();
    return `/admin/token-purchases?${query}`;
  },
  providesTags: ['TokenPurchases'],
}),
adminReviewTokenPurchase: builder.mutation({
  query: ({ id, ...body }) => ({ url: `/admin/token-purchases/${id}`, method: 'PATCH', body }),
  invalidatesTags: ['TokenPurchases', 'Wallet'],
}),

// Config
getAppConfig: builder.query({
  query: () => 'config/config',
  providesTags: ['AppConfig'],
}),
adminGetConfig: builder.query({
  query: () => 'config/admin/config',
  providesTags: ['AppConfig'],
}),
adminUpdateConfig: builder.mutation({
  query: (body) => ({ url: 'config/admin/config', method: 'PATCH', body }),
  invalidatesTags: ['AppConfig'],
}),
getStreakStatus: builder.query({
  query: () => '/streak',
  providesTags: ['Streak'],
}),
 
// POST /streak/claim
claimStreak: builder.mutation({
  query: () => ({ url: '/streak/claim', method: 'POST' }),
  invalidatesTags: ['Streak', 'Wallet', 'Transactions'],
}),

  }),
});

export const {
  // Auth
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,

  // Profile
  useGetMeQuery,
  useUpdateMeMutation,

  // Admin — users
  useAdminGetUsersQuery,
  useAdminGetUserByIdQuery,
  useAdminCreateUserMutation,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,

  // Spinner
  useGetSpinnerSegmentsQuery,
  useBulkUpsertSegmentsMutation,
  useUpdateSegmentMutation,
  useBulkDeleteSegmentsMutation,
  useSpinMutation,
  useGetSpinnerHistoryQuery,

  // Products
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAdminCreateProductMutation,
  useAdminGetProductsQuery,
  useAdminUpdateProductMutation,
  useAdminDeleteProductMutation,

  // Orders
  useRedeemProductMutation,
  useGetMyOrdersQuery,
  useAdminGetOrdersQuery,
  useAdminGetOrderByIdQuery,
  useAdminUpdateOrderStatusMutation,

  // Leaderboard
  useGetLeaderboardQuery,
  useGetMyRankQuery,

  // Referral
  useGetReferralLinkQuery,
  useGetReferralHistoryQuery,


useGetMyTransactionsQuery,
useGetRecentUsersQuery,
useGetWalletQuery,
useGetNotificationsQuery,

// token purchase
useGetTokenPackagesQuery,
useAdminGetTokenPackagesQuery,
useAdminCreateTokenPackageMutation,
useAdminUpdateTokenPackageMutation,
useAdminDeleteTokenPackageMutation,
useSubmitTokenPurchaseMutation,
useGetMyTokenPurchasesQuery,
useAdminGetTokenPurchasesQuery,
useAdminReviewTokenPurchaseMutation,
useGetAppConfigQuery,
useAdminGetConfigQuery,
useAdminUpdateConfigMutation,
useGetStreakStatusQuery,
useClaimStreakMutation,
} = apiSlice;
