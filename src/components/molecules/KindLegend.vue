<script setup lang="ts">
import KindMark from '../atoms/KindMark.vue';
import type { KindShape } from '../../kindShapes';
import type { Category } from '../../helpers/tone';
import type { IconName } from '../../icons';

/**
 * The four-row key for a `KindMark` axis.
 *
 * ## Why this ships with the mark rather than being left to the caller
 *
 * A visual encoding that has to be learned is only honest if it comes with the
 * thing that teaches it. `KindMark` puts a kind's name on every mark, so the
 * *glyph* never needs a legend — you can always just read the card. What does
 * need one is the silhouette, because a silhouette means "this box is the same
 * sort of thing as that box over there", and that is a claim about the set, not
 * about any one mark. Nothing on an individual card can convey it.
 *
 * So this legend is deliberately a legend of **families, not of kinds**. Four
 * rows for fifteen kinds, and it stays four rows for fifty. A legend that grew
 * with the axis would be the admission that the encoding had failed — at that
 * point the label on the card is the only truthful channel left, and the mark
 * is decoration.
 *
 * Render it once, near the diagram it explains, at whatever moment the diagram
 * stops being small enough to take in at a glance.
 */
export interface KindLegendItem {
    /** The family's silhouette — what this row is actually explaining. */
    shape: KindShape;
    /** The family's name. Not a kind name: kinds label themselves. */
    label: string;
    /** The family's reinforcing colour, if it has one. */
    category?: Category;
    /**
     * Optional. Usually omitted — a legend row explains the silhouette, and a
     * glyph in it invites reading the row as one particular kind.
     */
    icon?: IconName;
}

withDefaults(
    defineProps<{
        items: KindLegendItem[];
        /** Leading caption, e.g. "Kinds". Omitted when the context is obvious. */
        label?: string;
    }>(),
    { label: '' },
);
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
    <span
      v-if="label"
      class="text-2xs uppercase tracking-wide text-dim"
    >{{ label }}</span>

    <KindMark
      v-for="item in items"
      :key="item.label"
      :shape="item.shape"
      :label="item.label"
      :icon="item.icon"
      :category="item.category"
      size="sm"
    />
  </div>
</template>
