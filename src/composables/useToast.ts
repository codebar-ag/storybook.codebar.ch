import { reactive, readonly } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastInput {
    message?: string;
    type?: ToastType;
    duration?: number;
}

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
    remaining: number;
    startedAt: number | null;
    timer: ReturnType<typeof setTimeout> | null;
    show: boolean;
}

const state = reactive<{ toasts: Toast[]; seq: number }>({ toasts: [], seq: 0 });

function start(toast: Toast): void {
    toast.startedAt = Date.now();
    toast.timer = setTimeout(() => dismiss(toast.id), toast.remaining);
}

/**
 * Queue a toast. Mirrors the producers of the legacy Alpine toaster:
 * copy buttons, Inertia flash props, and server feedback all funnel here.
 */
export function push(detail: ToastInput = {}): number {
    const type: ToastType = detail.type ?? 'info';
    const duration = detail.duration ?? (type === 'error' ? 6000 : 3500);
    const toast: Toast = {
        id: ++state.seq,
        message: detail.message ?? 'Done.',
        type,
        duration,
        remaining: duration,
        startedAt: null,
        timer: null,
        show: false,
    };
    state.toasts.push(toast);
    // Operate on the REACTIVE proxy, not the raw object — mutating the raw
    // `toast` would update the value without triggering a re-render.
    const added = state.toasts[state.toasts.length - 1];
    // Next tick: flip `show` so the enter transition runs.
    requestAnimationFrame(() => {
        added.show = true;
    });
    start(added);
    return added.id;
}

export function dismiss(id: number): void {
    const toast = state.toasts.find((t) => t.id === id);
    if (!toast) {
        return;
    }
    if (toast.timer) {
        clearTimeout(toast.timer);
    }
    toast.show = false;
    setTimeout(() => {
        // Splice in place: consumers hold a readonly proxy of THIS array
        // (see useToast), so reassigning `state.toasts` to a filtered copy
        // would leave them rendering the stale array forever.
        const index = state.toasts.findIndex((t) => t.id === id);
        if (index !== -1) {
            state.toasts.splice(index, 1);
        }
    }, 200);
}

export function pause(toast: Toast): void {
    if (toast.timer) {
        clearTimeout(toast.timer);
    }
    if (toast.startedAt !== null) {
        toast.remaining -= Date.now() - toast.startedAt;
    }
}

export function resume(toast: Toast): void {
    if (toast.remaining > 0) {
        start(toast);
    }
}

/**
 * Reactive access to the toast store plus its controls. The `Toaster` atom
 * consumes this; application code typically only calls `push()`.
 */
export function useToast() {
    return {
        toasts: readonly(state.toasts),
        push,
        dismiss,
        pause,
        resume,
    };
}
