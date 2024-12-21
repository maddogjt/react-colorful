import { useEffect } from "preact/hooks";

export const useBodyBackground = (color: string): void => {
  useEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);
};
