import React, { useEffect, useState } from "react";
import { diffDays, read, isAlreadyBooked } from "../actions/hotel";
import { getSessionId } from "../actions/stripe";
import moment from "moment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

const ViewHotel = ({ match, history }) => {
  const [hotel, setHotel] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setloading] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  const { auth } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadHotel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isAlreadyBooked(auth.token, match.params.hotelId)
      .then((data) => setAlreadyBooked(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHotel = async () => {
    const { data } = await read(match.params.hotelId);
    setHotel(data);
    setImage(`${process.env.REACT_APP_API}/hotel/image/${data._id}`);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!auth || !auth.token) {
        history.push("/login");
      }
      setloading(true);
      let { data } = await getSessionId(auth.token, match.params.hotelId);
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container-fluid p-5 bg-secondary text-center ">
        <h1 className="white">{hotel.title}</h1>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <br />
            <img src={image} alt={hotel.title} className="img img-fluid m-2" />
          </div>
          <div className="col-md-6">
            <br />
            <b>{hotel.content}</b>
            <p className="alert alert-info mt-3">{hotel.price}</p>
            <p className="cart-text">
              <span className="float-right text-primary">
                for {diffDays(hotel.from, hotel.to)}
                {"  "}
                {diffDays(hotel.from, hotel.to) <= 1 ? "Day" : "Days"}
              </span>
            </p>
            <p>
              From <br />{" "}
              {moment(new Date(hotel.from)).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <p>
              to <br />{" "}
              {moment(new Date(hotel.to)).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <i>Posted by {hotel.postedBy && hotel.postedBy.name}</i>
            <br />
            {alreadyBooked ? (
              <button className="btn btn-primary" disabled={true}>
                Hotel is Already Booked By You Sir
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-block btn-lg btn-primary mt-3"
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : auth && auth.token
                  ? "Book Now"
                  : "Login to Book"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewHotel;
