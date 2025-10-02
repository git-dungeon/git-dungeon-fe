interface EmbedErrorCardProps {
  message: string;
}

export function EmbedErrorCard({ message }: EmbedErrorCardProps) {
  return (
    <section className="bg-card text-card-foreground max-w-lg rounded-xl border px-6 py-8 text-center shadow-sm">
      <h1 className="text-foreground text-lg font-semibold">
        잘못된 요청입니다
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">{message}</p>
    </section>
  );
}
