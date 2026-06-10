import { useEffect, useState } from "react";

function useCustomMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);

      setMatches(media.matches);

      const listener = (e) => setMatches(e.matches);
      media.addEventListener('change', listener);

      return () => media.removeEventListener('change', listener);
    }
  }, [query]);
  

  return matches;
}

export default useCustomMediaQuery;