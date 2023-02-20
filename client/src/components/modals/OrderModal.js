import React from "react";
import { Modal } from "antd";

const OrderModal = ({ session, orderedBy, showModel, setShowModel }) => {
  return (
    <Modal
      visible={true}
      title="Order payment Info"
      onCancel={() => setShowModel(!showModel)}
    >
      <h4>
        <i class="bi bi-person"></i> Customer : {orderedBy.name}
      </h4>
      <p>
        <i class="bi bi-badge-cc"></i> Stripe Customer Id : {session.customer}
      </p>
      <p>
        <i class="bi bi-bank"></i> Payment Intent : {session.payment_intent}
      </p>
      <p>
        <i class="bi bi-credit-card-2-front-fill"></i> Payment Status :{" "}
        {session.payment_status.toUpperCase()} {session.amount_total / 100}.00
        PKR
      </p>
      <p>
        <i class="bi bi-currency-dollar"></i> Amount total :{" "}
        {session.currency.toUpperCase()}
      </p>
    </Modal>
  );
};

export default OrderModal;
