<script setup lang="ts">
import CodePreview from './CodePreview.vue';

withDefaults(
    defineProps<{
        knowledge?: string | null;
        schema?: string | Record<string, unknown> | null;
        knowledgeLabel?: string;
        schemaLabel?: string;
        maxHeight?: string;
    }>(),
    {
        knowledge: null,
        schema: null,
        knowledgeLabel: 'Knowledge',
        schemaLabel: 'Schema',
        maxHeight: '24rem',
    },
);

function schemaValue(schema: string | Record<string, unknown> | null | undefined): string {
    if (schema == null) {
        return '';
    }

    return typeof schema === 'string' ? schema : JSON.stringify(schema, null, 2);
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="knowledge"
      class="space-y-1"
    >
      <p class="text-2xs uppercase tracking-wide text-muted">
        {{ knowledgeLabel }}
      </p>
      <CodePreview
        :value="knowledge"
        language="markdown"
        :max-height="maxHeight"
      />
    </div>
    <div
      v-if="schema"
      class="space-y-1"
    >
      <p class="text-2xs uppercase tracking-wide text-muted">
        {{ schemaLabel }}
      </p>
      <CodePreview
        :value="schemaValue(schema)"
        language="json"
        :max-height="maxHeight"
      />
    </div>
  </div>
</template>
