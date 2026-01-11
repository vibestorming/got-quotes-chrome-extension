import { useEffect, useState } from "react";
import { Repeat } from "lucide-react";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/800.css";
import "./index.css";

interface House {
  name: string;
  slug: string;
}

interface Character {
  name: string;
  slug: string;
  house: House | null;
}

interface Quote {
  sentence: string;
  character: Character;
}

const svgImports = import.meta.glob("./assets/houses/*.svg", {
  query: "?raw",
  import: "default",
});

function HouseLogo({ slug, name }: { slug?: string; name?: string }) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;
    const loadSvg = async () => {
      const path = `./assets/houses/${slug || "default"}.svg`;
      const defaultPath = "./assets/houses/default.svg";

      const loader = svgImports[path] ?? svgImports[defaultPath];

      if (loader) {
        try {
          const svgContent = await loader();
          if (!isCancelled) {
            setSvg(svgContent as string);
          }
        } catch (e) {
          console.error("Error loading SVG:", e);
        }
      }
    };

    loadSvg();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  return (
    <div
      className="house-logo"
      dangerouslySetInnerHTML={{ __html: svg }}
      title={name || "Game of Thrones"}
    />
  );
}

function App() {
  const [quote, setQuote] = useState<Quote>({
    sentence:
      "The day will come when you think you are safe and happy, and your joy will turn to ashes in your mouth.",
    character: {
      name: "Tyrion Lannister",
      slug: "tyrion",
      house: {
        name: "House Lannister of Casterly Rock",
        slug: "lannister",
      },
    },
  });

  useEffect(() => {
    if (quote.character.house?.slug) {
      document.body.className = quote.character.house.slug.toLowerCase();
    } else {
      document.body.className = "";
    }
  }, [quote]);

  const houseSlug = quote.character.house?.slug;
  const houseName = quote.character.house?.name;

  return (
    <main className="advice-card">
      <div className="house-logo-container">
        <HouseLogo slug={houseSlug} name={houseName} />
      </div>
      <p className="advice-quote" id="advice-quote">
        «{quote.sentence}»
      </p>

      <h4 className="advice-id">{quote.character.name}</h4>
      {houseName && <p className="house-name">{houseName}</p>}
      <button className="quote-button" id="generate-advice-btn">
        <Repeat />
      </button>
    </main>
  );
}

export default App;
