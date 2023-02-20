import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar, Badge } from "antd";
import moment from "moment";
import {
  getAccountBalance,
  currencyFromtter,
  payoutSetting,
} from "../actions/stripe";
import { LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Meta } = Card;
const { Ribbon } = Badge;

const ConnectNav = () => {
  const [loading, setLoding] = useState(false);
  const [balance, setBalance] = useState(0);
  const { auth } = useSelector((state) => ({ ...state }));
  const { user, token } = auth;

  useEffect(() => {
    getAccountBalance(auth.token)
      .then(({ data }) => {
        setBalance(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [auth.token]);

  const handlePayoutsSettings = async () => {
    setLoding(true);

    try {
      const { data } = await payoutSetting(token);
      window.location.href = data.url;
      setLoding(false);
    } catch (err) {
      console.log(err);
      toast.error("Payloading Failed Try Again");
      setLoding(false);
    }
  };

  return (
    <div className="d-flex justify-content-around">
      <Card>
        <Meta
          avatar={<Avatar>{user.name[0]}</Avatar>}
          title={user.name}
          description={`Joined ${moment(user.createdAt).fromNow()}`}
        />
      </Card>
      {auth &&
        auth.user &&
        auth.user.stripe_seller &&
        auth.user.stripe_seller.charges_enabled && (
          <>
            <Ribbon text="Avaliable" color="geekblue">
              <Card className="bg-light pt-1 ">
                {balance &&
                  balance.pending &&
                  balance.pending.map((ba, i) => (
                    <span key={i}>{currencyFromtter(ba)}</span>
                  ))}
              </Card>
            </Ribbon>
            <Ribbon text="Payouts" color="gold">
              <Card
                onClick={handlePayoutsSettings}
                className="bg-light pointer"
              >
                {loading ? (
                  <LoadingOutlined spin />
                ) : (
                  <SettingOutlined className="h5 pt-2" />
                )}
              </Card>
            </Ribbon>
          </>
        )}
    </div>
  );
};

export default ConnectNav;
