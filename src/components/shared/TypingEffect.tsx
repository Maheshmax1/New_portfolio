"use client";

import { useEffect, useState } from "react";

interface TypingEffectProps {
  wordsString: string;
  speed?: number;
  delay?: number;
}

export default function TypingEffect({
  wordsString,
  speed = 100,
  delay = 2000,
}: TypingEffectProps) {
  const words = wordsString.split(",").map((w) => w.trim());
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const word = words[currentWordIdx] || "";

    if (isDeleting) {
      // Deleting character
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, speed / 2);
    } else {
      // Adding character
      timer = setTimeout(() => {
        setCurrentText((prev) => word.slice(0, prev.length + 1));
      }, speed);
    }

    // Word completely typed
    if (!isDeleting && currentText === word) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    }

    // Word completely deleted, move to next
    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIdx((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, words, speed, delay]);

  return (
    <span className="border-r-2 border-current animate-pulse pr-1">
      {currentText}
    </span>
  );
}
