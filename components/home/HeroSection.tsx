import { ScrollHint } from "./ScrollHint";

export function HeroSection() {
  return (
    <section className="relative h-[100dvh] overflow-hidden">

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/75" />

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 flex items-end justify-between gap-8 px-8 sm:px-14 pb-10 sm:pb-14">

        {/* Left: copy */}
        <div>
          <h1
            className="font-heading font-bold text-white leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(1.75rem, 3.2vw, 3.25rem)", maxWidth: "22ch" }}
          >
            Percakapan Hangat<br />Bersama Karib Sahabat
          </h1>
          <p
            className="mt-3 font-body text-white/75 leading-relaxed"
            style={{ fontSize: "clamp(0.85rem, 1.1vw, 0.975rem)", maxWidth: "52ch" }}
          >
            Selayaknya karib yang senantiasa mengingatkan dengan hangat ketika kita butuh nasihat dan siap memberi jawaban ketika kita dalam kebingungan.
          </p>
        </div>

        {/* Right: scroll hint */}
        <div className="hidden sm:flex shrink-0 pb-1">
          <ScrollHint />
        </div>

      </div>
    </section>
  );
}
