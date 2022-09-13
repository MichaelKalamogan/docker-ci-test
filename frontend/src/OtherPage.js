import React from "react";

import { Link } from "react-router-dom";

export default function otherpage() {
  return (
    <div>
      I am another page
      <Link to="/"> Go back home</Link>
    </div>
  );
}
