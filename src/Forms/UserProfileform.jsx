import React, { useEffect, useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import { useUser } from "../Context/UserContext";
import authInformation from "../Appwrite/AuthInformation";

export default function UserProfileform() {
  const { user } = useUser();

  const [form, setForm] = useState({
    name: "",
    college: "",
    city: "",
    state: "",
    country: "",
    attendence: 75,
  });

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const profile = await authInformation.getProfile(user.$id);

      if (profile) {
        setForm({
          name: profile.USERNAME ?? "",
          college: profile.College_Name ?? "",
          city: profile.City ?? "",
          state: profile.State ?? "",
          country: profile.Country ?? "",
          attendence: profile.attendence ?? 75,
        });
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "attendence" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await authInformation.createUserandUpdateProfile(user.$id, {
      UserID: user.$id,
      USERNAME: form.name,
      College_Name: form.college,
      City: form.city,
      State: form.state,
      Country: form.country,
      attendence: form.attendence,
    });

    setForm({
      name: "",
      college: "",
      city: "",
      state: "",
      country: "",
      attendence: 75,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Profile</h2>

      <Input
        label="Name"
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Attendance"
        type="number"
        name="attendence"
        min="0"
        max="100"
        value={form.attendence}
        onChange={handleChange}
        required
      />

      <Input
        label="College"
        type="text"
        name="college"
        value={form.college}
        onChange={handleChange}
      />

      <Input
        label="City"
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
      />

      <Input
        label="State"
        type="text"
        name="state"
        value={form.state}
        onChange={handleChange}
      />

      <Input
        label="Country"
        type="text"
        name="country"
        value={form.country}
        onChange={handleChange}
      />

      <button type="submit">Save Profile</button>
    </form>
  );
}
