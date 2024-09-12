import { createContext, useState } from "react";

export const Context = createContext();

const Provider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState("");

  const data = { open, setOpen, openModal, loading, setLoading, setOpenModal, modalData, setModalData };

  return <Context.Provider value={data}>{children}</Context.Provider>;
};

export default Provider;
