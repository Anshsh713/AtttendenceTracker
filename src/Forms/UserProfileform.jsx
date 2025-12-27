import React, { useEffect, useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import { useUser } from "../Context/UserContext";
import authInformation from "../Appwrite/AuthInformation";
import "./UserProfileform.css";

export default function UserProfileform({ onprofileupdate }) {
  const { user, profile } = useUser();

  const [form, setForm] = useState({
    name: "",
    attendence: 75,
    country: "",
    state: "",
    city: "",
    college: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        attendence: profile.attendence ?? 75,
        country: profile.country ?? "",
        state: profile.state ?? "",
        city: profile.city ?? "",
        college: profile.college ?? "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/positions"
        );
        const data = await res.json();
        setCountries(data.data || []);
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!form.country) return;

    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: form.country }),
          }
        );
        const data = await res.json();
        setStates(data.data?.states || []);
      } catch (err) {
        console.error("Failed to load states", err);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [form.country]);

  useEffect(() => {
    if (!form.country || !form.state) return;

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              country: form.country,
              state: form.state,
            }),
          }
        );
        const data = await res.json();
        setCities(data.data || []);
      } catch (err) {
        console.error("Failed to load cities", err);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [form.country, form.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "attendence" ? Number(value) : value,
      ...(name === "country" && { state: "", city: "" }),
      ...(name === "state" && { city: "" }),
    }));
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

    if (onprofileupdate) onprofileupdate();
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
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

      <label>Country</label>
      <select
        name="country"
        value={form.country}
        onChange={handleChange}
        required
      >
        <option value="">Select Country</option>
        {countries.map((c, i) => (
          <option key={i} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <label>State</label>
      <select
        name="state"
        value={form.state}
        onChange={handleChange}
        disabled={!form.country}
        required
      >
        <option value="">
          {loadingStates ? "Loading..." : "Select State"}
        </option>
        {states.map((s, i) => (
          <option key={i} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <label>City</label>
      <select
        name="city"
        value={form.city}
        onChange={handleChange}
        disabled={!form.state}
        required
      >
        <option value="">{loadingCities ? "Loading..." : "Select City"}</option>
        {cities.map((city, i) => (
          <option key={i} value={city}>
            {city}
          </option>
        ))}
      </select>

      <Input
        label="College"
        type="text"
        name="college"
        value={form.college}
        onChange={handleChange}
      />

      <button type="submit">Save Profile</button>
    </form>
  );
}
