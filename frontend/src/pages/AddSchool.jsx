import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API_URL from "../config/api";

function AddSchool() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    institution_type: "school",
    ownership_type: "private",
    gender_type: "not_specified",

    principal_name: "",
    established_year: "",
    description: "",

    phone: "",
    email: "",
    website: "",

    address: "",
    area: "",
    city: "Loralai",
    district: "Loralai",
    province: "Balochistan",
    country: "Pakistan",

    latitude: "",
    longitude: "",

    student_count: 0,
    teacher_count: 0,
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError(
        "School name is required."
      );
      return;
    }

    if (!form.address.trim()) {
      setError(
        "School address is required."
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "authToken"
        );

      if (!token) {
        throw new Error(
          "Please login as administrator first."
        );
      }

      const response =
        await fetch(
          `${API_URL}/api/admin/institutions`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name:
                form.name.trim(),

              institution_type:
                form.institution_type,

              ownership_type:
                form.ownership_type,

              gender_type:
                form.gender_type,

              principal_name:
                form.principal_name.trim() ||
                null,

              established_year:
                form.established_year
                  ? Number(
                      form.established_year
                    )
                  : null,

              description:
                form.description.trim() ||
                null,

              phone:
                form.phone.trim() ||
                null,

              email:
                form.email.trim() ||
                null,

              website:
                form.website.trim() ||
                null,

              address:
                form.address.trim(),

              area:
                form.area.trim() ||
                null,

              city:
                form.city.trim() ||
                "Loralai",

              district:
                form.district.trim() ||
                "Loralai",

              province:
                form.province.trim() ||
                "Balochistan",

              country:
                form.country.trim() ||
                "Pakistan",

              latitude:
                form.latitude
                  ? Number(
                      form.latitude
                    )
                  : null,

              longitude:
                form.longitude
                  ? Number(
                      form.longitude
                    )
                  : null,

              student_count:
                Number(
                  form.student_count || 0
                ),

              teacher_count:
                Number(
                  form.teacher_count || 0
                ),
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to create school."
        );
      }

      setSuccess(
        "School saved successfully as a draft."
      );

      setTimeout(() => {
        navigate("/admin");
      }, 1200);

    } catch (err) {
      console.error(
        "Create school error:",
        err
      );

      setError(
        err.message ||
          "Failed to create school."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-school-page">
      <div className="container">

        <div className="add-school-header">

          <div>

            <span className="official-label">
              ADMINISTRATION
            </span>

            <h1>
              Add School
            </h1>

            <p>
              Enter the verified information you
              collected during your school visit.
            </p>

          </div>

          <Link
            to="/admin"
            className="secondary-btn"
          >
            ← Dashboard
          </Link>

        </div>

        <form
          className="add-school-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <section className="form-section">

            <div className="form-section-heading">

              <span>
                01
              </span>

              <div>

                <h2>
                  Basic Information
                </h2>

                <p>
                  Main information about the institution.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-field full-width">

                <label htmlFor="name">
                  School Name *
                </label>

                <input
                  id="name"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Loralai Public School"
                  required
                />

              </div>

              <div className="form-field">

                <label htmlFor="institution_type">
                  Institution Type
                </label>

                <select
                  id="institution_type"
                  name="institution_type"
                  value={
                    form.institution_type
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="school">
                    School
                  </option>

                  <option value="college">
                    College
                  </option>

                  <option value="university">
                    University
                  </option>

                  <option value="academy">
                    Academy
                  </option>

                </select>

              </div>

              <div className="form-field">

                <label htmlFor="ownership_type">
                  Ownership
                </label>

                <select
                  id="ownership_type"
                  name="ownership_type"
                  value={
                    form.ownership_type
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="private">
                    Private
                  </option>

                  <option value="government">
                    Government
                  </option>

                  <option value="semi_government">
                    Semi Government
                  </option>

                  <option value="other">
                    Other
                  </option>

                </select>

              </div>

              <div className="form-field">

                <label htmlFor="gender_type">
                  Gender Type
                </label>

                <select
                  id="gender_type"
                  name="gender_type"
                  value={
                    form.gender_type
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="not_specified">
                    Not Specified
                  </option>

                  <option value="boys">
                    Boys
                  </option>

                  <option value="girls">
                    Girls
                  </option>

                  <option value="co_education">
                    Co-Education
                  </option>

                </select>

              </div>

              <div className="form-field">

                <label htmlFor="principal_name">
                  Principal Name
                </label>

                <input
                  id="principal_name"
                  name="principal_name"
                  value={
                    form.principal_name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Principal name"
                />

              </div>

              <div className="form-field">

                <label htmlFor="established_year">
                  Established Year
                </label>

                <input
                  id="established_year"
                  name="established_year"
                  type="number"
                  min="1800"
                  max="2100"
                  value={
                    form.established_year
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="2010"
                />

              </div>

              <div className="form-field full-width">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Write a verified description..."
                />

              </div>

            </div>

          </section>

          {/* CONTACT */}

          <section className="form-section">

            <div className="form-section-heading">

              <span>
                02
              </span>

              <div>

                <h2>
                  Contact Information
                </h2>

                <p>
                  Official contact information.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-field">

                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="03001234567"
                />

              </div>

              <div className="form-field">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="school@example.com"
                />

              </div>

              <div className="form-field full-width">

                <label htmlFor="website">
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  value={
                    form.website
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://example.com"
                />

              </div>

            </div>

          </section>

          {/* LOCATION */}

          <section className="form-section">

            <div className="form-section-heading">

              <span>
                03
              </span>

              <div>

                <h2>
                  Location
                </h2>

                <p>
                  Enter the exact location collected
                  during your visit.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-field full-width">

                <label htmlFor="address">
                  Full Address *
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows="4"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Complete school address"
                  required
                />

              </div>

              <div className="form-field">

                <label htmlFor="area">
                  Area
                </label>

                <input
                  id="area"
                  name="area"
                  value={
                    form.area
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Main City"
                />

              </div>

              <div className="form-field">

                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="district">
                  District
                </label>

                <input
                  id="district"
                  name="district"
                  value={
                    form.district
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="province">
                  Province
                </label>

                <input
                  id="province"
                  name="province"
                  value={
                    form.province
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="country">
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  value={
                    form.country
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="latitude">
                  Latitude
                </label>

                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={
                    form.latitude
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="30.3700"
                />

              </div>

              <div className="form-field">

                <label htmlFor="longitude">
                  Longitude
                </label>

                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={
                    form.longitude
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="68.5970"
                />

              </div>

            </div>

          </section>

          {/* STATISTICS */}

          <section className="form-section">

            <div className="form-section-heading">

              <span>
                04
              </span>

              <div>

                <h2>
                  School Statistics
                </h2>

                <p>
                  Verified statistics collected from the school.
                </p>

              </div>

            </div>

            <div className="form-grid">

              <div className="form-field">

                <label htmlFor="student_count">
                  Total Students
                </label>

                <input
                  id="student_count"
                  name="student_count"
                  type="number"
                  min="0"
                  value={
                    form.student_count
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="form-field">

                <label htmlFor="teacher_count">
                  Total Teachers
                </label>

                <input
                  id="teacher_count"
                  name="teacher_count"
                  type="number"
                  min="0"
                  value={
                    form.teacher_count
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

          </section>

          {/* MESSAGES */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {success && (
            <div className="form-success">
              {success}
            </div>
          )}

          {/* ACTIONS */}

          <div className="form-actions">

            <Link
              to="/admin"
              className="secondary-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="dashboard-primary-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save School"}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}

export default AddSchool;