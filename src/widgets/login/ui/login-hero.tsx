interface LoginHeroProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
}

export function LoginHero({ imageSrc, imageAlt, title }: LoginHeroProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="login-hero w-full max-w-2xl object-cover"
      />
      <h1 className="text-foreground -mt-6 text-4xl font-semibold sm:-mt-8 sm:text-5xl">
        <span className="font-pixel-title">{title}</span>
      </h1>
    </div>
  );
}
