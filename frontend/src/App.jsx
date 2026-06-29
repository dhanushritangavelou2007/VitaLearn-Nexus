import Button from "./components/ui/Button/Button";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
      <h1 className="text-4xl font-bold text-blue-600">
        VitaLearn Nexus
      </h1>

      <Button text="Login" />

      <Button text="Register" />

      <Button text="Save Changes" />
    </div>
  );
}

export default App;