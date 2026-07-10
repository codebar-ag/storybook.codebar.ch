import { twMerge } from 'tailwind-merge';

/**
 * The kit's single class-merge helper. Today this is plain `twMerge`; if
 * custom theme utilities (`rounded-control`, `text-2xs`, …) ever mis-merge
 * against standard ones, swap in `extendTailwindMerge` here — one file,
 * every component picks it up.
 */
export const cx = twMerge;
