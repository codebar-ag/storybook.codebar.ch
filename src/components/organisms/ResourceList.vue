<script setup lang="ts">
import Card from '../molecules/Card.vue';
import EmptyState from '../molecules/EmptyState.vue';
import ListRow from '../molecules/ListRow.vue';
import ListIcon from '../atoms/ListIcon.vue';
import type { IconName } from '../../icons';

// Card-framed list of rows with a built-in empty state and trailing "add" row — the
// shell that every index/list page repeated. Callers own the per-row markup through
// the scoped slots (`row`, plus optional `row-leading` / `row-trailing` that map onto
// each ListRow's leading/trailing regions), so this stays presentation-only and generic.
//
// Each item's link is read from `hrefKey` (default `href`); set it to make rows
// clickable. The v-for `:key` comes from `rowKey`, falling back to the href, then index.
const props = withDefaults(
    defineProps<{
        items: Array<Record<string, unknown>>;
        hrefKey?: string;
        rowKey?: string | null;
        emptyIcon?: IconName;
        emptyVariant?: 'accent' | 'danger' | 'success' | 'warning' | 'neutral';
        emptyTitle?: string | null;
        emptyDescription?: string | null;
        addHref?: string | null;
        addLabel?: string;
        addIcon?: IconName;
    }>(),
    {
        hrefKey: 'href',
        rowKey: null,
        emptyIcon: 'sparkles',
        emptyVariant: 'neutral',
        emptyTitle: null,
        emptyDescription: null,
        addHref: null,
        addLabel: 'Add new',
        addIcon: 'plus',
    },
);

function keyOf(item: Record<string, unknown>, index: number): string | number {
    const raw = props.rowKey ? item[props.rowKey] : item[props.hrefKey];
    return (raw as string | number | undefined) ?? index;
}

function hrefOf(item: Record<string, unknown>): string | undefined {
    return (item[props.hrefKey] as string | undefined) ?? undefined;
}
</script>

<template>
  <Card
    :padded="false"
    class="overflow-hidden"
  >
    <template v-if="items.length">
      <ListRow
        v-for="(item, index) in items"
        :key="keyOf(item, index)"
        :href="hrefOf(item)"
        :first="index === 0"
      >
        <template
          v-if="$slots['row-leading']"
          #leading
        >
          <slot
            name="row-leading"
            :item="item"
            :index="index"
          />
        </template>

        <slot
          name="row"
          :item="item"
          :index="index"
        />

        <template
          v-if="$slots['row-trailing']"
          #trailing
        >
          <slot
            name="row-trailing"
            :item="item"
            :index="index"
          />
        </template>
      </ListRow>
    </template>

    <EmptyState
      v-else
      :icon="emptyIcon"
      :variant="emptyVariant"
      :title="emptyTitle"
      :description="emptyDescription"
    >
      <template
        v-if="$slots['empty-actions']"
        #actions
      >
        <slot name="empty-actions" />
      </template>
    </EmptyState>

    <ListRow
      v-if="addHref"
      :href="addHref"
    >
      <template #leading>
        <ListIcon :name="addIcon" />
      </template>
      <span class="font-semibold text-base">{{ addLabel }}</span>
    </ListRow>
  </Card>
</template>
