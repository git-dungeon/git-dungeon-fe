import type { CSSProperties, ReactNode } from "react";
import {
  EQUIPMENT_SLOTS,
  type CharacterStatSummary,
  type EmbedPreviewLanguage,
  type EmbedPreviewSize,
  type EmbedPreviewTheme,
  type EquipmentSlot,
  type InventoryItem,
} from "../types";
import {
  EMBED_SATORI_DEFAULT_FONT_FAMILY,
  resolveEmbedSatoriPalette,
  resolveEmbedSatoriPreset,
  resolveEmbedSatoriStrings,
} from "../lib/satori-presets";
import {
  formatInventoryEffect,
  formatLocaleNumber,
  formatModifierSummary,
  formatRarity,
} from "../lib/item-format";
import { getSlotLabel } from "../lib/slot-labels";

const BADGE_TONE_COLORS: Record<"gain" | "loss" | "neutral", string> = {
  gain: "#10b981",
  loss: "#ef4444",
  neutral: "#6b7280",
};


const STAT_KEYS = ["hp", "atk", "def", "luck"] as const;
const SUMMARY_CARD_HEIGHT = 160;
const STATS_CARD_HEIGHT = 176;
const EQUIPMENT_CARD_HEIGHT = 200;
const SUMMARY_ITEM_GAP = 16;
const STATS_ITEM_GAP = 16;
const EQUIPMENT_ITEM_GAP = 12;
const SECTION_TITLE_HEIGHT = 28;
const SECTION_VERTICAL_GAP = 24;

function estimateBannerHeight(
  preset: ReturnType<typeof resolveEmbedSatoriPreset>,
  summaryCount: number,
  statsCount: number,
  equipmentCount: number
) {
  const summaryColumns = Math.max(1, preset.headerColumns);
  const statsColumns = Math.max(1, preset.statsColumns);
  const equipmentColumns = Math.max(1, preset.equipmentColumns);

  const summaryRows = Math.ceil(summaryCount / summaryColumns);
  const statsRows = Math.ceil(statsCount / statsColumns);
  const equipmentRows = Math.ceil(equipmentCount / equipmentColumns);

  const summaryHeight =
    summaryRows * SUMMARY_CARD_HEIGHT +
    (summaryRows > 0 ? (summaryRows - 1) * SUMMARY_ITEM_GAP : 0);

  const statsHeight =
    statsRows > 0
      ? SECTION_VERTICAL_GAP +
        SECTION_TITLE_HEIGHT +
        statsRows * STATS_CARD_HEIGHT +
        (statsRows - 1) * STATS_ITEM_GAP
      : 0;

  const equipmentHeight =
    equipmentRows > 0
      ? SECTION_VERTICAL_GAP +
        SECTION_TITLE_HEIGHT +
        equipmentRows * EQUIPMENT_CARD_HEIGHT +
        (equipmentRows - 1) * EQUIPMENT_ITEM_GAP
      : 0;

  const rootGap = 24; // gap between header section and content section
  const contentGap = 16; // gap between stats and equipment sections

  return (
    preset.paddingY * 2 +
    summaryHeight +
    (statsHeight > 0 || equipmentHeight > 0 ? rootGap : 0) +
    statsHeight +
    (statsHeight > 0 && equipmentHeight > 0 ? contentGap : 0) +
    equipmentHeight
  );
}

export interface DashboardEmbeddingBannerSatoriProps {
  level: number;
  exp: number;
  expToLevel: number;
  gold: number;
  ap: number;
  floor: {
    current: number;
    best: number;
    progress: number;
  };
  stats: CharacterStatSummary;
  equipment: InventoryItem[];
  theme: EmbedPreviewTheme;
  size: EmbedPreviewSize;
  language: EmbedPreviewLanguage;
}

export function resolveDashboardEmbeddingBannerLayout(
  props: DashboardEmbeddingBannerSatoriProps
): {
  preset: ReturnType<typeof resolveEmbedSatoriPreset>;
  strings: ReturnType<typeof resolveEmbedSatoriStrings>;
  headerItems: SummaryCardItem[];
  height: number;
} {
  const preset = resolveEmbedSatoriPreset(props.size);
  const strings = resolveEmbedSatoriStrings(props.language);
  const headerItems = buildHeaderItems({
    level: props.level,
    exp: props.exp,
    expToLevel: props.expToLevel,
    floor: props.floor,
    gold: props.gold,
    ap: props.ap,
    strings,
    language: props.language,
  });

  const estimatedHeight = estimateBannerHeight(
    preset,
    headerItems.length,
    STAT_KEYS.length,
    EQUIPMENT_SLOTS.length
  );

  const height = Math.max(preset.height, Math.ceil(estimatedHeight));

  return {
    preset,
    strings,
    headerItems,
    height,
  };
}

