import { render } from "preact";
import { App } from "./app.tsx";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

render(<App />, document.getElementById("app")!);
