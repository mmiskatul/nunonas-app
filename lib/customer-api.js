/**
 * customer-api.js
 * Complete API module for all customer endpoints.
 * Every function maps 1:1 to an endpoint in the blueprint.
 */

import { apiGet, apiPost, apiPatch, apiDelete } from "./api";
import { apiGetAuth, apiPostAuth, apiPatchAuth, apiDeleteAuth, apiPostAuthForm } from "./auth-api";

const V1 = "/api/v1";
const C = `${V1}/customer`;

function memberSinceYear(createdAt) {
  if (!createdAt) return "";
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "";
  return String(parsed.getFullYear());
}

export function normalizeUserProfile(profile = {}) {
  return {
    id: profile.id ?? "",
    full_name: profile.full_name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    date_of_birth: profile.date_of_birth ?? "",
    profile_image_url: profile.profile_image_url ?? "",
    created_at: profile.created_at ?? null,
    member_since: memberSinceYear(profile.created_at),
    points_balance: Number(profile.points_balance ?? 0),
    location_enabled: Boolean(profile.location_enabled),
  };
}

// ─── Home ──────────────────────────────────────────────────────────────────

/** GET /customer/home */
export async function getHomeFeed() {
  return apiGetAuth(`${C}/home`);
}

/** GET /customer/notifications/unread-count */
export async function getUnreadNotificationCount() {
  return apiGetAuth(`${C}/notifications/unread-count`);
}

/** GET /customer/notifications */
export async function listNotifications() {
  return apiGetAuth(`${C}/notifications`);
}

/** GET /customer/location/current */
export async function getCurrentLocation() {
  return apiGetAuth(`${C}/location/current`);
}

/** PATCH /customer/location/current */
export async function updateCurrentLocation(data) {
  return apiPatchAuth(`${C}/location/current`, { data });
}

// ─── Categories ────────────────────────────────────────────────────────────

/** GET /customer/categories */
export async function listCategories() {
  return apiGetAuth(`${C}/categories`);
}

// ─── Restaurants ────────────────────────────────────────────────────────────

/**
 * GET /customer/restaurants
 * @param {object} params - { limit, skip, search, open_now, top_rated, offers }
 */
export async function listRestaurants(params = {}) {
  const query = buildQuery(params);
  return apiGetAuth(`${C}/restaurants${query}`);
}

/** GET /customer/restaurants/:id */
export async function getRestaurant(restaurantId) {
  return apiGetAuth(`${C}/restaurants/${restaurantId}`);
}

/** GET /customer/restaurants/:id/menu */
export async function getRestaurantMenu(restaurantId) {
  return apiGetAuth(`${C}/restaurants/${restaurantId}/menu`);
}

/** GET /customer/restaurants/:id/gallery */
export async function getRestaurantGallery(restaurantId) {
  return apiGetAuth(`${C}/restaurants/${restaurantId}/gallery`);
}

/** GET /customer/restaurants/:id/offers */
export async function getRestaurantOffers(restaurantId) {
  return apiGetAuth(`${C}/restaurants/${restaurantId}/offers`);
}

// ─── Spas ──────────────────────────────────────────────────────────────────

/** GET /customer/spas */
export async function listSpas(params = {}) {
  return apiGetAuth(`${C}/spas${buildQuery(params)}`);
}

/** GET /customer/spas/:id */
export async function getSpa(spaId) {
  return apiGetAuth(`${C}/spas/${spaId}`);
}

/** GET /customer/spas/:id/menu */
export async function getSpaMenu(spaId) {
  return apiGetAuth(`${C}/spas/${spaId}/menu`);
}

/** GET /customer/spas/:id/gallery */
export async function getSpaGallery(spaId) {
  return apiGetAuth(`${C}/spas/${spaId}/gallery`);
}

/** GET /customer/spas/:id/offers */
export async function getSpaOffers(spaId) {
  return apiGetAuth(`${C}/spas/${spaId}/offers`);
}

// ─── Events ────────────────────────────────────────────────────────────────

/** GET /customer/events */
export async function listEvents(params = {}) {
  return apiGetAuth(`${C}/events${buildQuery(params)}`);
}

/** GET /customer/events/:id */
export async function getEvent(eventId) {
  return apiGetAuth(`${C}/events/${eventId}`);
}

/** GET /customer/events/:id/directions */
export async function getEventDirections(eventId) {
  return apiGetAuth(`${C}/events/${eventId}/directions`);
}

// ─── Hotels ────────────────────────────────────────────────────────────────

/** GET /customer/hotels */
export async function listHotels(params = {}) {
  return apiGetAuth(`${C}/hotels${buildQuery(params)}`);
}

/** GET /customer/hotels/:id */
export async function getHotel(hotelId) {
  return apiGetAuth(`${C}/hotels/${hotelId}`);
}

/** GET /customer/hotels/:id/rooms */
export async function listHotelRooms(hotelId, params = {}) {
  return apiGetAuth(`${C}/hotels/${hotelId}/rooms${buildQuery(params)}`);
}

