<script setup lang="ts">
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
    <div class="header">
      <div class="gost-tag">ДОКУМЕНТАЦИЯ</div>
      <h2>О приложении</h2>
    </div>

    <div class="app-info card">
      <h3>Сварщик с нуля</h3>
      <p>Интерактивное обучение сварке по российским стандартам. Для новичков и тех, кто хочет систематизировать знания.</p>
      <div class="version">v0.1.0-mvp</div>
    </div>

    <div class="disclaimer card">
      <div class="gost-tag" style="margin-bottom:8px;">⚠️ ВАЖНО</div>
      <p>Приложение создано в образовательных целях и <strong>не заменяет</strong> практическое обучение под руководством квалифицированного сварщика. Перед началом сварочных работ обязательно пройдите инструктаж по технике безопасности.</p>
    </div>

    <div class="section">
      <div class="gost-tag" style="margin-bottom:10px;">НОРМАТИВНАЯ БАЗА</div>
      <div class="gost-list">
        <a v-for="gost in gosts" :key="gost.code" :href="gost.url" target="_blank" class="gost-item">
          <span class="gost-code">{{ gost.code }}</span>
          <span class="gost-title">{{ gost.title }}</span>
          <span class="gost-link">↗</span>
        </a>
      </div>
    </div>

    <div class="section">
      <div class="gost-tag" style="margin-bottom:10px;">УЧЕБНАЯ ЛИТЕРАТУРА</div>
      <div class="book-list">
        <div v-for="book in books" :key="book" class="book-item">📖 {{ book }}</div>
      </div>
    </div>

    <div class="section">
      <div class="gost-tag" style="margin-bottom:10px;">ОТКРЫТЫЕ ИСТОЧНИКИ</div>
      <a href="https://docs.cntd.ru" target="_blank" class="source-link">
        docs.cntd.ru — Электронный фонд правовых и нормативно-технических документов ↗
      </a>
    </div>
  </div>
</template>

<style scoped>
.header { margin-bottom: 16px; }
.header h2 { margin-top: 4px; }
.app-info { margin-bottom: 12px; }
.app-info h3 { margin-bottom: 8px; }
.app-info p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
.version { margin-top: 10px; font-size: 11px; font-family: monospace; color: var(--text-secondary); }
.disclaimer { border-color: rgba(233,69,96,0.3); background: rgba(233,69,96,0.05); margin-bottom: 20px; }
.disclaimer p { font-size: 13px; line-height: 1.6; }
.disclaimer strong { color: var(--accent); }
.section { margin-bottom: 20px; }
.gost-list { display: flex; flex-direction: column; gap: 8px; }
.gost-item { display: flex; align-items: flex-start; gap: 10px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 12px; text-decoration: none; transition: border-color 0.15s; }
.gost-item:hover { border-color: var(--accent); }
.gost-code { font-family: monospace; font-size: 12px; color: var(--accent); font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.gost-title { flex: 1; font-size: 13px; color: var(--text-primary); line-height: 1.4; }
.gost-link { color: var(--text-secondary); flex-shrink: 0; }
.book-list { display: flex; flex-direction: column; gap: 8px; }
.book-item { font-size: 13px; color: var(--text-secondary); line-height: 1.5; padding: 10px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border); }
.source-link { font-size: 13px; color: var(--text-link); text-decoration: none; display: block; padding: 12px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border); }
.source-link:hover { border-color: var(--text-link); }
</style>
