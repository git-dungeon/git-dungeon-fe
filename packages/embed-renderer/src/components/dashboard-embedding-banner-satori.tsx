import type { CSSProperties } from "react";
import {
  EQUIPMENT_SLOTS,
  type CharacterStatSummary,
  type EmbedPreviewLanguage,
  type EmbedPreviewSize,
  type EmbedPreviewTheme,
  type EquipmentRarity,
  type EquipmentSlot,
  type InventoryItem,
} from "../types";
import { resolveEmbedSatoriPreset, resolveEmbedSatoriStrings } from "../lib/satori-presets";
import { formatLocaleNumber } from "../lib/item-format";
import { getSlotLabel } from "../lib/slot-labels";
import { resolvePixelTheme } from "../lib/pixel-theme";

const RARITY_COLORS: Record<EquipmentRarity, string> = {
  common: "#6b7280",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#facc15",
};

export interface DashboardEmbeddingBannerSatoriProps {
  level: number;
  exp: number;
  expToLevel: number;
  gold: number;
  ap: number;
  maxAp?: number;
  displayName?: string;
  avatarUrl?: string;
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
  height: number;
} {
  const preset = resolveEmbedSatoriPreset(props.size);
  const strings = resolveEmbedSatoriStrings(props.language);

  return {
    preset,
    strings,
    height: preset.height,
  };
}

export function DashboardEmbeddingBannerSatori({
  level,
  exp,
  expToLevel,
  gold,
  ap,
  maxAp,
  displayName,
  avatarUrl,
  floor,
  stats,
  equipment,
  theme,
  size,
  language,
}: DashboardEmbeddingBannerSatoriProps) {
  const { preset } = resolveDashboardEmbeddingBannerLayout({
    level,
    exp,
    expToLevel,
    gold,
    ap,
    maxAp,
    displayName,
    avatarUrl,
    floor,
    stats,
    equipment,
    theme,
    size,
    language,
  });
  const strings = resolveEmbedSatoriStrings(language);
  const palette = resolvePixelTheme(theme);
  const isWide = size === "wide";

  const hpCurrent = stats.total.hp;
  const hpMax = stats.total.maxHp || stats.total.hp;
  const expCurrent = exp;
  const expMax = expToLevel || exp;
  const apMax = maxAp ?? ap;

  const isGradientBackground = palette.panelBackground.includes("gradient(");
  const rootStyle: CSSProperties = {
    width: preset.width,
    height: preset.height,
    padding: `${preset.paddingY}px ${preset.paddingX}px`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    gap: 16,
    border: `4px solid ${palette.panelBorder}`,
    boxShadow: `0 6px 0 ${palette.panelShadow}`,
    color: palette.textPrimary,
    fontFamily: palette.fonts.body,
    overflow: "hidden",
  };
  if (isGradientBackground) {
    rootStyle.backgroundImage = palette.panelBackground;
  } else {
    rootStyle.backgroundColor = palette.panelBackground;
  }

  const leftSectionStyle: CSSProperties = {
    display: "flex",
    gap: 16,
    flex: isWide ? "0 0 520px" : "1 1 auto",
  };

  const infoStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
  };

  const nameStyle: CSSProperties = {
    fontFamily: palette.fonts.title,
    fontSize: 16,
    fontWeight: 700,
    textShadow: palette.textShadow,
  };

  const labelStyle: CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: palette.textPrimary,
    textShadow: palette.textShadow,
  };

  const valueStyle: CSSProperties = {
    fontSize: 12,
    color: palette.textPrimary,
    textShadow: palette.textShadow,
  };


  const statsSummaryStyle: CSSProperties = {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  };

  const avatarFrameStyle: CSSProperties = {
    width: 72,
    height: 72,
    borderRadius: 8,
    border: `3px solid ${palette.panelBorder}`,
    backgroundColor: palette.surfaceDeep,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const displayNameLabel =
    displayName ?? (language === "ko" ? "모험가" : "Adventurer");

  return (
    <div style={rootStyle} aria-label="캐릭터 임베딩 정보">
      <div style={leftSectionStyle}>
        <div style={avatarFrameStyle}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayNameLabel}
              width={72}
              height={72}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={nameStyle}>{displayNameLabel.charAt(0)}</span>
          )}
        </div>
        <div style={infoStyle}>
          <span style={nameStyle}>{displayNameLabel}</span>
          <StatRow
            label={strings.level}
            value={`Lv. ${formatLocaleNumber(level, language)}`}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
          />
          <StatBar
            label={strings.exp}
            current={expCurrent}
            total={expMax}
            gradient={palette.expGradient}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
            barSurface={palette.barSurface}
            barBorder={palette.barBorder}
            language={language}
          />
          <StatBar
            label="HP"
            current={hpCurrent}
            total={hpMax}
            gradient={palette.hpGradient}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
            barSurface={palette.barSurface}
            barBorder={palette.barBorder}
            language={language}
          />
          <StatRow
            label={strings.ap}
            value={`${formatLocaleNumber(ap, language)} / ${formatLocaleNumber(
              apMax,
              language
            )}`}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
          />
          <StatRow
            label={strings.gold}
            value={`${formatLocaleNumber(gold, language)} G`}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
          />
          <div style={statsSummaryStyle}>
            <StatPill
              label="ATK"
              value={stats.total.atk}
              labelStyle={labelStyle}
              valueStyle={valueStyle}
              background={palette.surfaceStrong}
              borderColor={palette.panelBorder}
              language={language}
            />
            <StatPill
              label="DEF"
              value={stats.total.def}
              labelStyle={labelStyle}
              valueStyle={valueStyle}
              background={palette.surfaceStrong}
              borderColor={palette.panelBorder}
              language={language}
            />
            <StatPill
              label="LUCK"
              value={stats.total.luck}
              labelStyle={labelStyle}
              valueStyle={valueStyle}
              background={palette.surfaceStrong}
              borderColor={palette.panelBorder}
              language={language}
            />
          </div>
        </div>
      </div>
      {isWide ? (
        <EquipmentSection
          equipment={equipment}
          language={language}
          palette={palette}
        />
      ) : null}
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
}

