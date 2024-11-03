import { Dispatch, SetStateAction } from "react";

export function calculateNewValue<T>(
  value: T | ((prev: T | null) => T | null) | null,
  storedValue: T | null
): T | null {
  let newValue: T | null | ((prev: T | null) => T | null);
  if (typeof value === "function") {
    const callback = value as (prev: T | null) => T | null;
    newValue = callback(storedValue);
  } else if (!value) newValue = null;
  else newValue = value;
  return newValue as T;
}

export function updateStorage<T>(
  storage: Storage,
  newValue: T | ((prev: T | null) => T | null) | null,
  key: string,
  setStoredValue: Dispatch<SetStateAction<T | null>>,
  serialize: (value: T) => string
) {
  if (newValue === null || newValue == undefined || newValue === "") {
    storage.removeItem(key);
    setStoredValue(null);
  } else {
    try {
      storage.setItem(key, serialize(newValue as T));
      setStoredValue(newValue);
    } catch (error) {
      console.warn(
        `Aborting state update for "${key}": unable to serialise new value:`,
        error
      );
    }
  }
}

export function setInitialValue<T>(
  storage: Storage,
  key: string,
  defaultValue: T | undefined,
  setStoredValue: Dispatch<SetStateAction<T | null>>,
  deserialize: (value: string) => T,
  serialize: (value: T) => string
): boolean {
  const item = storage.getItem(key);
  if (item) {
    try {
      setStoredValue(deserialize(item));
      return true;
    } catch (error) {
      console.warn(`Error parsing sessionStorage key "${key}":`, error);
      storage.removeItem(key); // Clean up invalid data
    }
  }

  if (defaultValue !== undefined) {
    try {
      storage.setItem(key, serialize(defaultValue));
      setStoredValue(defaultValue);
      return true;
    } catch (error) {
      console.warn("Default value cannot be serialized. Setting to null.");
    }
  }
  setStoredValue(null);
  return true;
}
