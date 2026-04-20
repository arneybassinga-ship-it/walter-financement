import { useEffect, useState } from "react";
import walterLogo from "@/assets/walter-logo.jpg";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-400 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={walterLogo}
        alt="Walter Entreprise"
        className="w-72 max-w-[80vw] object-contain animate-pulse"
      />
    </div>
  );
}
