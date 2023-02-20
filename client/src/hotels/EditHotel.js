/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { read, updateHotel } from "../actions/hotel";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HotelEditForm from "../components/Forms/HotelEditForm";

const EditHotel = ({ match, history }) => {
  const [values, setValues] = useState({
    title: "",
    content: "",
    location: "",
    price: "",
    from: "",
    to: "",
    bed: "",
  });
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  );
  const { title, content, location, price, from, to, bed } = values;
  const { auth } = useSelector((state) => ({ ...state }));
  const { token } = auth;

  useEffect(() => {
    loadSellerHotel();
  }, []);

  const loadSellerHotel = async () => {
    const { data } = await read(match.params.hotelId);
    setValues({ ...values, ...data });
    setPreview(`${process.env.REACT_APP_API}/hotel/image/${data._id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sending Form Data
    let hotelData = new FormData();
    hotelData.append("title", title);
    hotelData.append("content", content);
    hotelData.append("location", location);
    hotelData.append("price", price);
    image && hotelData.append("image", image);
    hotelData.append("from", from);
    hotelData.append("to", to);
    hotelData.append("bed", bed);

    try {
      const { data } = await updateHotel(
        token,
        hotelData,
        match.params.hotelId
      );
      toast(`${data.title} is updated `);
      history.push("/dashboard/seller");
    } catch (err) {
      console.log(err, "ERR of Server");
    }
  };

  const handleImageChange = (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="container-fluid p-5 bg-secondary text-center h1">
        Edit Hotel
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <HotelEditForm
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              handleSubmit={handleSubmit}
              values={values}
              setValues={setValues}
            />
          </div>
          <div className="col-md-2">
            <img src={preview} alt="IMG" className="img img-fluid m-2" />
            <pre>{JSON.stringify(values, null, 4)}</pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditHotel;
