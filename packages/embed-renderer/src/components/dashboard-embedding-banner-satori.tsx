import type { CSSProperties, ReactNode } from "react";
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
import {
  resolveEmbedSatoriPreset,
  resolveEmbedSatoriStrings,
} from "../lib/satori-presets";
import { formatLocaleNumber } from "../lib/item-format";
import { getSlotLabel } from "../lib/slot-labels";
import { resolvePixelTheme } from "../lib/pixel-theme";
import { COIN_ICON_DATA_URL } from "../assets/coin";

const RARITY_STYLES: Record<
  EquipmentRarity,
  { border: string; background: string; text: string }
> = {
  common: {
    border: "#6b7280",
    background: "#4b5563",
    text: "#f6f0e1",
  },
  uncommon: {
    border: "#22c55e",
    background: "#166534",
    text: "#f6f0e1",
  },
  rare: {
    border: "#3b82f6",
    background: "#1d4ed8",
    text: "#f6f0e1",
  },
  epic: {
    border: "#a855f7",
    background: "#7e22ce",
    text: "#f6f0e1",
  },
  legendary: {
    border: "#facc15",
    background: "#a16207",
    text: "#f6f0e1",
  },
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
  const bonusPositiveColor = "#22c55e";
  const bonusNegativeColor = "#ef4444";
  const statLabelWidth = 60;

  const isGradientBackground = palette.panelBackground.includes("gradient(");
  const borderSize = 3;
  const cornerSize = 8;
  const cornerOffset = -borderSize;
  const cornerColors = resolveCornerColors(palette.panelBackground);
  const cornerTopColor =
    cornerColors?.top ?? (isGradientBackground ? palette.surfaceStrong : palette.panelBackground);
  const cornerBottomColor =
    cornerColors?.bottom ?? (isGradientBackground ? palette.surfaceDeep : palette.panelBackground);
  const rootStyle: CSSProperties = {
    width: preset.width,
    height: preset.height,
    padding: `${preset.paddingY}px ${preset.paddingX}px`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    gap: 16,
    border: `${borderSize}px solid ${palette.frameBorder}`,
    borderRadius: 0,
    boxShadow: `0 3px 0 ${palette.frameShadow}, inset -2px -2px 0 ${palette.frameInsetShadow}, inset 2px 2px 0 ${palette.frameHighlight}`,
    color: palette.textPrimary,
    fontFamily: palette.fonts.body,
    overflow: "visible",
    position: "relative",
  };
  if (isGradientBackground) {
    rootStyle.backgroundImage = palette.panelBackground;
  } else {
    rootStyle.backgroundColor = palette.panelBackground;
  }
  const cornerCoverStyle: CSSProperties = {
    position: "absolute",
    width: cornerSize,
    height: cornerSize,
    pointerEvents: "none",
  };

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

  const buildValueWithBonus = (value: number, bonus: number) => {
    const formattedValue = formatLocaleNumber(value, language);
    if (!bonus) {
      return <span style={valueStyle}>{formattedValue}</span>;
    }
    const sign = bonus > 0 ? "+" : "";
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={valueStyle}>{formattedValue}</span>
        <span
          style={{
            ...valueStyle,
            fontSize: 10,
            color: bonus > 0 ? bonusPositiveColor : bonusNegativeColor,
          }}
        >
          ({sign}
          {formatLocaleNumber(bonus, language)})
        </span>
      </span>
    );
  };

  return (
    <div style={rootStyle} aria-label="캐릭터 임베딩 정보">
      <div
        style={{
          ...cornerCoverStyle,
          top: cornerOffset,
          left: cornerOffset,
          backgroundColor: cornerTopColor,
        }}
      />
      <div
        style={{
          ...cornerCoverStyle,
          top: cornerOffset,
          right: cornerOffset,
          backgroundColor: cornerTopColor,
        }}
      />
      <div
        style={{
          ...cornerCoverStyle,
          bottom: cornerOffset,
          left: cornerOffset,
          backgroundColor: cornerBottomColor,
        }}
      />
      <div
        style={{
          ...cornerCoverStyle,
          bottom: cornerOffset,
          right: cornerOffset,
          backgroundColor: cornerBottomColor,
        }}
      />
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
            labelWidth={statLabelWidth}
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
            labelWidth={statLabelWidth}
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
            labelWidth={statLabelWidth}
          />
          <StatRow
            label={strings.ap}
            value={formatLocaleNumber(ap, language)}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
            labelWidth={statLabelWidth}
          />
          <StatRow
            label={strings.gold}
            value={formatLocaleNumber(gold, language)}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
            iconSrc={COIN_ICON_DATA_URL}
            labelWidth={statLabelWidth}
          />
          <StatRow
            label="ATK"
            value={buildValueWithBonus(stats.total.atk, stats.equipmentBonus.atk)}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
            labelWidth={statLabelWidth}
          />
          <StatRow
            label="DEF"
            value={buildValueWithBonus(stats.total.def, stats.equipmentBonus.def)}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
            labelWidth={statLabelWidth}
          />
          <StatRow
            label="LUCK"
            value={buildValueWithBonus(
              stats.total.luck,
              stats.equipmentBonus.luck
            )}
            labelStyle={labelStyle}
            valueStyle={valueStyle}
            labelWidth={statLabelWidth}
          />
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
  value: ReactNode;
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
  iconSrc?: string;
  labelWidth: number;
}

