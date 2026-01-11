import { useEffect, useState } from "react";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/800.css";
import "./index.css";
import { Quote, QuoteData } from "@components/Quote";

function App() {
  const got_api = "https://api.gameofthronesquotes.xyz/v1/random";

  const [quote, setQuote] = useState<QuoteData>({
    sentence: "",
    character: {
      name: "",
      slug: "",
      house: null,
    },
  });
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches a random quote.
   *
   * When running as a Chrome extension, this function delegates the fetch request
   * to the background service worker using `chrome.runtime.sendMessage`.
   *
   * In a local development environment where the Chrome Extension API is not available,
   * it falls back to a direct `fetch` call to the API.
   */
  const fetchQuote = () => {
    setError(null);
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      chrome.runtime.sendMessage(
        { action: "fetchQuote", url: got_api },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            setError("Error connecting to background script.");
            return;
          }
          if (response && response.success) {
            setQuote(response.data);
          } else {
            setError(
              response?.error || "An error occurred while fetching the quote."
            );
          }
        }
      );
    } else {
      fetch(got_api)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch");
          return response.json();
        })
        .then((data) => setQuote(data))
        .catch(() => setError("An error occurred while fetching the quote."));
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    if (error) {
      document.body.className = "";
      return;
    }
    if (quote.character.house?.slug) {
      document.body.className = quote.character.house.slug.toLowerCase();
    } else {
      document.body.className = "";
    }
  }, [quote, error]);

  return <Quote quote={quote} error={error} onRefresh={fetchQuote} />;
}

export default App;
