import { extendTailwindMerge } from 'tailwind-merge';

/**
 * The kit's single class-merge helper: `twMerge`, told about the custom theme
 * utilities it cannot classify on its own.
 *
 * `text-page-title` is a font SIZE (the `--text-page-title` theme token). Left
 * unregistered, tailwind-merge reads it as a text colour and drops it the
 * moment a `text-ink` follows. Only names that actually mis-merge go here, so
 * the merge behaviour of every existing class stays exactly as it was.
 */
export const cx = extendTailwindMerge({
    extend: {
        theme: {
            text: ['page-title'],
        },
    },
});
