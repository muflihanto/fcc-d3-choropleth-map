import ChoroMap from "./ChoroMap";

export function App() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center font-sans p-8">
      <h1
        className="text-5xl font-bold"
        id="title"
      >
        United States Educational Attainment
      </h1>
      <h3
        className="text-lg font-semibold mt-4"
        id="description"
      >
        Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)
      </h3>
      <ChoroMap />
    </div>
  );
}
