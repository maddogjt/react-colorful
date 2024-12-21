import { h, JSX } from "preact";
import { useState, useEffect, useCallback } from "preact/hooks";

import { useEventCallback } from "../hooks/useEventCallback";
import { validHex } from "../utils/validate";

// Escapes all non-hexadecimal characters including "#"
const escape = (hex: string) => hex.replace(/([^0-9A-F]+)/gi, "").substr(0, 6);

interface ComponentProps {
  color: string;
  onChange: (newColor: string) => void;
}

type InputProps = Omit<JSX.HTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export const HexColorInput = (props: Partial<InputProps & ComponentProps>): JSX.Element => {
  const { color = "", onChange, onBlur, ...rest } = props;
  const [value, setValue] = useState(() => escape(color));
  const onChangeCallback = useEventCallback<string>(onChange);
  const onBlurCallback = useEventCallback<JSX.TargetedFocusEvent<HTMLInputElement>>(onBlur);

  // Trigger `onChange` handler only if the input value is a valid HEX-color
  const handleChange = useCallback(
    (e: JSX.TargetedEvent<HTMLInputElement>) => {
      const inputValue = escape(e.currentTarget.value);
      setValue(inputValue);
      if (validHex(inputValue)) onChangeCallback("#" + inputValue);
    },
    [onChangeCallback]
  );

  // Take the color from props if the last typed color (in local state) is not valid
  const handleBlur = useCallback(
    (e: JSX.TargetedFocusEvent<HTMLInputElement>) => {
      if (!validHex(e.currentTarget.value)) setValue(escape(color));
      onBlurCallback(e);
    },
    [color, onBlurCallback]
  );

  // Update the local state when `color` property value is changed
  useEffect(() => {
    setValue(escape(color));
  }, [color]);

  return (
    <input
      {...rest}
      value={value}
      spellCheck={false} // the element should not be checked for spelling errors
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