/** GET /customer/hotels/rooms/:roomId */
export async function getHotelRoom(roomId) {
  return apiGetAuth(`${C}/hotels/rooms/${roomId}`);
}

/** GET /customer/hotels/:id/gallery */
export async function getHotelGallery(hotelId) {
  return apiGetAuth(`${C}/hotels/${hotelId}/gallery`);
}

/** GET /customer/hotels/:id/reviews */
export async function getHotelReviews(hotelId) {
  return apiGetAuth(`${C}/hotels/${hotelId}/reviews`);
}

// ─── Search ────────────────────────────────────────────────────────────────

/** GET /customer/search?q=... */
export async function globalSearch(q, params = {}) {
  return apiGetAuth(`${C}/search${buildQuery({ q, ...params })}`);
}

/** GET /customer/search/recent */
export async function listRecentSearches() {
  return apiGetAuth(`${C}/search/recent`);
}

/** DELETE /customer/search/recent */
export async function clearRecentSearches() {
  return apiDeleteAuth(`${C}/search/recent`);
}

/** GET /customer/map/pins */
export async function getMapPins(limit = 50) {
  return apiGetAuth(`${C}/map/pins${buildQuery({ limit })}`);
}

/** GET /customer/map/highlight?restaurant_id=... */
export async function getMapHighlight(restaurantId) {
  const q = restaurantId ? buildQuery({ restaurant_id: restaurantId }) : "";
  return apiGetAuth(`${C}/map/highlight${q}`);
}

/** GET /customer/filters */
export async function getFilters() {
  return apiGetAuth(`${C}/filters`);
}

// ─── Bookings ──────────────────────────────────────────────────────────────

/** GET /customer/bookings/availability?provider_id=...&date=... */
export async function getBookingAvailability(providerId, date) {
  return apiGetAuth(`${C}/bookings/availability${buildQuery({ provider_id: providerId, date })}`);
}

/**
 * POST /customer/bookings/quote
 * @param {object} payload - { provider_id, provider_type, guests, date, time, seating_preference }
 */
export async function getBookingQuote(payload) {
  return apiPostAuth(`${C}/bookings/quote`, payload);
}

/**
 * POST /customer/bookings
 * @param {object} payload - { provider_id, provider_type, date, time, guests, seating_preference, special_notes, auto_confirm }
 */
export async function createBooking(payload) {
  return apiPostAuth(`${C}/bookings`, payload);
}

/** GET /customer/bookings */
export async function listMyBookings(params = {}) {
  return apiGetAuth(`${C}/bookings${buildQuery(params)}`);
}

/** GET /customer/bookings/:id */
export async function getBooking(bookingId) {
  return apiGetAuth(`${C}/bookings/${bookingId}`);
}

/** POST /customer/bookings/:id/confirm */
export async function confirmBooking(bookingId) {
  return apiPostAuth(`${C}/bookings/${bookingId}/confirm`, {});
}

/** PATCH /customer/bookings/:id/cancel */
export async function cancelBooking(bookingId, reason) {
  return apiPatchAuth(`${C}/bookings/${bookingId}/cancel`, { reason });
}

/** PATCH /customer/bookings/:id/reschedule */
export async function rescheduleBooking(bookingId, payload) {
  return apiPatchAuth(`${C}/bookings/${bookingId}/reschedule`, payload);
}

// ─── Saved ─────────────────────────────────────────────────────────────────

/** GET /customer/saved */
export async function listSaved() {
  return apiGetAuth(`${C}/saved`);
}

/** POST /customer/saved/:entity_type/:entity_id */
export async function addSaved(entityType, entityId) {
  return apiPostAuth(`${C}/saved/${entityType}/${entityId}`, {});
}

/** DELETE /customer/saved/:entity_type/:entity_id */
export async function removeSaved(entityType, entityId) {
  return apiDeleteAuth(`${C}/saved/${entityType}/${entityId}`);
}

// ─── AI Concierge ──────────────────────────────────────────────────────────

/** GET /customer/ai-concierge/sessions */
export async function listAiSessions() {
  return apiGetAuth(`${C}/ai-concierge/sessions`);
}

/** POST /customer/ai-concierge/sessions */
export async function createAiSession() {
  return apiPostAuth(`${C}/ai-concierge/sessions`, {});
}

/** GET /customer/ai-concierge/sessions/:id/messages */
export async function listAiMessages(sessionId) {
  return apiGetAuth(`${C}/ai-concierge/sessions/${sessionId}/messages`);
}

/** POST /customer/ai-concierge/sessions/:id/messages */
export async function sendAiMessage(sessionId, message) {
  return apiPostAuth(`${C}/ai-concierge/sessions/${sessionId}/messages`, {
    message,
    metadata: {},
  });
}

// ─── Profile ───────────────────────────────────────────────────────────────

/** GET /customer/profile */
export async function getCustomerProfile() {
  return apiGetAuth(`${C}/profile`);
}

/** PATCH /customer/profile */
export async function updateCustomerProfile(data) {
  return apiPatchAuth(`${C}/profile`, { data });
}

