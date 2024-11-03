"use client";
import { useCallback, useEffect, useState } from "react";
import { updateStorage, calculateNewValue, setInitialValue } from "./utils";
/**
 * Hook to manage state synchronized with session storage.
 *
 * @template T - The type of the value to be stored.
 * @param {string} key - The key under which the value is stored in session storage.
 * @param {T} [defaultValue] - The default value to use if no value is found in session storage.
 * @param {(value: T) => string} [serialize] - Optional custom serialization function.
 * @param {(value: string) => T} [deserialize] - Optional custom deserialization function.
 * @returns {[T | null, Dispatch<SetStateAction<T | null>>,boolean]} A stateful value, a function to update it and a loading state.
 *
 * @example
 * const [value, setValue, loadingValue] = useSessionState<string>("myKey", "default");
 *
 * setValue("newValue");
 */
export function useSessionState<T>(
  key: string,
  defaultValue?: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (value: string) => T = JSON.parse
): [
  T | null,
  (value: T | null | ((prev: T | null) => T | null)) => void,
  boolean
] {
  const [value, setvalue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  // Attempt to set the initial state from sessionStorage using the provided key.
  // If an existing value is found, it will be deserialized and set as the initial state.
  useEffect(() => {
    const isValueSet = setInitialValue(
      sessionStorage,
      key,
      defaultValue,
      setvalue,
      deserialize,
      serialize
    );
    setLoading(!isValueSet);
  }, [key, defaultValue, deserialize, serialize]);

  const updateValue = useCallback(
    (newValue: T | ((prev: T | null) => T | null) | null) => {
      // Function to update the local state and sessionStorage.
      // Accepts a new value or a function that computes the new value based on the previous state.
      const calculatedValue = calculateNewValue(newValue, value);
      updateStorage(sessionStorage, calculatedValue, key, setvalue, serialize);
    },
    [key, value, serialize]
  );

  return [value, updateValue, loading];
}