function StatRow({
  label,
  value,
  labelStyle,
  valueStyle,
  iconSrc,
  labelWidth,
}: StatRowProps) {
  const valueNode =
    typeof value === "string" ? <span style={valueStyle}>{value}</span> : value;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          width: labelWidth,
        }}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            width={12}
            height={12}
            style={{
              width: 12,
              height: 12,
              objectFit: "contain",
              imageRendering: "pixelated",
            }}
          />
        ) : null}
        <span style={labelStyle}>{label}</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
        }}
      >
        {valueNode}
      </div>
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
  labelWidth: number;
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
  labelWidth,
}: StatBarProps) {
  const percent = calculatePercent(current, total);
  const valueText = `${formatLocaleNumber(current, language)} / ${formatLocaleNumber(
    total,
    language
  )}`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: labelWidth,
        }}
      >
        <span style={labelStyle}>{label}</span>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          height: 14,
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
        <span
          style={{
            position: "relative",
            zIndex: 1,
            fontSize: 9,
            color: valueStyle.color,
            textShadow: valueStyle.textShadow as string | undefined,
          }}
        >
          {valueText}
        </span>
      </div>
    </div>
  );
}

function calculatePercent(value: number, total: number) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

function resolveCornerColors(background: string) {
  if (!background.includes("gradient(")) {
    return null;
  }
  const colors = background.match(/#(?:[0-9a-fA-F]{3,8})/g);
  if (!colors || colors.length === 0) {
    return null;
  }
  return {
    top: colors[0],
    bottom: colors[colors.length - 1] ?? colors[0],
  };
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
  const rarityStyle = item ? RARITY_STYLES[item.rarity] : null;
  const slotBorderColor = palette.panelBorder;
  const iconBorderColor = rarityStyle?.border ?? palette.panelBorder;
  const iconBackgroundColor = rarityStyle?.background ?? palette.slotPlaceholder;

  return (
    <div
      style={{
        borderRadius: 10,
        border: `2px solid ${slotBorderColor}`,
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
          border: `2px solid ${iconBorderColor}`,
          backgroundColor: iconBackgroundColor,
          boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
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
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              imageRendering: "pixelated",
            }}
          />
        ) : null}
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
        {item?.name ? (
          <span
            style={{
              fontSize: 12,
              color: palette.textPrimary,
              textShadow: palette.textShadow,
            }}
          >
            {item.name}
          </span>
        ) : null}
      </div>
    </div>
  );
}
