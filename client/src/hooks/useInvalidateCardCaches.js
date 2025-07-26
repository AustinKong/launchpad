import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook that returns a function to invalidate card-related cache entries in React Query.
 *
 * This is useful after mutations like star/unstar, archive/unarchive, or visibility changes.
 * It invalidates:
 * - The individual card queries (e.g. `["card", "id:123"]`, `["card", "slug:abc"]`)
 * - Relevant list views (e.g. `["cards", "starred"]`)
 *
 * @returns {function({id?: string, slug?: string, views?: string[]}): void}
 *
 * @example
 * const invalidate = useInvalidateCardCaches();
 * invalidate({ id: "abc123" }); // invalidates card and all views
 *
 * invalidate({ slug: "my-card", views: ["starred"] }); // only invalidate one view
 */
export function useInvalidateCardCaches() {
  const queryClient = useQueryClient();

  /**
   * Invalidates individual card and list view caches.
   *
   * @param {Object} params
   * @param {string} [params.id] - The card ID to invalidate.
   * @param {string} [params.slug] - The card slug to invalidate.
   * @param {string[]} [params.views=["starred", "owned", "archived", "library"]] - List views to invalidate.
   */
  function invalidateCardCaches({ id, slug, views }) {
    if (id) queryClient.invalidateQueries(["card", `id:${id}`]);
    if (slug) queryClient.invalidateQueries(["card", `slug:${slug}`]);

    for (const view of views) {
      queryClient.invalidateQueries(["cards", view]);
    }
  }

  return ({ id, slug, views = ["starred", "owned", "archived", "library"] }) => {
    invalidateCardCaches({ id, slug, views });
  };
}
