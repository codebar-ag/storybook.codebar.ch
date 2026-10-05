<script setup lang="ts">
// One group of a settings page: title and description on the left, its fields
// in a Card on the right; stacked below md. Consecutive sections are divided
// by a rule. `#aside` adds to the left column, `#footer` to the card.
//
//     <SettingsSection title="Sender" description="Must be a verified sender.">
//         <Field label="Name">…</Field>
//     </SettingsSection>
import Card from '../molecules/Card.vue';

export interface SettingsSectionProps {
    title: string;
    description?: string | null;
    /** false for edge-to-edge content (a StackedList, a table). */
    padded?: boolean;
}

withDefaults(defineProps<SettingsSectionProps>(), { description: null, padded: true });
</script>

<template>
  <section class="grid gap-4 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10">
    <div>
      <h2 class="text-sm font-semibold text-ink">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-1 text-sm text-muted"
      >
        {{ description }}
      </p>
      <slot name="aside" />
    </div>
    <Card :padded="padded">
      <div :class="padded ? 'space-y-4' : ''">
        <slot />
      </div>
      <template
        v-if="$slots.footer"
        #footer
      >
        <slot name="footer" />
      </template>
    </Card>
  </section>
</template>
