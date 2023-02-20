/** @format */

import React, { useEffect, useState } from "react";
import { allHotels } from "../actions/hotel";
import SmallCard from "../components/cards/SmallCard";

const Home = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    loadAllHotels();
  }, []);

  const loadAllHotels = async () => {
    const { data } = await allHotels();
    setHotels(data);
  };

  return (
    <>
      <div className="container-fluid h1 p-5 bg-secondary text-center">
        Home Page
      </div>
      <br />
      <div className="container-fluid">
        {hotels.map((h) => (
          <SmallCard key={h._id} h={h} />
        ))}
      </div>
    </>
  );
};

export default Home;