/** PATCH /customer/profile/notification-preferences */
export async function updateNotificationPreferences(data) {
  return apiPatchAuth(`${C}/profile/notification-preferences`, { data });
}

/** GET /customer/points/summary */
export async function getPointsSummary() {
  return apiGetAuth(`${C}/points/summary`);
}

// ─── Plan For Me ───────────────────────────────────────────────────────────

/** POST /customer/plan-for-me/sessions */
export async function createPlanSession() {
  return apiPostAuth(`${C}/plan-for-me/sessions`, {});
}

/** PATCH /customer/plan-for-me/sessions/:id/companions */
export async function setPlanCompanions(sessionId, value) {
  return apiPatchAuth(`${C}/plan-for-me/sessions/${sessionId}/companions`, { value });
}

/** PATCH /customer/plan-for-me/sessions/:id/mood */
export async function setPlanMood(sessionId, value) {
  return apiPatchAuth(`${C}/plan-for-me/sessions/${sessionId}/mood`, { value });
}

/** PATCH /customer/plan-for-me/sessions/:id/budget */
export async function setPlanBudget(sessionId, value) {
  return apiPatchAuth(`${C}/plan-for-me/sessions/${sessionId}/budget`, { value });
}

/** PATCH /customer/plan-for-me/sessions/:id/preferences */
export async function setPlanPreferences(sessionId, value) {
  return apiPatchAuth(`${C}/plan-for-me/sessions/${sessionId}/preferences`, { value });
}

/** POST /customer/plan-for-me/sessions/:id/reveal */
export async function revealPlan(sessionId) {
  return apiPostAuth(`${C}/plan-for-me/sessions/${sessionId}/reveal`, {});
}

// ─── User profile (direct user endpoints) ──────────────────────────────────

/** GET /users/me */
export async function getMe() {
  return normalizeUserProfile(await apiGetAuth(`${V1}/users/me`));
}

/** GET /legal/:docType */
export async function getLegalDocument(docType) {
  return apiGet(`${V1}/legal/${docType}`);
}

/** PATCH /users/me/personal-details */
export async function updatePersonalDetails(payload) {
  return normalizeUserProfile(await apiPatchAuth(`${V1}/users/me/personal-details`, payload));
}

/** POST /users/me/profile-image */
export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.fileName ?? file.name ?? "profile-image.jpg",
    type: file.mimeType ?? file.type ?? "image/jpeg",
  });
  return apiPostAuthForm(`${V1}/users/me/profile-image`, formData);
}

/** GET /users/me/bookings?status=upcoming|past */
export async function getMyBookings(status) {
  const q = status ? buildQuery({ status }) : "";
  return apiGetAuth(`${V1}/users/me/bookings${q}`);
}

/** GET /users/me/loyalty */
export async function getMyLoyalty() {
  return apiGetAuth(`${V1}/users/me/loyalty`);
}

/** GET /users/me/support/tickets */
export async function listMySupportTickets() {
  return apiGetAuth(`${V1}/users/me/support/tickets`);
}

/** POST /users/me/support/tickets */
export async function createSupportTicket(payload) {
  return apiPostAuth(`${V1}/users/me/support/tickets`, payload);
}

/** GET /users/me/support/tickets/:id */
export async function getSupportTicket(ticketId) {
  return apiGetAuth(`${V1}/users/me/support/tickets/${ticketId}`);
}

/** POST /users/me/support/tickets/:id/messages */
export async function replyToSupportTicket(ticketId, message) {
  return apiPostAuth(`${V1}/users/me/support/tickets/${ticketId}/messages`, {
    message,
  });
}

// ─── Auth ──────────────────────────────────────────────────────────────────

/** POST /auth/register */
export async function register(payload) {
  return apiPost(`${V1}/auth/register`, payload);
}

/** POST /auth/verify-email */
export async function verifyEmail(payload) {
  return apiPost(`${V1}/auth/verify-email`, payload);
}

/** POST /auth/login */
export async function login(payload) {
  return apiPost(`${V1}/auth/login`, payload);
}

/** POST /auth/social-login */
export async function socialLogin(payload) {
  return apiPost(`${V1}/auth/social-login`, payload);
}

/** POST /auth/refresh */
export async function refreshToken(refreshToken) {
  return apiPost(`${V1}/auth/refresh`, { refresh_token: refreshToken });
}

/** POST /auth/logout */
export async function logout(refreshToken) {
  return apiPost(`${V1}/auth/logout`, { refresh_token: refreshToken });
}

/** POST /auth/forgot-password */
export async function forgotPassword(email) {
  return apiPost(`${V1}/auth/forgot-password`, { email });
}

/** POST /auth/verify-otp */
export async function verifyOtp(email, otp) {
  return apiPost(`${V1}/auth/verify-otp`, { email, otp });
}

/** POST /auth/reset-password */
export async function resetPassword(payload) {
  return apiPost(`${V1}/auth/reset-password`, payload);
}

// ─── Utilities ─────────────────────────────────────────────────────────────

function buildQuery(params) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  if (!entries.length) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}
