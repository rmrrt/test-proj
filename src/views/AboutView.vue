<script setup lang="ts">
import { ExternalLink, BookOpen, AlertTriangle } from 'lucide-vue-next'

const gosts = [
  { code: 'ГОСТ 5264-80', title: 'Ручная дуговая сварка. Соединения сварные', url: 'https://docs.cntd.ru/document/1200003842' },
  { code: 'ГОСТ 9467-75', title: 'Электроды покрытые металлические для РДС', url: 'https://docs.cntd.ru/document/1200008316' },
  { code: 'ГОСТ 12.3.003-86', title: 'Работы электросварочные. Требования безопасности', url: 'https://docs.cntd.ru/document/5200289' },
  { code: 'ГОСТ Р ИСО 4063-2010', title: 'Сварка и родственные процессы. Перечень процессов', url: 'https://docs.cntd.ru/document/1200082596' },
  { code: 'ГОСТ 30242-97', title: 'Дефекты соединений при сварке металлов плавлением', url: 'https://docs.cntd.ru/document/1200007071' },
]

const books = [
  'Виноградов В.С. — Оборудование и технология дуговой автоматической и механизированной сварки',
  'Куликов В.П. — Технология сварки плавлением',
  'Алёшин Н.П., Щербинский В.Г. — Контроль качества сварочных работ',
]
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div class="gost-tag">Документация</div>
      <h2>О приложении</h2>
    </div>

    <div class="app-info card animate-fade-in-up">
      <h3>Сварщик с нуля</h3>
      <p>Интерактивное обучение сварке по российским стандартам. Для новичков и тех, кто хочет систематизировать знания.</p>
      <div class="version">v0.1.0-mvp</div>
    </div>

    <div class="disclaimer animate-fade-in-up" style="animation-delay:50ms">
      <AlertTriangle :size="16" class="disclaimer-icon" />
      <p>Приложение создано в образовательных целях и <strong>не заменяет</strong> практическое обучение под руководством квалифицированного сварщика. Перед началом сварочных работ обязательно пройдите инструктаж по технике безопасности.</p>
    </div>

    <div class="section animate-fade-in-up" style="animation-delay:100ms">
      <div class="gost-tag section-label">Нормативная база</div>
      <div class="gost-list">
        <a v-for="gost in gosts" :key="gost.code" :href="gost.url" target="_blank" class="gost-item">
          <span class="gost-code">{{ gost.code }}</span>
          <span class="gost-title">{{ gost.title }}</span>
          <ExternalLink :size="13" class="ext-icon" />
        </a>
      </div>
    </div>

    <div class="section animate-fade-in-up" style="animation-delay:150ms">
      <div class="gost-tag section-label">Учебная литература</div>
      <div class="book-list">
        <div v-for="book in books" :key="book" class="book-item">
          <BookOpen :size="14" class="book-icon" />
          <span>{{ book }}</span>
        </div>
      </div>
    </div>

    <div class="section animate-fade-in-up" style="animation-delay:200ms">
      <div class="gost-tag section-label">Открытые источники</div>
      <a href="https://docs.cntd.ru" target="_blank" class="source-link">
        <span>docs.cntd.ru — Электронный фонд правовых и нормативно-технических документов</span>
        <ExternalLink :size="13" class="ext-icon" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.app-info { margin-bottom: 12px; }
.app-info h3 { margin-bottom: 8px; }
.app-info p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
.version { margin-top: 10px; font-size: 11px; font-family: 'SF Mono', monospace; color: var(--text-muted); }

.disclaimer {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(255, 107, 0, 0.07);
  border: 1px solid var(--accent-border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 20px;
}
.disclaimer-icon { color: var(--accent); flex-shrink: 0; margin-top: 1px; }
.disclaimer p { font-size: 13px; line-height: 1.6; }
.disclaimer strong { color: var(--accent); }

.section { margin-bottom: 20px; }
.section-label { margin-bottom: 10px; }

.gost-list { display: flex; flex-direction: column; gap: 8px; }

.gost-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}
.gost-item:hover { border-color: var(--accent); background: var(--bg-elevated); }
.gost-code { font-family: 'SF Mono', monospace; font-size: 11px; color: var(--accent); font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.gost-title { flex: 1; font-size: 13px; color: var(--text-primary); line-height: 1.4; }
.ext-icon { color: var(--text-muted); flex-shrink: 0; margin-top: 1px; }

.book-list { display: flex; flex-direction: column; gap: 8px; }

.book-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
.book-icon { color: var(--accent); flex-shrink: 0; margin-top: 1px; }

.source-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: border-color 0.15s, background 0.15s;
}
.source-link:hover { border-color: var(--accent); background: var(--bg-elevated); }
.source-link span { flex: 1; }
</style>
