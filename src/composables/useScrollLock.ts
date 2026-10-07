import { onScopeDispose, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

interface SavedPage {
    scrollX: number;
    scrollY: number;
    rootOverflow: string;
    rootScrollBehavior: string;
    bodyOverflow: string;
    bodyPosition: string;
    bodyTop: string;
    bodyLeft: string;
    bodyWidth: string;
    bodyPaddingRight: string;
}

// One lock for the whole page, shared by every overlay. Each open overlay
// holds one reference; the page is frozen on the first and released on the
// last, so closing (or unmounting) the outer of two stacked overlays leaves
// the page locked behind the one still open.
let holders = 0;
let saved: SavedPage | null = null;

function freezePage(): void {
    const root = document.documentElement;
    const body = document.body;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    saved = {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        rootOverflow: root.style.overflow,
        rootScrollBehavior: root.style.scrollBehavior,
        bodyOverflow: body.style.overflow,
        bodyPosition: body.style.position,
        bodyTop: body.style.top,
        bodyLeft: body.style.left,
        bodyWidth: body.style.width,
        bodyPaddingRight: body.style.paddingRight,
    };

    // `overflow: hidden` alone does not stop iOS Safari: a touch drag on the
    // scrim still scrolls the document. Pinning <body> with position: fixed,
    // offset by the current scroll, does — and keeps the page visually where
    // it was. The offset is undone with scrollTo() on release.
    const paddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${saved.scrollY}px`;
    body.style.left = `-${saved.scrollX}px`;
    body.style.width = '100%';
    // The vanished desktop scrollbar would otherwise widen the page under the
    // overlay and shift the layout sideways.
    if (scrollbarWidth > 0) {
        body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    }
}

function releasePage(): void {
    if (saved === null) {
        return;
    }
    const root = document.documentElement;
    const body = document.body;
    const { scrollX, scrollY } = saved;

    root.style.overflow = saved.rootOverflow;
    body.style.overflow = saved.bodyOverflow;
    body.style.position = saved.bodyPosition;
    body.style.top = saved.bodyTop;
    body.style.left = saved.bodyLeft;
    body.style.width = saved.bodyWidth;
    body.style.paddingRight = saved.bodyPaddingRight;

    // A page with `scroll-behavior: smooth` would animate back from the top;
    // the restore has to be instant to be invisible.
    root.style.scrollBehavior = 'auto';
    window.scrollTo(scrollX, scrollY);
    root.style.scrollBehavior = saved.rootScrollBehavior;

    saved = null;
}

function acquire(): void {
    holders += 1;
    if (holders === 1) {
        freezePage();
    }
}

function release(): void {
    if (holders === 0) {
        return;
    }
    holders -= 1;
    if (holders === 0) {
        releasePage();
    }
}

/**
 * Locks page scrolling while `locked` is true, iOS Safari included. Locks are
 * reference-counted across all callers, so stacked overlays release the page
 * only when the last one closes. The page's scroll position and inline styles
 * are restored on release, which also happens when the calling scope is
 * disposed while locked (e.g. a component unmounted while open). SSR-safe:
 * the document is only touched in the browser.
 */
export function useScrollLock(locked: MaybeRefOrGetter<boolean>): void {
    if (typeof document === 'undefined') {
        return;
    }

    let holding = false;

    function hold(): void {
        if (!holding) {
            holding = true;
            acquire();
        }
    }

    function letGo(): void {
        if (holding) {
            holding = false;
            release();
        }
    }

    watch(() => toValue(locked), (on) => (on ? hold() : letGo()), { immediate: true });

    onScopeDispose(letGo);
}
