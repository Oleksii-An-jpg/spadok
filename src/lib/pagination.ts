/**
 * Shared by the paginated admin list and the server component that reads the
 * page out of the URL. It lives here rather than next to the table because a
 * server component importing a plain value from a 'use client' module gets a
 * client reference, not the value itself.
 */
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZES = [10, 20, 30, 40, 50];
