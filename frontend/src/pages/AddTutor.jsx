import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


function AddTutor() {
  const navigate = useNavigate();


  // =========================================================
  // FORM
  // =========================================================

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
    district: "Loralai",
    province: "Balochistan",
    country: "Pakistan",

    description: "",

    hourly_fee: "",
    availability: "available",

    profile_photo_url: "",
  });


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // HANDLE CHANGE
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
        form.experience_years !== "" &&
        Number(form.experience_years) < 0
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

        setLoading(true);


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
            `${API_URL}/api/tutors`,
            {
              method: "POST",

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
                  "Loralai",

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
              "Failed to create tutor."
          );
        }


        setSuccess(
          "Tutor created successfully."
        );


        setTimeout(() => {
          navigate(
            "/admin/tutors"
          );
        }, 900);


      } catch (err) {

        console.error(
          "Create tutor error:",
          err
        );


        setError(
          err.message ||
            "Failed to create tutor."
        );

      } finally {

        setLoading(false);

      }
    };


  return (
    <>
      <style>{`

        /* =====================================================
           ADD TUTOR
        ===================================================== */

        .lep-add-tutor-page {
          min-height: 100vh;

          padding:
            45px 0 90px;

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


        .lep-add-tutor-container {
          width:
            min(
              1120px,
              calc(100% - 32px)
            );

          margin:
            0 auto;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .lep-add-tutor-header {
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


        .lep-add-tutor-heading {
          display:
            flex;

          align-items:
            center;

          gap:
            15px;
        }


        .lep-add-tutor-page-icon {
          width:
            60px;

          height:
            60px;

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

          transition:
            transform .3s ease;
        }


        .lep-add-tutor-page-icon:hover {
          transform:
            perspective(700px)
            rotateX(0)
            rotateY(0)
            translateY(-4px);
        }


        .lep-add-tutor-eyebrow {
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


        .lep-add-tutor-title {
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


        .lep-add-tutor-description {
          max-width:
            710px;

          margin-top:
            9px;

          color:
            #718096;

          font-size:
            12px;

          line-height:
            1.7;
        }


        .lep-add-tutor-back {
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

          transition:
            transform .2s ease,
            border-color .2s ease,
            color .2s ease;
        }


        .lep-add-tutor-back:hover {
          transform:
            translateY(-2px);

          border-color:
            #2c5f8a;

          color:
            #2c5f8a;
        }


        /* =====================================================
           MESSAGES
        ===================================================== */

        .lep-add-tutor-message {
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


        .lep-add-tutor-message.error {
          background:
            #fff2f2;

          border:
            1px solid #f1cccc;

          color:
            #b42318;
        }


        .lep-add-tutor-message.success {
          background:
            #effaf2;

          border:
            1px solid #c8e7d0;

          color:
            #16803c;
        }


        /* =====================================================
           FORM
        ===================================================== */

        .lep-add-tutor-form {
          display:
            grid;

          gap:
            16px;
        }


        .lep-add-tutor-section {
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

          transition:
            border-color .25s ease,
            box-shadow .25s ease;
        }


        .lep-add-tutor-section:hover {
          border-color:
            rgba(44,95,138,.18);

          box-shadow:
            0 18px 38px
            rgba(26,54,93,.075);
        }


        .lep-add-tutor-section::after {
          content:
            "";

          position:
            absolute;

          width:
            160px;

          height:
            160px;

          right:
            -100px;

          top:
            -100px;

          border-radius:
            50%;

          background:
            rgba(44,95,138,.035);

          pointer-events:
            none;
        }


        .lep-add-tutor-section-heading {
          display:
            flex;

          align-items:
            center;

          gap:
            12px;

          margin-bottom:
            21px;
        }


        .lep-add-tutor-number {
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


        .lep-add-tutor-section-icon {
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

          transition:
            transform .3s ease;
        }


        .lep-add-tutor-section:hover
        .lep-add-tutor-section-icon {
          transform:
            perspective(650px)
            rotateX(0)
            rotateY(0)
            translateY(-3px);
        }


        .lep-add-tutor-section-heading h2 {
          color:
            #1a365d;

          font-size:
            20px;

          line-height:
            1.2;
        }


        .lep-add-tutor-section-heading p {
          margin-top:
            4px;

          color:
            #718096;

          font-size:
            10px;

          line-height:
            1.5;
        }


        /* =====================================================
           GRID
        ===================================================== */

        .lep-add-tutor-grid {
          display:
            grid;

          grid-template-columns:
            repeat(2,minmax(0,1fr));

          gap:
            13px;
        }


        .lep-add-tutor-field {
          display:
            flex;

          flex-direction:
            column;

          gap:
            7px;
        }


        .lep-add-tutor-field.full {
          grid-column:
            1 / -1;
        }


        .lep-add-tutor-field label {
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


        .lep-add-tutor-field label svg {
          color:
            #2c5f8a;
        }


        .lep-add-tutor-field input,
        .lep-add-tutor-field select,
        .lep-add-tutor-field textarea {
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
            box-shadow .2s ease,
            background .2s ease;
        }


        .lep-add-tutor-field input:focus,
        .lep-add-tutor-field select:focus,
        .lep-add-tutor-field textarea:focus {
          background:
            #ffffff;

          border-color:
            #2c5f8a;

          box-shadow:
            0 0 0 4px
            rgba(44,95,138,.07);
        }


        .lep-add-tutor-field textarea {
          min-height:
            120px;

          resize:
            vertical;

          line-height:
            1.65;
        }


        .lep-add-tutor-field small {
          color:
            #94a3b8;

          font-size:
            8px;
        }


        /* =====================================================
           PHOTO PREVIEW
        ===================================================== */

        .lep-add-tutor-preview {
          min-height:
            180px;

          margin-top:
            14px;

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


        .lep-add-tutor-preview img {
          width:
            100%;

          max-height:
            250px;

          object-fit:
            cover;

          display:
            block;
        }


        .lep-add-tutor-preview-placeholder {
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

          text-align:
            center;
        }


        .lep-add-tutor-preview-placeholder svg {
          color:
            #2c5f8a;
        }


        /* =====================================================
           ACTIONS
        ===================================================== */

        .lep-add-tutor-actions {
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


        .lep-add-tutor-actions-note {
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

          line-height:
            1.5;
        }


        .lep-add-tutor-actions-note svg {
          color:
            #ff9348;
        }


        .lep-add-tutor-buttons {
          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            8px;
        }


        .lep-add-tutor-cancel,
        .lep-add-tutor-save {
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

          transition:
            transform .2s ease,
            background .2s ease;
        }


        .lep-add-tutor-cancel {
          border:
            1px solid
            rgba(255,255,255,.20);

          background:
            rgba(255,255,255,.08);

          color:
            #ffffff;
        }


        .lep-add-tutor-save {
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


        .lep-add-tutor-cancel:hover,
        .lep-add-tutor-save:hover {
          transform:
            translateY(-2px);
        }


        .lep-add-tutor-save:hover {
          background:
            #e65f00;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 800px) {

          .lep-add-tutor-header {
            display:
              block;
          }


          .lep-add-tutor-back {
            margin-top:
              16px;
          }


          .lep-add-tutor-grid {
            grid-template-columns:
              1fr;
          }


          .lep-add-tutor-field.full {
            grid-column:
              auto;
          }


          .lep-add-tutor-actions {
            display:
              block;
          }


          .lep-add-tutor-buttons {
            margin-top:
              14px;
          }

        }


        @media (max-width: 550px) {

          .lep-add-tutor-heading {
            align-items:
              flex-start;
          }


          .lep-add-tutor-title {
            font-size:
              36px;
          }


          .lep-add-tutor-section {
            padding:
              19px;
          }


          .lep-add-tutor-number {
            display:
              none;
          }


          .lep-add-tutor-actions {
            padding:
              17px;
          }


          .lep-add-tutor-buttons {
            display:
              grid;

            grid-template-columns:
              1fr 1fr;
          }


          .lep-add-tutor-cancel,
          .lep-add-tutor-save {
            width:
              100%;
          }

        }

      `}</style>


      <main className="lep-add-tutor-page">

        <div className="lep-add-tutor-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-add-tutor-header">

            <div className="lep-add-tutor-heading">

              <div className="lep-add-tutor-page-icon">

                <SmartIcon
                  name="tutor"
                  size={28}
                />

              </div>


              <div>

                <span className="lep-add-tutor-eyebrow">

                  <SmartIcon
                    name="plus"
                    size={12}
                  />

                  ADMINISTRATION

                </span>


                <h1 className="lep-add-tutor-title">
                  Add Tutor
                </h1>


                <p className="lep-add-tutor-description">
                  Enter verified information
                  collected about the tutor.
                </p>

              </div>

            </div>


            <Link
              to="/admin/tutors"
              className="lep-add-tutor-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              Tutors

            </Link>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-add-tutor-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-add-tutor-message success">

              <SmartIcon
                name="verified"
                size={15}
              />

              {success}

            </div>

          )}


          {/* =====================================================
              FORM
          ===================================================== */}

          <form
            className="lep-add-tutor-form"
            onSubmit={handleSubmit}
          >


            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="lep-add-tutor-section">

              <div className="lep-add-tutor-section-heading">

                <div className="lep-add-tutor-number">
                  01
                </div>


                <div className="lep-add-tutor-section-icon">

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


              <div className="lep-add-tutor-grid">


                {/* NAME */}

                <div className="lep-add-tutor-field">

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
                    placeholder="Muhammad Ahmad"
                    required
                  />

                </div>


                {/* GENDER */}

                <div className="lep-add-tutor-field">

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


                {/* QUALIFICATION */}

                <div className="lep-add-tutor-field">

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
                    placeholder="M.Sc Mathematics"
                  />

                </div>


                {/* SUBJECTS */}

                <div className="lep-add-tutor-field">

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
                    placeholder="Mathematics, Physics"
                  />

                </div>


                {/* SPECIALIZATION */}

                <div className="lep-add-tutor-field">

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
                    placeholder="Mathematics"
                  />

                </div>


                {/* EXPERIENCE */}

                <div className="lep-add-tutor-field">

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

            <section className="lep-add-tutor-section">

              <div className="lep-add-tutor-section-heading">

                <div className="lep-add-tutor-number">
                  02
                </div>


                <div className="lep-add-tutor-section-icon">

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
                    Official contact and location
                    details.
                  </p>

                </div>

              </div>


              <div className="lep-add-tutor-grid">


                {/* PHONE */}

                <div className="lep-add-tutor-field">

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
                    placeholder="03001234567"
                  />

                </div>


                {/* EMAIL */}

                <div className="lep-add-tutor-field">

                  <label>

                    <SmartIcon
                      name="mail"
                      size={14}
                    />

                    Email

                  </label>


                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="tutor@example.com"
                  />

                </div>


                {/* AREA */}

                <div className="lep-add-tutor-field">

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
                    placeholder="Main City"
                  />

                </div>


                {/* CITY */}

                <div className="lep-add-tutor-field">

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


                {/* DISTRICT */}

                <div className="lep-add-tutor-field">

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


                {/* PROVINCE */}

                <div className="lep-add-tutor-field">

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


                {/* COUNTRY */}

                <div className="lep-add-tutor-field">

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

            <section className="lep-add-tutor-section">

              <div className="lep-add-tutor-section-heading">

                <div className="lep-add-tutor-number">
                  03
                </div>


                <div className="lep-add-tutor-section-icon">

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
                    Availability, fee and profile
                    information.
                  </p>

                </div>

              </div>


              <div className="lep-add-tutor-grid">


                {/* FEE */}

                <div className="lep-add-tutor-field">

                  <label>

                    <SmartIcon
                      name="fees"
                      size={14}
                    />

                    Hourly Fee (PKR)

                  </label>


                  <input
                    type="number"
                    min="0"
                    name="hourly_fee"
                    value={
                      form.hourly_fee
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="1000"
                  />

                </div>


                {/* AVAILABILITY */}

                <div className="lep-add-tutor-field">

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


                {/* PHOTO URL */}

                <div className="lep-add-tutor-field full">

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

                  <small>
                    Enter the uploaded image URL
                    for the tutor profile.
                  </small>

                </div>


                {/* PREVIEW */}

                <div className="lep-add-tutor-field full">

                  <div className="lep-add-tutor-preview">

                    {form.profile_photo_url ? (

                      <img
                        src={
                          form.profile_photo_url.startsWith(
                            "http"
                          )
                            ? form.profile_photo_url
                            : `${API_URL}${form.profile_photo_url}`
                        }
                        alt="Tutor preview"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="lep-add-tutor-preview-placeholder">

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


                {/* DESCRIPTION */}

                <div className="lep-add-tutor-field full">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Description

                  </label>


                  <textarea
                    name="description"
                    rows="6"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Write a verified description of the tutor..."
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="lep-add-tutor-actions">


              <div className="lep-add-tutor-actions-note">

                <SmartIcon
                  name="verified"
                  size={15}
                />

                <span>
                  Tutor profiles should contain
                  verified and accurate information.
                </span>

              </div>


              <div className="lep-add-tutor-buttons">

                <Link
                  to="/admin/tutors"
                  className="lep-add-tutor-cancel"
                >

                  <SmartIcon
                    name="arrow-left"
                    size={14}
                  />

                  Cancel

                </Link>


                <button
                  type="submit"
                  className="lep-add-tutor-save"
                  disabled={loading}
                >

                  <SmartIcon
                    name={
                      loading
                        ? "settings"
                        : "verified"
                    }
                    size={14}
                  />

                  {loading
                    ? "Saving..."
                    : "Create Tutor"}

                </button>

              </div>

            </div>

          </form>

        </div>

      </main>
    </>
  );
}


export default AddTutor;