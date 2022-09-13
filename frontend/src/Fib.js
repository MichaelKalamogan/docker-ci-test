import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Fib() {
  const [values, setValues] = useState({});
  const [seenIdx, setSeenIdx] = useState([]);
  const [idx, setIdx] = useState("");

  const fetchValues = async () => {
    try {
      const response = await axios.get("/api/values/current");
      setValues(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIndexes = async () => {
    try {
      const response = await axios.get("/api/values/all");
      setSeenIdx(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIndexes();
    fetchValues();
  }, []);

  const renderSeenIndexes = () => {
    return seenIdx.map(({ idx }) => idx).join(",");
  };

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("api/values", {
        index: idx,
      });
    } catch (error) {
      console.log(error);
    }
    setIdx("");
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter Index</label>
        <input value={idx} onChange={(e) => setIdx(e.target.value)} />
        <button>Submit</button>
      </form>

      <h3>Indexes already calculated</h3>
      <renderSeenIndexes />
      <h3>Calculated Values</h3>
      <renderValues />
    </div>
  );
}
