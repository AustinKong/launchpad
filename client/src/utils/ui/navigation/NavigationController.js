/**
 * A singleton-style controller that allows global programmatic navigation
 * using React Router's `navigate()` under the hood.
 *
 * Allows redirects from outside React components.
 *
 * Use `navigation.goTo("/path")` or `navigation.replace("/path")`.
 */
export default class NavigationController {
  #navigateFn = null;

  /**
   * @private
   * @param {(path: string, options?: object) => void} navigateFn - The navigate function returned from `useNavigate()`
   */
  register(navigateFn) {
    this.#navigateFn = navigateFn;
  }

  /**
   * Performs a navigation to the given path by pushing a new entry into the browser history.
   *
   * @param {string} path - The path to navigate to.
   * @param {object} [options] - Additional options passed to React Router's `navigate()`, e.g. `{ state, replace }`
   * @throws {Error} If the navigate function is not registered
   */
  goTo(path, options = {}) {
    if (this.#navigateFn) {
      this.#navigateFn(path, options);
    } else {
      throw new Error("Navigate function is not registered");
    }
  }

  /**
   * Replaces the current history entry with the given path.
   * This prevents the user from going back to the previous page.
   *
   * @param {string} path - The path to navigate to.
   * @param {object} [options] - Additional options passed to `navigate()`
   */
  replace(path, options = {}) {
    this.goTo(path, { ...options, replace: true });
  }
}
