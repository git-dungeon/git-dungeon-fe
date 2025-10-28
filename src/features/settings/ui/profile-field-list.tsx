interface ProfileField {
  id: string;
  label: string;
  value: string;
  hint?: string;
  title?: string;
}

interface ProfileFieldListProps {
  fields: ProfileField[];
}

export function ProfileFieldList({ fields }: ProfileFieldListProps) {
  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.id} className="space-y-1">
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {field.label}
          </dt>
          <dd
            className="text-foreground text-sm font-semibold break-words"
            title={field.title ?? undefined}
          >
            {field.value}
          </dd>
          {field.hint ? (
            <p className="text-muted-foreground text-xs">{field.hint}</p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