export function DashboardEmbeddingBannerSatori({
  level,
  exp,
  expToLevel,
  gold,
  ap,
  floor,
  stats,
  equipment,
  theme,
  size,
  language,
}: DashboardEmbeddingBannerSatoriProps) {
  const { preset, strings, headerItems, height } =
    resolveDashboardEmbeddingBannerLayout({
      level,
      exp,
      expToLevel,
      gold,
      ap,
      floor,
      stats,
      equipment,
      theme,
      size,
      language,
    });
  const palette = resolveEmbedSatoriPalette(theme);
  const isDarkTheme = theme === "dark";

  const headerColumns = Math.max(1, preset.headerColumns);
  const headerGap = 16;

  const rootStyle: CSSProperties = {
    width: preset.width,
    height,
    padding: `${preset.paddingY}px ${preset.paddingX}px`,
    boxSizing: "border-box",
    borderRadius: 24,
    border: `1px solid ${palette.border}`,
    backgroundImage: `linear-gradient(135deg, ${palette.background}, ${palette.backgroundAccent})`,
    color: palette.foreground,
    fontFamily: EMBED_SATORI_DEFAULT_FONT_FAMILY,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    boxShadow: `0 18px 36px rgba(15, 23, 42, ${isDarkTheme ? 0.35 : 0.12})`,
    overflow: "hidden",
  };

  const headerWrapperStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    margin: -(headerGap / 2),
  };

  const contentWrapperStyle: CSSProperties =
    size === "compact"
      ? {
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }
      : {
          display: "flex",
          flexDirection: "row",
          gap: 24,
        };

  const statsSectionStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flexGrow: size === "compact" ? 0 : 1.4,
    flexBasis: size === "compact" ? "auto" : 0,
  };

  const equipmentSectionStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flexGrow: size === "compact" ? 0 : 1,
    flexBasis: size === "compact" ? "auto" : 0,
  };

  return (
    <div style={rootStyle} aria-label="캐릭터 임베딩 정보">
      <div style={headerWrapperStyle}>
        {headerItems.map((item) => (
          <div
            key={item.title}
            style={{
              flexBasis: `${100 / headerColumns}%`,
              padding: headerGap / 2,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SummaryCard {...item} palette={palette} isDark={isDarkTheme} />
          </div>
        ))}
      </div>

      <SectionBlock containerStyle={contentWrapperStyle}>
        <div style={statsSectionStyle}>
          <SectionTitle palette={palette}>{strings.stats}</SectionTitle>
          <StatsGrid
            stats={stats}
            columns={preset.statsColumns}
            palette={palette}
            language={language}
          />
        </div>
        <div style={equipmentSectionStyle}>
          <SectionTitle palette={palette}>{strings.equipment}</SectionTitle>
          <EquipmentGrid
            equipment={equipment}
            columns={preset.equipmentColumns}
            palette={palette}
            strings={strings}
            language={language}
          />
        </div>
      </SectionBlock>
    </div>
  );
}

interface SummaryCardItem {
  title: string;
  primary: string;
  secondary?: string;
  progressPercent?: number;
}

function SummaryCard({
  title,
  primary,
  secondary,
  progressPercent,
  palette,
  isDark,
  showProgress = true,
}: SummaryCardItem & {
  palette: ReturnType<typeof resolveEmbedSatoriPalette>;
  isDark: boolean;
  showProgress?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        borderRadius: 12,
        backgroundColor: palette.cardBackground,
        border: `1px solid ${palette.border}`,
        boxShadow: `0 10px 20px rgba(15, 23, 42, ${isDark ? 0.28 : 0.08})`,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: palette.mutedForeground,
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: palette.foreground,
        }}
      >
        {primary}
      </span>
      {secondary ? (
        <span
          style={{
            fontSize: 12,
            color: palette.mutedForeground,
          }}
        >
          {secondary}
        </span>
      ) : null}
      {showProgress && typeof progressPercent === "number" ? (
        <ProgressBar value={progressPercent} palette={palette} />
      ) : null}
    </div>
  );
}

