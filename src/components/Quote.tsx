import { useEffect, useState } from "react";
import { Repeat, Copy } from "lucide-react";

export interface House {
  name: string;
  slug: string;
}

export interface Character {
  name: string;
  slug: string;
  house: House | null;
}

export interface QuoteData {
  sentence: string;
  character: Character;
}

const svgImports = import.meta.glob("../assets/houses/*.svg", {
  query: "?raw",
  import: "default",
});

function HouseLogo({ slug, name }: { slug?: string; name?: string }) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;
    const loadSvg = async () => {
      const path = `../assets/houses/${slug || "default"}.svg`;
      const defaultPath = "../assets/houses/default.svg";

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

interface QuoteProps {
  quote: QuoteData;
  error: string | null;
  loading: boolean;
  onRefresh: () => void;
}

export function Quote({ quote, error, loading, onRefresh }: QuoteProps) {
  const houseSlug = quote.character.house?.slug;
  const houseName = quote.character.house?.name;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `«${quote.sentence}» — ${quote.character.name}`
    );
  };

  return (
    <main className="advice-card">
      {loading ? (
        <p className="advice-quote">Loading...</p>
      ) : error ? (
        <p className="advice-quote">{error}</p>
      ) : (
        <>
          <div className="house-logo-container">
            <HouseLogo slug={houseSlug} name={houseName} />
          </div>
          <p className="advice-quote" id="advice-quote">
            «{quote.sentence}»
          </p>

          <h4 className="advice-id">{quote.character.name}</h4>
          {houseName && <p className="house-name">{houseName}</p>}
        </>
      )}
      <div className="button-container">
        <button
          className="quote-button"
          id="generate-advice-btn"
          onClick={onRefresh}
          disabled={loading}
        >
          <Repeat />
        </button>
        {!error && !loading && (
          <button
            className="copy-button"
            id="copy-advice-btn"
            onClick={handleCopy}
          >
            <Copy />
          </button>
        )}
      </div>
    </main>
  );
}
