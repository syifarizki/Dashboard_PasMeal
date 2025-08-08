import React, { useState } from "react";
import InputText from "../../components/Input/InputText";
import InputPhone from "../../components/Input/InputPhone";
import InputEmail from "../../components/Input/InputEmail";
import PrimaryButton from "../../components/Button/PrimaryButton";

const Profile = () => {
  const [name, setName] = useState("");
  const [noPhone, setNoPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleCancel = () => {
    setName("");
    setNoPhone("");
    setEmail("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data disimpan:", { name, noPhone, email });
  };
  
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-lg shadow-md border border-gray-300"
      >
        <h5 className="text-xl font-bold mb-6 -mt-3">Edit Profil Disini</h5>
        <hr className="border-t border-black -mt-4 mb-5" />
        <div>
          <InputText
            label="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama"
            // errorMessage={errors.name}
          />
          <InputPhone
            label="Nomor WhatsApp"
            value={noPhone}
            onChange={setNoPhone}
            placeholder="Nomor WhatsApp"
            // errorMessage={errors.noPhone}
          />

          <InputEmail
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            // errorMessage={errors.email}
          />
        </div>
        <div className="flex  justify-end mt-6 gap-2">
          <PrimaryButton
            type="button"
            text="Batal"
            onClick={handleCancel}
            className="px-4 py-2 "
          />
          <PrimaryButton type="submit" text="Simpan" className="px-4 py-2 " />
        </div>
      </form>
    </>
  );
}

export default Profile;