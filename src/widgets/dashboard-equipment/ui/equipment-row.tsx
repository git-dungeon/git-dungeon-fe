import type { EquipmentItem } from "@/entities/dashboard/model/types";

interface EquipmentRowProps {
  label: string;
  item?: EquipmentItem;
  placeholder: string;
  formatItem: (item: EquipmentItem) => string;
  formatModifier: (modifier: EquipmentItem["modifiers"][number]) => string;
}

export function EquipmentRow({
  label,
  item,
  placeholder,
  formatItem,
  formatModifier,
}: EquipmentRowProps) {
  return (
    <div className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
      <dt className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-foreground text-sm font-medium">
        {item ? formatItem(item) : placeholder}
      </dd>
      {item && item.modifiers.length > 0 ? (
        <ul className="text-muted-foreground text-xs">
          {item.modifiers.map((modifier, index) => (
            <li key={`${item.id}-modifier-${index}`}>
              {formatModifier(modifier)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
