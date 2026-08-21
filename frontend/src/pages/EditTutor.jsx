import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


function EditTutor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    gender: "not_specified",
    qualification: "",
    subjects: "",
    specialization: "",
    experience_years: 0,

    phone: "",
    email: "",

    area: "",
    city: "Loralai",
    district: "",
    province: "Balochistan",
    country: "Pakistan",

    description: "",
    hourly_fee: "",
    availability: "available",
    profile_photo_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================================================
  // LOAD TUTOR
  // =========================================================

  useEffect(() => {
    const loadTutor = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("authToken");

        if (!token) {
          throw new Error(
            "Please login as administrator."
          );
        }

        if (!id) {
          throw new Error(
            "Tutor ID is missing."
          );
        }

        const response = await fetch(
          `http://localhost:5000/api/tutors/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
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
              "Failed to load tutor."
          );
        }

        const tutor =
          data.data?.tutor;

        if (!tutor) {
          throw new Error(
            "Tutor data was not returned."
          );
        }

        setForm({
          full_name:
            tutor.full_name || "",

          gender:
            tutor.gender ||
            "not_specified",

          qualification:
            tutor.qualification || "",

          subjects:
            tutor.subjects || "",

          specialization:
            tutor.specialization || "",

          experience_years:
            tutor.experience_years ?? 0,

          phone:
            tutor.phone || "",

          email:
            tutor.email || "",

          area:
            tutor.area || "",

          city:
            tutor.city || "Loralai",

          district:
            tutor.district || "",

          province:
            tutor.province ||
            "Balochistan",

          country:
            tutor.country ||
            "Pakistan",

          description:
            tutor.description || "",

          hourly_fee:
            tutor.hourly_fee ?? "",

          availability:
            tutor.availability ||
            "available",

          profile_photo_url:
            tutor.profile_photo_url ||
            "",
        });

      } catch (err) {
        console.error(
          "Load tutor error:",
          err
        );

        setError(
          err.message ||
            "Failed to load tutor."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTutor();
  }, [id]);


  // =========================================================
  // CHANGE
  // =========================================================

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


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!form.full_name.trim()) {
        setError(
          "Tutor name is required."
        );
        return;
      }

      if (
        Number(form.experience_years || 0) <
        0
      ) {
        setError(
          "Experience cannot be negative."
        );
        return;
      }

      if (
        form.hourly_fee !== "" &&
        Number(form.hourly_fee) < 0
      ) {
        setError(
          "Hourly fee cannot be negative."
        );
        return;
      }

      try {
        setSaving(true);

        const token =
          localStorage.getItem(
            "authToken"
          );

        if (!token) {
          throw new Error(
            "Please login as administrator."
          );
        }

        const response =
          await fetch(
            `http://localhost:5000/api/tutors/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                full_name:
                  form.full_name.trim(),

                gender:
                  form.gender,

                qualification:
                  form.qualification.trim() ||
                  null,

                subjects:
                  form.subjects.trim() ||
                  null,

                specialization:
                  form.specialization.trim() ||
                  null,

                experience_years:
                  Number(
                    form.experience_years || 0
                  ),

                phone:
                  form.phone.trim() ||
                  null,

                email:
                  form.email.trim() ||
                  null,

                area:
                  form.area.trim() ||
                  null,

                city:
                  form.city.trim() ||
                  "Loralai",

                district:
                  form.district.trim() ||
                  null,

                province:
                  form.province.trim() ||
                  "Balochistan",

                country:
                  form.country.trim() ||
                  "Pakistan",

                description:
                  form.description.trim() ||
                  null,

                hourly_fee:
                  form.hourly_fee !== ""
                    ? Number(
                        form.hourly_fee
                      )
                    : null,

                availability:
                  form.availability,

                profile_photo_url:
                  form.profile_photo_url.trim() ||
                  null,
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
              "Failed to update tutor."
          );
        }

        setSuccess(
          "Tutor updated successfully."
        );

        setTimeout(() => {
          navigate(
            "/admin/tutors"
          );
        }, 900);

      } catch (err) {
        console.error(
          "Update tutor error:",
          err
        );

        setError(
          err.message ||
            "Failed to update tutor."
        );
      } finally {
        setSaving(false);
      }
    };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <main className="lep-edit-tutor-page">

          <div className="lep-edit-tutor-container">

            <div className="lep-edit-tutor-state">

              <div className="lep-edit-tutor-state-icon">
                <SmartIcon
                  name="tutor"
                  size={28}
                />
              </div>

              <span className="lep-edit-tutor-eyebrow">
                ADMINISTRATION
              </span>

              <h1>
                Loading Tutor...
              </h1>

              <p>
                Please wait while we load
                the tutor information.
              </p>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (
    error &&
    !form.full_name
  ) {
    return (
      <>
        <style>{styles}</style>

        <main className="lep-edit-tutor-page">

          <div className="lep-edit-tutor-container">

            <div className="lep-edit-tutor-state">

              <div className="lep-edit-tutor-state-icon">
                <SmartIcon
                  name="search"
                  size={28}
                />
              </div>

              <span className="lep-edit-tutor-eyebrow">
                ADMINISTRATION
              </span>

              <h1>
                Unable to Load Tutor
              </h1>

              <p>
                {error}
              </p>

              <Link
                to="/admin/tutors"
                className="lep-edit-tutor-back"
              >
                <SmartIcon
                  name="arrow-left"
                  size={14}
                />
                Back to Tutors
              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  return (
    <>
      <style>{styles}</style>

      <main className="lep-edit-tutor-page">

        <div className="lep-edit-tutor-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="lep-edit-tutor-header">

            <div className="lep-edit-tutor-heading">

              <div className="lep-edit-tutor-icon">

                <SmartIcon
                  name="edit"
                  size={27}
                />

              </div>

              <div>

                <span className="lep-edit-tutor-eyebrow">

                  <SmartIcon
                    name="settings"
                    size={12}
                  />

                  ADMINISTRATION

                </span>

                <h1>
                  Edit Tutor
                </h1>

                <p>
                  Update the verified tutor
                  information.
                </p>

              </div>

            </div>


            <Link
              to="/admin/tutors"
              className="lep-edit-tutor-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              Tutors

            </Link>

          </header>


          {/* =================================================
              MESSAGES
          ================================================= */}

          {error && (

            <div className="lep-edit-tutor-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-edit-tutor-message success">

              <SmartIcon
                name="verified"
                size={15}
              />

              {success}

            </div>

          )}


          <form
            className="lep-edit-tutor-form"
            onSubmit={handleSubmit}
          >


            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="lep-edit-tutor-section">

              <div className="lep-edit-tutor-heading-row">

                <div className="lep-edit-tutor-number">
                  01
                </div>

                <div className="lep-edit-tutor-section-icon">
                  <SmartIcon
                    name="tutor"
                    size={21}
                  />
                </div>

                <div>

                  <h2>
                    Basic Information
                  </h2>

                  <p>
                    Main tutor profile information.
                  </p>

                </div>

              </div>


              <div className="lep-edit-tutor-grid">


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="user"
                      size={14}
                    />
                    Full Name *
                  </label>

                  <input
                    name="full_name"
                    value={
                      form.full_name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="students"
                      size={14}
                    />
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={
                      form.gender
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="not_specified">
                      Not Specified
                    </option>

                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="document"
                      size={14}
                    />
                    Qualification
                  </label>

                  <input
                    name="qualification"
                    value={
                      form.qualification
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="programs"
                      size={14}
                    />
                    Subjects
                  </label>

                  <input
                    name="subjects"
                    value={
                      form.subjects
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="academy"
                      size={14}
                    />
                    Specialization
                  </label>

                  <input
                    name="specialization"
                    value={
                      form.specialization
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="calendar"
                      size={14}
                    />
                    Experience (Years)
                  </label>

                  <input
                    name="experience_years"
                    type="number"
                    min="0"
                    value={
                      form.experience_years
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                CONTACT
            ================================================= */}

            <section className="lep-edit-tutor-section">

              <div className="lep-edit-tutor-heading-row">

                <div className="lep-edit-tutor-number">
                  02
                </div>

                <div className="lep-edit-tutor-section-icon">
                  <SmartIcon
                    name="contacts"
                    size={21}
                  />
                </div>

                <div>

                  <h2>
                    Contact & Location
                  </h2>

                  <p>
                    Contact and location information.
                  </p>

                </div>

              </div>


              <div className="lep-edit-tutor-grid">

                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="phone"
                      size={14}
                    />
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="mail"
                      size={14}
                    />
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="location"
                      size={14}
                    />
                    Area
                  </label>

                  <input
                    name="area"
                    value={
                      form.area
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    City
                  </label>

                  <input
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    District
                  </label>

                  <input
                    name="district"
                    value={
                      form.district
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    Province
                  </label>

                  <input
                    name="province"
                    value={
                      form.province
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field full">

                  <label>
                    Country
                  </label>

                  <input
                    name="country"
                    value={
                      form.country
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                TUTOR DETAILS
            ================================================= */}

            <section className="lep-edit-tutor-section">

              <div className="lep-edit-tutor-heading-row">

                <div className="lep-edit-tutor-number">
                  03
                </div>

                <div className="lep-edit-tutor-section-icon">
                  <SmartIcon
                    name="verified"
                    size={21}
                  />
                </div>

                <div>

                  <h2>
                    Tutor Details
                  </h2>

                  <p>
                    Availability, fee and profile.
                  </p>

                </div>

              </div>


              <div className="lep-edit-tutor-grid">


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="fees"
                      size={14}
                    />
                    Hourly Fee (PKR)
                  </label>

                  <input
                    type="number"
                    name="hourly_fee"
                    min="0"
                    value={
                      form.hourly_fee
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <div className="lep-edit-tutor-field">

                  <label>
                    <SmartIcon
                      name="calendar"
                      size={14}
                    />
                    Availability
                  </label>

                  <select
                    name="availability"
                    value={
                      form.availability
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="available">
                      Available
                    </option>

                    <option value="busy">
                      Busy
                    </option>

                    <option value="not_available">
                      Not Available
                    </option>

                  </select>

                </div>


                <div className="lep-edit-tutor-field full">

                  <label>
                    <SmartIcon
                      name="user"
                      size={14}
                    />
                    Profile Photo URL
                  </label>

                  <input
                    name="profile_photo_url"
                    value={
                      form.profile_photo_url
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="/uploads/tutors/photo.jpg"
                  />

                </div>


                <div className="lep-edit-tutor-field full">

                  <div className="lep-edit-tutor-preview">

                    {form.profile_photo_url ? (

                      <img
                        src={
                          form.profile_photo_url.startsWith(
                            "http"
                          )
                            ? form.profile_photo_url
                            : `http://localhost:5000${form.profile_photo_url}`
                        }
                        alt="Tutor preview"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div>

                        <SmartIcon
                          name="tutor"
                          size={35}
                        />

                        <span>
                          Tutor photo preview
                        </span>

                      </div>

                    )}

                  </div>

                </div>


                <div className="lep-edit-tutor-field full">

                  <label>
                    <SmartIcon
                      name="document"
                      size={14}
                    />
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows="7"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="lep-edit-tutor-actions">

              <div className="lep-edit-tutor-note">

                <SmartIcon
                  name="verified"
                  size={15}
                />

                <span>
                  Keep tutor information accurate
                  and up to date.
                </span>

              </div>


              <div className="lep-edit-tutor-buttons">

                <Link
                  to="/admin/tutors"
                  className="lep-edit-tutor-cancel"
                >

                  <SmartIcon
                    name="arrow-left"
                    size={14}
                  />

                  Cancel

                </Link>


                <button
                  type="submit"
                  className="lep-edit-tutor-save"
                  disabled={saving}
                >

                  <SmartIcon
                    name={
                      saving
                        ? "settings"
                        : "edit"
                    }
                    size={14}
                  />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </div>

          </form>

        </div>

      </main>
    </>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = `

  .lep-edit-tutor-page {
    min-height: 100vh;

    padding: 45px 0 90px;

    background:
      radial-gradient(
        circle at 90% 5%,
        rgba(44,95,138,.12),
        transparent 25%
      ),
      radial-gradient(
        circle at 5% 70%,
        rgba(255,107,0,.06),
        transparent 22%
      ),
      linear-gradient(
        180deg,
        #f7f9fc,
        #edf3f8
      );
  }


  .lep-edit-tutor-container {
    width:
      min(
        1120px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  .lep-edit-tutor-header {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      25px;

    margin-bottom:
      25px;
  }


  .lep-edit-tutor-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-edit-tutor-icon {
    width: 60px;
    height: 60px;

    display:
      grid;

    place-items:
      center;

    flex-shrink:
      0;

    border-radius:
      16px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 9px 0 #142b47,
      0 18px 32px
      rgba(26,54,93,.18);

    transform:
      perspective(700px)
      rotateX(4deg)
      rotateY(-4deg);
  }


  .lep-edit-tutor-eyebrow {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    color:
      #ff6b00;

    font-size:
      9px;

    font-weight:
      900;

    letter-spacing:
      1.5px;
  }


  .lep-edit-tutor-heading h1 {
    margin-top:
      7px;

    color:
      #1a365d;

    font-size:
      clamp(
        35px,
        5vw,
        52px
      );

    line-height:
      1;

    letter-spacing:
      -1.8px;
  }


  .lep-edit-tutor-heading p {
    margin-top:
      9px;

    color:
      #718096;

    font-size:
      12px;

    line-height:
      1.7;
  }


  .lep-edit-tutor-back {
    min-height:
      42px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      7px;

    padding:
      0 13px;

    border:
      1px solid #dce4ec;

    border-radius:
      9px;

    background:
      #ffffff;

    color:
      #1a365d;

    text-decoration:
      none;

    font-size:
      10px;

    font-weight:
      900;

    box-shadow:
      0 8px 20px
      rgba(26,54,93,.05);
  }


  .lep-edit-tutor-message {
    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    margin-bottom:
      14px;

    padding:
      12px 14px;

    border-radius:
      9px;

    font-size:
      10px;

    font-weight:
      800;
  }


  .lep-edit-tutor-message.error {
    background:
      #fff2f2;

    border:
      1px solid #f1cccc;

    color:
      #b42318;
  }


  .lep-edit-tutor-message.success {
    background:
      #effaf2;

    border:
      1px solid #c8e7d0;

    color:
      #16803c;
  }


  .lep-edit-tutor-form {
    display:
      grid;

    gap:
      16px;
  }


  .lep-edit-tutor-section {
    position:
      relative;

    overflow:
      hidden;

    padding:
      25px;

    background:
      rgba(255,255,255,.96);

    border:
      1px solid #e2e8f0;

    border-radius:
      17px;

    box-shadow:
      0 12px 30px
      rgba(26,54,93,.055);
  }


  .lep-edit-tutor-heading-row {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      21px;
  }


  .lep-edit-tutor-number {
    width:
      37px;

    height:
      37px;

    display:
      grid;

    place-items:
      center;

    flex-shrink:
      0;

    border-radius:
      10px;

    background:
      #f0f4f8;

    color:
      #2c5f8a;

    font-size:
      10px;

    font-weight:
      900;
  }


  .lep-edit-tutor-section-icon {
    width:
      46px;

    height:
      46px;

    display:
      grid;

    place-items:
      center;

    flex-shrink:
      0;

    border-radius:
      12px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 8px 0 #142b47,
      0 14px 25px
      rgba(26,54,93,.13);

    transform:
      perspective(650px)
      rotateX(4deg)
      rotateY(-3deg);
  }


  .lep-edit-tutor-heading-row h2 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-edit-tutor-heading-row p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;
  }


  .lep-edit-tutor-grid {
    display:
      grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

    gap:
      13px;
  }


  .lep-edit-tutor-field {
    display:
      flex;

    flex-direction:
      column;

    gap:
      7px;
  }


  .lep-edit-tutor-field.full {
    grid-column:
      1 / -1;
  }


  .lep-edit-tutor-field label {
    display:
      flex;

    align-items:
      center;

    gap:
      6px;

    color:
      #475569;

    font-size:
      9px;

    font-weight:
      900;
  }


  .lep-edit-tutor-field label svg {
    color:
      #2c5f8a;
  }


  .lep-edit-tutor-field input,
  .lep-edit-tutor-field select,
  .lep-edit-tutor-field textarea {
    width:
      100%;

    padding:
      12px 13px;

    border:
      1px solid #dfe6ed;

    border-radius:
      9px;

    background:
      #fbfdff;

    color:
      #2d3748;

    font-family:
      inherit;

    font-size:
      11px;

    outline:
      none;

    transition:
      border-color .2s ease,
      box-shadow .2s ease;
  }


  .lep-edit-tutor-field input:focus,
  .lep-edit-tutor-field select:focus,
  .lep-edit-tutor-field textarea:focus {
    background:
      #ffffff;

    border-color:
      #2c5f8a;

    box-shadow:
      0 0 0 4px
      rgba(44,95,138,.07);
  }


  .lep-edit-tutor-field textarea {
    min-height:
      120px;

    resize:
      vertical;

    line-height:
      1.65;
  }


  .lep-edit-tutor-preview {
    min-height:
      180px;

    overflow:
      hidden;

    display:
      flex;

    align-items:
      center;

    justify-content:
      center;

    border:
      1px dashed #ccd7e1;

    border-radius:
      12px;

    background:
      #f8fafc;
  }


  .lep-edit-tutor-preview img {
    width:
      100%;

    max-height:
      250px;

    object-fit:
      cover;
  }


  .lep-edit-tutor-preview > div {
    display:
      flex;

    flex-direction:
      column;

    align-items:
      center;

    gap:
      8px;

    color:
      #94a3b8;

    font-size:
      9px;
  }


  .lep-edit-tutor-preview svg {
    color:
      #2c5f8a;
  }


  .lep-edit-tutor-actions {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      15px;

    padding:
      18px 20px;

    background:
      #1a365d;

    border-radius:
      15px;

    box-shadow:
      0 17px 35px
      rgba(26,54,93,.15);
  }


  .lep-edit-tutor-note {
    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    color:
      #c8d6e3;

    font-size:
      9px;
  }


  .lep-edit-tutor-note svg {
    color:
      #ff9348;
  }


  .lep-edit-tutor-buttons {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      8px;
  }


  .lep-edit-tutor-cancel,
  .lep-edit-tutor-save {
    min-height:
      41px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      7px;

    padding:
      0 15px;

    border-radius:
      9px;

    font-family:
      inherit;

    font-size:
      10px;

    font-weight:
      900;

    text-decoration:
      none;

    cursor:
      pointer;
  }


  .lep-edit-tutor-cancel {
    border:
      1px solid
      rgba(255,255,255,.20);

    background:
      rgba(255,255,255,.08);

    color:
      #ffffff;
  }


  .lep-edit-tutor-save {
    border:
      none;

    background:
      #ff6b00;

    color:
      #ffffff;

    box-shadow:
      0 9px 20px
      rgba(0,0,0,.13);
  }


  .lep-edit-tutor-save:hover {
    background:
      #e65f00;
  }


  .lep-edit-tutor-state {
    min-height:
      430px;

    display:
      flex;

    flex-direction:
      column;

    align-items:
      center;

    justify-content:
      center;

    padding:
      40px;

    text-align:
      center;

    background:
      #ffffff;

    border:
      1px solid #e2e8f0;

    border-radius:
      17px;

    box-shadow:
      0 14px 34px
      rgba(26,54,93,.06);
  }


  .lep-edit-tutor-state-icon {
    width:
      60px;

    height:
      60px;

    display:
      grid;

    place-items:
      center;

    margin-bottom:
      14px;

    border-radius:
      15px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;
  }


  .lep-edit-tutor-state h1 {
    color:
      #1a365d;

    font-size:
      25px;
  }


  .lep-edit-tutor-state p {
    max-width:
      500px;

    margin-top:
      8px;

    color:
      #718096;

    font-size:
      11px;

    line-height:
      1.6;
  }


  @media (max-width: 800px) {

    .lep-edit-tutor-header {
      display:
        block;
    }


    .lep-edit-tutor-back {
      margin-top:
        16px;
    }


    .lep-edit-tutor-grid {
      grid-template-columns:
        1fr;
    }


    .lep-edit-tutor-field.full {
      grid-column:
        auto;
    }


    .lep-edit-tutor-actions {
      display:
        block;
    }


    .lep-edit-tutor-buttons {
      margin-top:
        14px;
    }
  }


  @media (max-width: 550px) {

    .lep-edit-tutor-heading {
      align-items:
        flex-start;
    }


    .lep-edit-tutor-heading h1 {
      font-size:
        36px;
    }


    .lep-edit-tutor-section {
      padding:
        19px;
    }


    .lep-edit-tutor-number {
      display:
        none;
    }


    .lep-edit-tutor-actions {
      padding:
        17px;
    }


    .lep-edit-tutor-buttons {
      display:
        grid;

      grid-template-columns:
        1fr 1fr;
    }


    .lep-edit-tutor-cancel,
    .lep-edit-tutor-save {
      width:
        100%;
    }
  }

`;

export default EditTutor;