import React, { useState } from "react";
import { createHotel } from "../actions/hotel";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HotelCreateForm from "../components/Forms/HotelCreateForm";

const NewHotel = () => {
  const [values, setValues] = useState({
    title: "",
    content: "",
    location: "",
    image: "",
    price: "",
    from: "",
    to: "",
    bed: "",
  });
  const [preview, setPreview] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  );

  const { auth } = useSelector((state) => ({ ...state }));

  const { token } = auth;

  const { title, content, image, location, price, from, to, bed } = values;

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
      const { data } = await createHotel(token, hotelData);
      toast(`${data.title} is posted `);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err.response.data);
      toast.error(err.response.data);
    }
  };

  const handleImageChange = (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]));
    setValues({ ...values, image: e.target.files[0] });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="container-fluid bg-secondary p-5 text-center ">
        <h2 className="white">Add Hotels</h2>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-10">
            <br />
            <HotelCreateForm
              values={values}
              handleChange={handleChange}
              handleImageChange={handleImageChange}
              handleSubmit={handleSubmit}
              setValues={setValues}
            />
          </div>
          <div className="col-md-2">
            <img
              src={preview}
              alt="preview_image"
              className="img img-fluid m-2"
            />
            <pre>{JSON.stringify(values, null, 4)}</pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewHotel;
