import React from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";

const HotelCreateForm = ({
  handleChange,
  handleImageChange,
  handleSubmit,
  values,
  setValues,
}) => {
  const { title, content, location, price } = values;

  const { Option } = Select;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="btn btn-outline-secondary btn-block m-2 text-left">
          Image
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            hidden
          />
        </label>
        <input
          type="text"
          onChange={handleChange}
          name="title"
          value={title}
          className="form-control mb-2"
          placeholder="Title"
        />
        <textarea
          type="text"
          onChange={handleChange}
          name="content"
          value={content}
          className="form-control mb-2"
          placeholder="Content"
        />
        <input
          type="text"
          onChange={handleChange}
          name="location"
          value={location}
          className="form-control mb-2"
          placeholder="Location"
        />
        <input
          type="number"
          onChange={handleChange}
          name="price"
          value={price}
          className="form-control mb-2"
          placeholder="Price"
        />

        <Select
          onChange={(value) => setValues({ ...values, bed: value })}
          className="w-100 mb-2"
          size="large"
          placeholder="Number of beds"
        >
          <Option key={1} value={1}>
            1
          </Option>
          <Option key={2} value={2}>
            2
          </Option>
          <Option key={3} value={3}>
            3
          </Option>
          <Option key={4} value={4}>
            4
          </Option>
        </Select>
      </div>
      <DatePicker
        placeholder="From Date"
        className="form-control mb-2"
        onChange={(date, dateString) =>
          setValues({ ...values, from: dateString })
        }
        disabledDate={(current) =>
          current && current.valueOf() < moment().subtract(1, "days")
        }
      />
      <DatePicker
        placeholder="To Date"
        className="form-control mb-2"
        onChange={(date, dateString) =>
          setValues({ ...values, to: dateString })
        }
        disabledDate={(current) =>
          current && current.valueOf() < moment().subtract(1, "days")
        }
      />
      <button className="btn btn-outline-primary m-2">Save</button>
    </form>
  );
};

export default HotelCreateForm;
