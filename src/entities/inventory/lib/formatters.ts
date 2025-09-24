const obtainedAtFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatObtainedAt(value: string): string {
  return obtainedAtFormatter.format(new Date(value));
}
