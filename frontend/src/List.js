import React, { useEffect, useState } from "react";
import axios from "axios";

function List() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/medicines")
      .then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2>All Medicines</h2>
      {data.map((m, i) => (
        <p key={i}>
          {m.name} - ₹{m.price}
        </p>
      ))}
    </div>
  );
}

export default List;
