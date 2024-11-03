"use client";
import { useCallback, useEffect, useState } from "react";
import { calculateNewValue, setInitialValue, updateStorage } from "./utils";

/**
 * Hook to manage state synchronized with localStorage across multiple tabs.
 *
 * @template T - The type of the value to be stored.
 * @param {string} key - The key under which the value is stored in localStorage.
 * @param {T} [defaultValue] - The default value to use if no value is found in localStorage.
 * @param {(value: T) => string} [serialize] - Optional custom serialization function.
 * @param {(value: string) => T} [deserialize] - Optional custom deserialization function.
 * @returns {[T | null, (value: T | null | ((prev: T | null) => T | null)) => void, boolean]} A stateful value, a function to update it, and a loading state.
 *
 * @example
 * const [value, setValue, loadingValue] = useLocalState<string>("myKey", "default");
 *
 * setValue("newValue");
 */
export function useLocalState<T>(
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

  useEffect(() => {
    // Attempt to set the initial state from localStorage using the provided key.
    // If an existing value is found, it will be deserialized and set as the initial state.
    const isValueSet = setInitialValue(
      localStorage,
      key,
      defaultValue,
      setvalue,
      deserialize,
      serialize
    );
    setLoading(!isValueSet);

    const handleStorageChange = (event: StorageEvent) => {
      // Event handler that is triggered when changes are made to localStorage in other tabs.
      // It updates the value state based on the new value from the event.
      if (event.key === key) {
        try {
          setvalue(event.newValue ? deserialize(event.newValue) : null);
        } catch (error) {
          console.warn(
            `Aborting automatic state update for "${key}": unable to serialise new value`,
            error
          );
        }
      }
    };

    // Listen for changes in other tabs
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, defaultValue, deserialize, serialize]);

  const updateValue = useCallback(
    (newValue: T | ((prev: T | null) => T | null) | null) => {
      // Function to update the local state and localStorage.
      // Accepts a new value or a function that computes the new value based on the previous state.
      const calculatedValue = calculateNewValue(newValue, value);
      updateStorage(localStorage, calculatedValue, key, setvalue, serialize);
    },
    [key, value, serialize]
  );

  return [value, updateValue, loading];
}
