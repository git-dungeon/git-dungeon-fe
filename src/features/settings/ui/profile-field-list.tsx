interface ProfileFieldListProps {
  fields: Array<{ id: string; label: string; value: string }>;
}

export function ProfileFieldList({ fields }: ProfileFieldListProps) {
  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.id} className="space-y-1">
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {field.label}
          </dt>
          <dd className="text-foreground text-sm font-semibold break-words">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
