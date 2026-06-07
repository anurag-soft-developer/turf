export const ROUTE_POINT = {
	home: "/",
	catalog: "/catalog",
	reviews: "/reviews",
	dashboard: "/dashboard",
	events: "/events",
	notifications: "/notifications",
	settings: "/settings",
	auth: {
		base: "/auth",
		login: "/auth/login",
		register: "/auth/register",
		forgotPassword: "/auth/forgot-password",
		verifyEmail: "/auth/verify-email",
		callback: "/auth/callback",
	},
	host: {
		events: {
			dashboard: "/host/events",
			events: "/host/events/events",
			bookings: "/host/events/bookings",
			wallet: "/host/events/wallet",
		},
		turves: {
			dashboard: "/host/turves",
			list: "/host/turves/turves",
			bookings: "/host/turves/bookings",
			wallet: "/host/turves/wallet",
		},
	},
	platformAdmin: {
		home: "/platform-admin",
		turfs: "/platform-admin/turfs",
		withdrawals: "/platform-admin/withdrawals",
	},
} as const;

export type RoutePoint = typeof ROUTE_POINT;
