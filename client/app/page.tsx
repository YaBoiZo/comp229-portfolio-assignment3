import { portfolioOwner } from "@/lib/portfolio-data";

const focusAreas = ["Web development", "Accessible interfaces", "Reliable code"];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Hello, I&apos;m {portfolioOwner.preferredName}</p>
          <h1>
            Building useful digital experiences with <em>care and curiosity.</em>
          </h1>
          <p className="hero__lede">
            I&apos;m a Toronto-based web developer and software engineering student,
            exploring how thoughtful development and AI implementation can turn ideas into useful products.
          </p>
          <div className="button-row">
            <a className="button button--primary" href="/about">About me</a>
            <a className="button button--secondary" href="/projects">View projects</a>
          </div>
        </div>

        <aside className="hero-card" aria-label="Current focus">
          <span className="hero-card__number">01</span>
          <p className="hero-card__label">Current focus</p>
          <h2>Learning by building.</h2>
          <ul>
            {focusAreas.map((area) => <li key={area}>{area}</li>)}
          </ul>
          <div className="hero-card__orbit" aria-hidden="true"><span /></div>
        </aside>
      </section>

      <section className="mission" aria-labelledby="mission-title">
        <p className="eyebrow">My mission</p>
        <blockquote id="mission-title">“{portfolioOwner.mission}”</blockquote>
        <a href="/contact">Start a conversation</a>
      </section>
    </main>
  );
}
