<script setup lang="ts">
import type { ContentBlock, SourceRef } from '@/types/content'

defineProps<{
  blocks: ContentBlock[]
  sources?: SourceRef[]
}>()

const emit = defineEmits<{ done: [] }>()
</script>

<template>
  <div class="theory">
    <div class="blocks">
      <div v-for="(block, i) in blocks" :key="i" class="block">
        <div v-if="block.kind === 'text'" class="block-text" v-html="renderMarkdown(block.markdown)" />

        <div v-else-if="block.kind === 'warning'" class="block-warning">
          <span class="warning-icon">⚠️</span>
          <p>{{ block.text }}</p>
        </div>

        <div v-else-if="block.kind === 'image'" class="block-image">
          <img :src="block.src" :alt="block.caption" />
          <p v-if="block.caption" class="caption">{{ block.caption }}</p>
        </div>
      </div>
    </div>

    <div v-if="sources?.length" class="sources">
      <span class="gost-tag">ИСТОЧНИКИ</span>
      <div class="source-list">
        <a v-for="src in sources" :key="src.label" :href="src.url" target="_blank" class="source-item">
          {{ src.label }}
        </a>
      </div>
    </div>

    <button class="btn btn-primary" @click="emit('done')">
      Понял, продолжить →
    </button>
  </div>
</template>

<script lang="ts">
// Simple markdown renderer (bold, headers, lists, tables)
function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\|(.+)\|$/gm, (row) => {
      const cells = row.split('|').filter(Boolean).map((c) => c.trim())
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (m) => `<table>${m}</table>`)
    .replace(/^(?!<[hut]|<li)(.+)$/gm, '<p>$1</p>')
    .replace(/<\/ul>\n<ul>/g, '')
    .replace(/<\/table>\n<table>/g, '')
    .replace(/\n<p><\/p>/g, '')
}

export { renderMarkdown }
</script>

<style scoped>
.theory {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.blocks {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(h2) {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  margin-top: 4px;
}

:deep(h3) {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}

:deep(p) {
  color: var(--text-primary);
  line-height: 1.65;
  margin-bottom: 8px;
}

:deep(strong) {
  color: #fff;
  font-weight: 700;
}

:deep(ul) {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(li) {
  color: var(--text-primary);
  line-height: 1.5;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin: 8px 0;
}

:deep(td) {
  padding: 8px 10px;
  border: 1px solid var(--border);
}

:deep(tr:first-child td) {
  background: rgba(233,69,96,0.1);
  font-weight: 600;
  color: var(--accent);
}

.block-warning {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(233, 69, 96, 0.08);
  border: 1px solid rgba(233, 69, 96, 0.3);
  border-radius: 8px;
  padding: 14px;
}

.warning-icon { font-size: 20px; flex-shrink: 0; }

.block-warning p {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
}

.block-image img {
  width: 100%;
  border-radius: 8px;
}

.caption {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 6px;
}

.sources {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.source-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.source-item {
  font-size: 11px;
  font-family: monospace;
  color: var(--text-link);
  text-decoration: none;
  background: rgba(88,166,255,0.08);
  border: 1px solid rgba(88,166,255,0.2);
  border-radius: 4px;
  padding: 3px 8px;
}

.source-item:hover {
  background: rgba(88,166,255,0.15);
}
</style>
