/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAccountStatus } from "../actions/stripe";
import { updateUserInLocalStorage } from "../actions/auth";

const StripeCallback = ({ history }) => {
  const { auth } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth && auth.token) {
      accountStatus();
    }
    // eslint-disable-next-line no-use-before-define
  }, [auth]);

  const accountStatus = async () => {
    const { data } = await getAccountStatus(auth.token);
    updateUserInLocalStorage(data, () => {
      dispatch({
        type: "LOGGED_IN_USER",
        payload: data,
      });
      window.location.href = "/dashboard/seller";
    });
  };

  return (
    <div className="d-flex justify-content-center p-5">
      <LoadingOutlined className="display-1 p-5 text-danger" />
    </div>
  );
};

export default StripeCallback;
