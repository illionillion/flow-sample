/* @flow */

export const confirm = (
    dialog: HTMLDialogElement,
    messageEl: HTMLParagraphElement,
    message: string
): Promise<boolean> =>
    new Promise((resolve) => {
        messageEl.textContent = message;

        dialog.addEventListener(
            'close',
            () => {
                resolve(dialog.returnValue === 'confirm');
            },
            { once: true }
        );

        dialog.showModal();
    });
