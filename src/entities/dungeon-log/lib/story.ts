import type {
  DungeonLogAction,
  DungeonLogEntry,
} from "@/entities/dungeon-log/model/types";
import { i18next } from "@/shared/i18n/i18n";

const STORY_ACTIONS: DungeonLogAction[] = [
  "BATTLE",
  "REST",
  "TRAP",
  "TREASURE",
];

const STORY_ACTION_SET = new Set<DungeonLogAction>(STORY_ACTIONS);

interface StoryMessage {
  text: string;
  usesMonster: boolean;
}

interface StoryOptions {
  monsterName?: string | null;
}

export function resolveStoryMessage(
  entry: DungeonLogEntry,
  options: StoryOptions = {}
): StoryMessage | undefined {
  if (!STORY_ACTION_SET.has(entry.action)) {
    return undefined;
  }

  const key = `logs.story.${entry.action}.${entry.status}`;
  const templates = resolveStoryTemplates(key);
  if (!templates || templates.length === 0) {
    return undefined;
  }

  const index = hashSeed(`${entry.id}:${key}`) % templates.length;
  const template = templates[index];
  const usesMonster = template.includes("{{monster}}");
  const monsterName = options.monsterName ?? resolveStoryMonsterFallback();

  return {
    text: interpolateTemplate(template, { monster: monsterName }),
    usesMonster,
  };
}

function resolveStoryTemplates(key: string): string[] | undefined {
  const value = i18next.t(key, { returnObjects: true });

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string" && value !== key) {
    return [value];
  }

  return undefined;
}

function resolveStoryMonsterFallback(): string {
  const key = "logs.story.fallback.monster";
  const fallback = i18next.t(key);
  return fallback === key ? "enemy" : fallback;
}

function interpolateTemplate(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
    return values[key] ?? "";
  });
}

function hashSeed(seed: string): number {
  return Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