function StatRow({ label, value, labelStyle, valueStyle }: StatRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

interface StatBarProps {
  label: string;
  current: number;
  total: number;
  gradient: string;
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
  barSurface: string;
  barBorder: string;
  language: EmbedPreviewLanguage;
}

function StatBar({
  label,
  current,
  total,
  gradient,
  labelStyle,
  valueStyle,
  barSurface,
  barBorder,
  language,
}: StatBarProps) {
  const percent = calculatePercent(current, total);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span style={labelStyle}>{label}</span>
        <span style={valueStyle}>
          {formatLocaleNumber(current, language)} /{" "}
          {formatLocaleNumber(total, language)}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          position: "relative",
          height: 10,
          borderRadius: 6,
          background: barSurface,
          border: `1px solid ${barBorder}`,
          overflow: "hidden",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${percent}%`,
            backgroundImage: gradient,
          }}
        />
      </div>
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: number;
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
  background: string;
  borderColor: string;
  language: EmbedPreviewLanguage;
}

function StatPill({
  label,
  value,
  labelStyle,
  valueStyle,
  background,
  borderColor,
  language,
}: StatPillProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 8px",
        borderRadius: 8,
        background,
        border: `2px solid ${borderColor}`,
      }}
    >
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{formatLocaleNumber(value, language)}</span>
    </div>
  );
}

function calculatePercent(value: number, total: number) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

interface EquipmentSectionProps {
  equipment: InventoryItem[];
  language: EmbedPreviewLanguage;
  palette: ReturnType<typeof resolvePixelTheme>;
}

function EquipmentSection({ equipment, language, palette }: EquipmentSectionProps) {
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
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <span
        style={{
          fontFamily: palette.fonts.title,
          fontSize: 14,
          textShadow: palette.textShadow,
          color: palette.textPrimary,
        }}
      >
        {language === "ko" ? "착용 장비" : "Equipment"}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", margin: -6 }}>
        {EQUIPMENT_SLOTS.map((slot) => {
          const item = equipmentMap[slot];
          return (
            <div
              key={slot}
              style={{
                flexBasis: "50%",
                padding: 6,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SlotCard
                slot={slot}
                item={item}
                language={language}
                palette={palette}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SlotCardProps {
  slot: EquipmentSlot;
  item: InventoryItem | null;
  language: EmbedPreviewLanguage;
  palette: ReturnType<typeof resolvePixelTheme>;
}

function SlotCard({ slot, item, language, palette }: SlotCardProps) {
  const slotLabel = getSlotLabel(slot, language);
  const rarityColor = item ? RARITY_COLORS[item.rarity] : palette.panelBorder;

  return (
    <div
      style={{
        borderRadius: 10,
        border: `2px solid ${rarityColor}`,
        backgroundColor: palette.surfaceStrong,
        padding: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          border: `2px solid ${palette.panelBorder}`,
          backgroundColor: item ? palette.surfaceDeep : palette.slotPlaceholder,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {item?.sprite ? (
          <img
            src={item.sprite}
            alt={item.name}
            width={40}
            height={40}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              fontFamily: palette.fonts.title,
              fontSize: 14,
              color: palette.textPrimary,
              textShadow: palette.textShadow,
            }}
          >
            {slotLabel.charAt(0)}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: palette.textMuted,
            textShadow: palette.textShadow,
          }}
        >
          {slotLabel}
        </span>
        <span
          style={{
            fontSize: 12,
            color: palette.textPrimary,
            textShadow: palette.textShadow,
          }}
        >
          {item?.name ??
            (language === "ko" ? "빈 슬롯" : "Empty Slot")}
        </span>
      </div>
    </div>
  );
}
