import {useState, useEffect} from "react";
import { steinStore } from "../api/api-method";

function App() {
  const [comodities, setComodities] = useState(null);

  useEffect(() => {
    steinStore.read("list")
      .then(res => {
        const data = res.filter(item => item.uuid);
        setComodities(data);
      });
  }, []);

  return (
    <div className="App">
      {comodities && comodities.length && comodities.map(comodity => (
        <div key={comodity.uuid}>
          { comodity.komoditas }
        </div>
      ))}
    </div>
  );
}

export default App;