function ProgressBar({
  value,
  palette,
}: {
  value: number;
  palette: ReturnType<typeof resolveEmbedSatoriPalette>;
}) {
  return (
    <div
      style={{
        display: "flex",
        height: 8,
        width: "100%",
        borderRadius: 999,
        backgroundColor: `${palette.border}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          borderRadius: 999,
          backgroundColor: palette.foreground,
        }}
      />
    </div>
  );
}

function buildHeaderItems({
  level,
  exp,
  expToLevel,
  floor,
  gold,
  ap,
  strings,
  language,
}: {
  level: number;
  exp: number;
  expToLevel: number;
  floor: { current: number; best: number; progress: number };
  gold: number;
  ap: number;
  strings: ReturnType<typeof resolveEmbedSatoriStrings>;
  language: EmbedPreviewLanguage;
}): SummaryCardItem[] {
  const expPercent = calculatePercent(exp, expToLevel);
  const floorPercent = calculatePercent(floor.progress, 100);

  return [
    {
      title: strings.level,
      primary: `Lv. ${level}`,
      secondary: `${formatLocaleNumber(exp, language)} / ${formatLocaleNumber(expToLevel, language)}`,
      progressPercent: expPercent,
    },
    {
      title: strings.floorProgress,
      primary: `${floor.current}F / ${floor.best}F`,
      secondary:
        language === "ko"
          ? `진행도 ${floorPercent}%`
          : `Progress ${floorPercent}%`,
      progressPercent: floorPercent,
    },
    {
      title: strings.gold,
      primary: `${formatLocaleNumber(gold, language)} G`,
      secondary: language === "ko" ? "총 보유 골드" : "Total Gold",
    },
    {
      title: strings.ap,
      primary: formatLocaleNumber(ap, language),
      secondary: language === "ko" ? "행동력" : "Action Points",
    },
  ];
}

function calculatePercent(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

interface SectionBlockProps {
  children: ReactNode;
  containerStyle?: CSSProperties;
}

function SectionBlock({ children, containerStyle }: SectionBlockProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        ...containerStyle,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  palette,
  children,
}: {
  palette: ReturnType<typeof resolveEmbedSatoriPalette>;
  children: ReactNode;
}) {
  return (
    <h3
      style={{
        fontSize: 14,
        fontWeight: 600,
        color: palette.foreground,
      }}
    >
      {children}
    </h3>
  );
}

interface StatsGridProps {
  stats: CharacterStatSummary;
  columns: number;
  palette: ReturnType<typeof resolveEmbedSatoriPalette>;
  language: EmbedPreviewLanguage;
}

function StatsGrid({ stats, columns, palette, language }: StatsGridProps) {
  const columnCount = Math.max(1, columns);
  const itemGap = 16;
  const containerStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    margin: -(itemGap / 2),
  };

  const isKorean = language === "ko";
  const entries = [
    {
      key: "hp",
      title: "HP",
      caption: isKorean
        ? `최대 HP ${formatLocaleNumber(stats.total.maxHp, language)}`
        : `Max HP ${formatLocaleNumber(stats.total.maxHp, language)}`,
      total: stats.total.hp,
      bonus: stats.equipmentBonus.hp,
    },
    {
      key: "atk",
      title: "ATK",
      caption: isKorean ? "공격력" : "Attack",
      total: stats.total.atk,
      bonus: stats.equipmentBonus.atk,
    },
    {
      key: "def",
      title: "DEF",
      caption: isKorean ? "방어력" : "Defense",
      total: stats.total.def,
      bonus: stats.equipmentBonus.def,
    },
    {
      key: "luck",
      title: "LUCK",
      caption: isKorean ? "행운" : "Luck",
      total: stats.total.luck,
      bonus: stats.equipmentBonus.luck,
    },
  ];

  return (
    <div style={containerStyle}>
      {entries.map((entry) => (
        <div
          key={entry.key}
          style={{
            flexBasis: `${100 / columnCount}%`,
            padding: itemGap / 2,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${palette.border}`,
              backgroundColor: palette.cardBackground,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: palette.mutedForeground,
                fontWeight: 600,
              }}
            >
              {entry.title}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700 }}>
                {formatLocaleNumber(entry.total, language)}
              </span>
              {entry.bonus !== 0 ? (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color:
                      entry.bonus > 0
                        ? BADGE_TONE_COLORS.gain
                        : BADGE_TONE_COLORS.loss,
                    ...(entry.bonus > 0
                      ? {
                          textShadow:
                            "0 0 4px rgba(16, 185, 129, 0.45), 0 0 12px rgba(16, 185, 129, 0.25)",
                        }
                      : {}),
                  }}
                >
                  ({entry.bonus > 0 ? "+" : ""}
                  {formatLocaleNumber(Math.abs(entry.bonus), language)})
                </span>
              ) : null}
            </div>
            <span style={{ fontSize: 12, color: palette.mutedForeground }}>
              {entry.caption}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

