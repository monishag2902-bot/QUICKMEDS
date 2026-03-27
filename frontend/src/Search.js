import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [name, setName] = useState("");
  const [result, setResult] = useState("");

  const search = async () => {
    const res = await axios.get(`http://localhost:5000/search/${name}`);
    setResult(res.data);
  };

  return (
    <div>
      <h2>Search Medicine</h2>
      <input onChange={(e) => setName(e.target.value)} />
      <button onClick={search}>Search</button>
      <h3>{result}</h3>
    </div>
  );
}

export default Search;
