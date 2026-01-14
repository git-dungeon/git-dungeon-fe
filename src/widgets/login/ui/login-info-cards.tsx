export interface LoginInfoCard {
  image: string;
  title: string;
  description: string;
}

interface LoginInfoCardsProps {
  cards: LoginInfoCard[];
}

export function LoginInfoCards({ cards }: LoginInfoCardsProps) {
  return (
    <div className="grid w-full gap-4 text-left md:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="pixel-panel p-5">
          <div className="flex items-start gap-4">
            <img
              src={card.image}
              alt=""
              aria-hidden="true"
              className="h-14 w-14 shrink-0"
            />
            <div>
              <h3 className="pixel-panel__title text-sm">{card.title}</h3>
              <p className="pixel-text-muted pixel-text-sm mt-2">
                {card.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