interface EquipmentGridProps {
  equipment: InventoryItem[];
  columns: number;
  palette: ReturnType<typeof resolveEmbedSatoriPalette>;
  strings: ReturnType<typeof resolveEmbedSatoriStrings>;
  language: EmbedPreviewLanguage;
}

function EquipmentGrid({
  equipment,
  columns,
  palette,
  strings,
  language,
}: EquipmentGridProps) {
  const columnCount = Math.max(1, columns);
  const itemGap = 12;
  const containerStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    margin: -(itemGap / 2),
  };

  const equipmentMap = EQUIPMENT_SLOTS.reduce<
    Record<EquipmentSlot, InventoryItem | null>
  >(
    (acc, slot) => {
      acc[slot] = equipment.find((item) => item.slot === slot) ?? null;
      return acc;
    },
    {
      helmet: null,
      armor: null,
      weapon: null,
      ring: null,
    }
  );

  return (
    <div style={containerStyle}>
      {EQUIPMENT_SLOTS.map((slot) => {
        const item = equipmentMap[slot];
        if (!item) {
          return (
            <div
              key={slot}
              style={{
                flexBasis: `${100 / columnCount}%`,
                padding: itemGap / 2,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <EmptyEquipmentCard
                slot={slot}
                palette={palette}
                language={language}
                emptyLabel={strings.equipmentEmpty}
              />
            </div>
          );
        }

        return (
          <div
            key={`${slot}-${item.id}`}
            style={{
              flexBasis: `${100 / columnCount}%`,
              padding: itemGap / 2,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <EquipmentCard item={item} palette={palette} language={language} />
          </div>
        );
      })}
    </div>
  );
}

function EquipmentCard({
  item,
  palette,
  language,
}: {
  item: InventoryItem;
  palette: ReturnType<typeof resolveEmbedSatoriPalette>;
  language: EmbedPreviewLanguage;
}) {
  const slotLabel = getSlotLabel(item.slot, language);
  const rarityLabel = formatRarity(item.rarity, language);
  const effectLabel = item.effect
    ? formatInventoryEffect(item.effect, language)
    : null;

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.cardBackground,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          border: `1px solid ${palette.border}`,
          backgroundColor: palette.secondary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {item.sprite ? (
          <img
            src={item.sprite}
            alt={item.name}
            width={56}
            height={56}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: palette.mutedForeground,
            }}
          >
            {item.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: palette.mutedForeground,
            justifyContent: "center",
          }}
        >
          {slotLabel}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: palette.foreground,
          }}
        >
          {item.name}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
        }}
      >
        <Badge palette={palette}>{rarityLabel}</Badge>
        {item.modifiers.map((modifier, index) => {
          const { text, tone } = formatModifierSummary(modifier, language);
          return (
            <Badge
              key={`${modifier.stat}-${modifier.value}-${index}`}
              palette={palette}
              tone={tone}
            >
              {text}
            </Badge>
          );
        })}
        {effectLabel ? <Badge palette={palette}>{effectLabel}</Badge> : null}
      </div>
    </div>
  );
}

function EmptyEquipmentCard({
  slot,
  palette,
  language,
  emptyLabel,
}: {
  slot: EquipmentSlot;
  palette: ReturnType<typeof resolveEmbedSatoriPalette>;
  language: EmbedPreviewLanguage;
  emptyLabel: string;
}) {
  const slotLabel = getSlotLabel(slot, language);

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.cardBackground,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        textAlign: "center",
        color: palette.mutedForeground,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          border: `1px dashed ${palette.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 18 }}>—</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {slotLabel}
        </span>
        <span style={{ fontSize: 12 }}>{emptyLabel}</span>
      </div>
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  palette: ReturnType<typeof resolveEmbedSatoriPalette>;
  tone?: "gain" | "loss" | "neutral";
}

function Badge({ children, palette, tone = "neutral" }: BadgeProps) {
  const toneColor = BADGE_TONE_COLORS[tone];
  const isNeutral = tone === "neutral";

  return (
    <span
      style={{
        borderRadius: 999,
        border: `1px solid ${isNeutral ? palette.border : toneColor}`,
        backgroundColor: isNeutral ? palette.secondary : `${toneColor}1f`,
        color: isNeutral ? palette.mutedForeground : toneColor,
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}
