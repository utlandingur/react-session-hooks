# react-session-hooks

A lightweight React library providing custom hooks for managing state synchronized with `localStorage` and `sessionStorage` that works with Server Side Rendering frameworks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [useLocalState](#useLocalState)
  - [useSessionState](#useSessionState)
- [API](#api)
  - [useLocalState](#useLocalState-api)
  - [useSessionState](#useSessionState-api)
- [Example Scenarios](#example-scenarios)
  - [useLocalState Example](#useLocalState-example)
  - [useSessionState Example](#useSessionState-example)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the library, use npm or yarn:

```bash
npm install react-session-hooks
```

or

```bash
yarn add react-session-hooks
```

Ensure you also have React as a peer dependency:

```bash
npm install react
```

## Usage

### useLocalState

The `useLocalState` hook allows you to manage state that persists across page reloads using `localStorage`.

- It includes a listener to maintain synchronization.
- It will return `null` if there is any error in serializing or deserializing data.
- It will remove the item from storage if the value is set to `undefined`, `null`, or `""`.

```javascript
import { useLocalState } from "react-session-hooks";

const MyComponent = () => {
  const [value, setValue, loading] = useLocalState("myKey", "default");

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Current value: {value}</p>
      <button onClick={() => setValue("newValue")}>Update Value</button>
    </div>
  );
};
```

### useSessionState

The `useSessionState` hook allows you to manage state that persists only within the current browser session using `sessionStorage`.

- It includes a listener to maintain synchronization.
- It will return `null` if there is any error in serializing or deserializing data.
- It will remove the item from storage if the value is set to `undefined`, `null`, or `""`.

```javascript
import { useSessionState } from "react-session-hooks";

const MyComponent = () => {
  const [value, setValue, loading] = useSessionState("myKey", "default");

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Current value: {value}</p>
      <button onClick={() => setValue("newValue")}>Update Value</button>
    </div>
  );
};
```

## API

### useLocalState API

```javascript
const [storedValue, setStoredValue, loading] = useLocalState<T>(
  key: string,
  defaultValue?: T,
  serialize?: (value: T) => string,
  deserialize?: (value: string) => T
);
```

#### Parameters

- `key` (string): The key under which the value is stored in `localStorage`.
- `defaultValue` (T, optional): The default value to use if no value is found in `localStorage`.
- `serialize` ((value: T) => string, optional): Custom serialization function.
- `deserialize` ((value: string) => T, optional): Custom deserialization function.

#### Returns

- `storedValue`: The current value stored in `localStorage`.
- `setStoredValue`: A function to update the stored value.
- `loading`: A boolean indicating whether the hook is currently loading the initial value.

### useSessionState API

```javascript
const [storedValue, setStoredValue, loading] = useSessionState<T>(
  key: string,
  defaultValue?: T,
  serialize?: (value: T) => string,
  deserialize?: (value: string) => T
);
```

#### Parameters

- `key` (string): The key under which the value is stored in `sessionStorage`.
- `defaultValue` (T, optional): The default value to use if no value is found in `sessionStorage`.
- `serialize` ((value: T) => string, optional): Custom serialization function.
- `deserialize` ((value: string) => T, optional): Custom deserialization function.

#### Returns

- `storedValue`: The current value stored in `sessionStorage`.
- `setStoredValue`: A function to update the stored value.
- `loading`: A boolean indicating whether the hook is currently loading the initial value.

## Example Scenarios

### useLocalState example

Here’s a simple example of using useLocalState to manage a user’s preferred language setting:

```javascript
import { useLocalState } from "react-session-hooks;

const LanguageSelector = () => {
  const [language, setLanguage, loading] = useLocalState(
    "preferredLanguage",
    "English"
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Selected language: {language}</p>
      <button onClick={() => setLanguage("English")}>English</button>
      <button onClick={() => setLanguage("Spanish")}>Spanish</button>
    </div>
  );
};
```

### useSessionState Example

As shown previously, useSessionState can be used in a form to manage user input within a session:

```javascript
import { useSessionState } from "your-library-name";

const MyForm = () => {
  const [formValue, setFormValue, loading] = useSessionState("formData", "");

  if (loading) return <div>Loading...</div>;

  const handleChange = (event) => {
    setFormValue(event.target.value);
  };

  return (
    <form>
      <input type="text" value={formValue} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push to your branch and open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
