/**
 * A singleton-style controller that allows programmatic confirmation dialogs
 * using an awaitable API (e.g. `await confirm({ ... })`).
 *
 * Internally connects to a UI render function registered once at app root.
 */
export default class ConfirmationController {
  constructor() {
    /**
     * @private
     * @type {(options: object, resolve: (value: boolean) => void) => void | null}
     */
    this._showDialog = null;
  }

  /**
   * Prompts the user with a confirmation dialog and resolves to their choice.
   *
   * @param {Object} options - Configuration for the dialog.
   * @param {string} [options.title] - Dialog title.
   * @param {string} [options.description] - Optional message body.
   * @param {string} [options.confirmLabel] - Label for the confirm button.
   * @param {string} [options.cancelLabel] - Label for the cancel button.
   * @param {string} [options.targetText] - Optional string the user must type to confirm.
   *
   * @returns {Promise<boolean>} Resolves to `true` if confirmed, `false` if cancelled.
   */
  create(options) {
    return new Promise((resolve) => {
      if (this._showDialog) {
        this._showDialog(options, resolve);
      } else {
        throw new Error("Confirmation dialog not mounted");
      }
    });
  }

  /**
   * @private
   * @param {(options: object, resolve: (value: boolean) => void) => void} showDialog
   */
  register(showDialog) {
    this._showDialog = showDialog;
  }
}
