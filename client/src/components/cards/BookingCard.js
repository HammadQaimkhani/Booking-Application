/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import { currencyFromtter } from "../../actions/stripe";
import { diffDays } from "../../actions/hotel";

import OrderModal from "../modals/OrderModal";

const BookingCard = ({ hotel, session, orderedBy }) => {
  const [showModel, setShowModel] = useState(false);

  return (
    <div className="card mb-3">
      <div className="row no-gutters">
        <div className="col-md-4">
          {hotel.image && hotel.image.contentType ? (
            <img
              src={`${process.env.REACT_APP_API}/hotel/image/${hotel._id}`}
              alt="defaultimage"
              className="card-image img img-fluid"
            />
          ) : (
            <img
              src={"http://via.placeholder.com/900x500.png?text=Booking"}
              alt="default image"
              className="card-image img img-fluid"
            />
          )}
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h3 className="card-title">
              {hotel.title}{" "}
              <span className="text-primary">
                {currencyFromtter({
                  amount: hotel.price * 100,
                  currency: "usd",
                })}
              </span>
            </h3>
            <p className="alert alert-info">{hotel.location}</p>
            <p className="card-text">{`${hotel.content.substring(
              0,
              200
            )}...`}</p>
            <p className="card-text text-primary">
              for {diffDays(hotel.from, hotel.to)}{" "}
              {diffDays(hotel.from, hotel.to) <= 1 ? "Day" : "Days"}
            </p>
            <p className="card-text">{hotel.bed} bed</p>
            <p className="card-text">
              Available from {new Date(hotel.from).toLocaleDateString()}
            </p>
            {showModel && (
              <OrderModal
                session={session}
                orderedBy={orderedBy}
                showModel={showModel}
                setShowModel={setShowModel}
              />
            )}
          </div>
          <div className="d-flex justify-content-between h4">
            <button
              onClick={() => setShowModel(!showModel)}
              className="btn btn-primary"
            >
              Show Payment Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
