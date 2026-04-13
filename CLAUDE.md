# CLAUDE.md — Welding Tutorial App

## Проект
Мобильный обучающий туториал по сварке. Vue 3 SPA, русскоязычный, ориентирован на практиков.
Репозиторий: https://github.com/rmrrt/test-proj
Активная ветка разработки: `dev`

## Стек
- Vue 3 + Vite 8 + TypeScript + Pinia + Vue Router
- Node.js 22+ (обязательно — Vite 8 не работает на Node < 20.19)
- Планируется: Capacitor (iOS/Android)

## Структура проекта
src/
  components/
    lesson/         # TheoryStep.vue, QuizStep.vue
    tools/          # ModeCalculator.vue, DefectChallenge.vue, WeldingChecklist.vue
  composables/
    useDevMode.ts   # Dev-режим через ?dev=true
  content/
    modules/        # module-0..4 — контент уроков как TS-объекты
  services/
    checklistService.ts  # Абстракция хранилища (сейчас localStorage, готово к API)
  stores/
    content.ts      # Регистрация модулей
    progress.ts     # Прогресс пользователя
  types/
    content.ts      # Lesson, Module, VideoRef, ChecklistItem и др.
  views/            # ModulesView, LessonView, GearView, ToolsView, ChecklistListView, CustomChecklistView...
docs/
  superpowers/
    specs/          # Актуальная спека проекта

## Модули (текущее состояние)
| ID | Название | Уроков | Зависит от |
|----|----------|--------|------------|
| module-0 | Азы сварки | 7 | — |
| module-1 | Оборудование | 2 | module-0 |
| module-2 | Первый шов | 6 | module-1 |
| module-3 | Металловедение | 5 | module-0 |
| module-4 | Разделка кромок | 5 | module-0, module-2 |
| module-5 | Металловедение: продвинутый | 5 | module-3 |

## Структура урока (обязательные поля)
Каждый урок содержит: theory, quiz (3 вопроса, порог 80%), practicalNote, videos.

quiz: объяснения ошибок обязательны.

practicalNote: { summary: string, examples?: string[] }

videos: [{ platform, url, title, channel }] — YouTube + RuTube

## Правила добавления контента
- Новый модуль → новый файл src/content/modules/module-N-*.ts + регистрация в src/stores/content.ts
- Ссылки на ГОСТы где применимо (5264-80, 9467-75, 12.3.003-86, 2.312-72, 30242-97)
- Видео YouTube: канал Школа Сварки РВТ. RuTube: FUBAG, СВАРГО, SIKE и др.

## Сервисный слой — паттерн
checklistService.ts — все методы async, localStorage сейчас, API потом.
При добавлении новых сервисов — тот же паттерн.
TODO-комментарии с ожидаемыми REST эндпоинтами обязательны.

## Dev-режим
Активация: ?dev=true в URL → сохраняется в localStorage (ключ welding-dev-mode).
Эффекты: все уроки разблокированы, правильные ответы подсвечены в квизах.
Деактивация: удалить ключ welding-dev-mode из localStorage.

## Инструменты (текущие + в разработке)
| Инструмент | Статус | Назначение |
|---|---|---|
| CarbonEquivalentCalculator | ✅ Готов | Расчёт CE для прогноза твёрдости |
| MetalCompatibilityTable | ✅ Готов | Таблица совместимости металлов |
| ModeCalculator | ✅ Готов | Расчёт параметров режима |
| DefectChallenge | ✅ Готов | Тренировка распознавания дефектов |
| WeldingChecklist | ✅ Готов | Чеклист перед сваркой |
| HeatInputCalculator | 🔧 dev-sprint-2 | Тепловой ввод (MJ/mm) |
| HardnessPredictorCalculator | 🔧 dev-sprint-2 | Прогноз HV в ЗТВ |

## Git
- Активная ветка разработки: dev, dev-sprint-2 (не пушить напрямую в main)
- Коммиты: feat / fix / docs / refactor + описание на английском

## Dev-сервер
npm run dev -- --host   # доступ по сети (ngrok)
vite.config.ts: server.allowedHosts: ['all'] — уже настроено.

## Дорожная карта
### Sprint 2 (текущий)
- Heat Input Calculator: расчёт теплового воздействия в MJ/mm
- Hardness Predictor: прогноз твёрдости в ЗТВ по CE и режиму охлаждения
- Обновление docs с нотициями про новые инструменты

### Sprint 3+
1. Module-6 "Сварка в полевых условиях": спецпроблемы стройплощадок
2. Module-7 "TIG & MIG/MAG": отдельные глубокие модули по процессам
3. Module-8 "Дефекты и их исправление": практические кейсы
4. Gas Selection Advisor: селектор защитного газа
5. Positionality Guide: техника под разные углы (потолок, вертикаль)
6. Photo Defect Recognition: AI распознавание дефектов из фото
7. Аутентификация + бэк: миграция checklistService на REST API
8. Capacitor: мобильное приложение (iOS/Android)
