import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


const TYPE_CONFIG = {
  school: {
    title: "Add School",
    singular: "School",
    description:
      "Create a complete verified profile for a school.",
    backPath: "/admin/schools",
    icon: "school",
  },

  college: {
    title: "Add College",
    singular: "College",
    description:
      "Create a complete verified profile for a college.",
    backPath: "/admin/colleges",
    icon: "college",
  },

  university: {
    title: "Add University",
    singular: "University",
    description:
      "Create a complete verified profile for a university.",
    backPath: "/admin/universities",
    icon: "university",
  },

  academy: {
    title: "Add Academy",
    singular: "Academy",
    description:
      "Create a complete verified profile for an academy.",
    backPath: "/admin/academies",
    icon: "academy",
  },
};


function AddInstitution({ type }) {
  const navigate = useNavigate();

  const config =
    TYPE_CONFIG[type] ||
    TYPE_CONFIG.school;


  // =========================================================
  // FORM
  // =========================================================

  const [form, setForm] = useState({
    name: "",
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

    logo_url: "",
    cover_image_url: "",

    student_count: 0,
    teacher_count: 0,
  });


  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


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

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (!form.name.trim()) {
      setError(
        `${config.singular} name is required.`
      );

      return;
    }


    if (!form.address.trim()) {
      setError(
        "Address is required."
      );

      return;
    }


    // Validate latitude
    if (
      form.latitude !== "" &&
      (
        Number.isNaN(
          Number(form.latitude)
        ) ||
        Number(form.latitude) < -90 ||
        Number(form.latitude) > 90
      )
    ) {
      setError(
        "Latitude must be between -90 and 90."
      );

      return;
    }


    // Validate longitude
    if (
      form.longitude !== "" &&
      (
        Number.isNaN(
          Number(form.longitude)
        ) ||
        Number(form.longitude) < -180 ||
        Number(form.longitude) > 180
      )
    ) {
      setError(
        "Longitude must be between -180 and 180."
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
          "http://localhost:5000/api/admin/institutions",
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
                type,

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
                form.latitude !== ""
                  ? Number(form.latitude)
                  : null,

              longitude:
                form.longitude !== ""
                  ? Number(form.longitude)
                  : null,

              logo_url:
                form.logo_url.trim() ||
                null,

              cover_image_url:
                form.cover_image_url.trim() ||
                null,

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
            `Failed to create ${config.singular.toLowerCase()}.`
        );
      }


      setSuccess(
        `${config.singular} created successfully.`
      );


      setTimeout(() => {
        navigate(
          config.backPath
        );
      }, 900);


    } catch (err) {

      console.error(
        "Create institution error:",
        err
      );

      setError(
        err.message ||
          "Failed to create institution."
      );

    } finally {

      setSaving(false);

    }
  };


  return (
    <>
      <style>{`

        /* =====================================================
           ADD INSTITUTION
           PROFESSIONAL 3D FORM
        ===================================================== */

        .lep-add-page {
          min-height: 100vh;

          padding:
            45px 0 90px;

          background:
            radial-gradient(
              circle at 90% 6%,
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

          color: #2d3748;
        }


        .lep-add-container {
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

        .lep-add-header {
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


        .lep-add-heading {
          display:
            flex;

          align-items:
            center;

          gap:
            15px;
        }


        .lep-add-page-icon {
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


        .lep-add-page-icon:hover {
          transform:
            perspective(700px)
            rotateX(0)
            rotateY(0)
            translateY(-4px);
        }


        .lep-add-eyebrow {
          display:
            inline-flex;

          align-items:
            center;

          gap:
            6px;

          color:
            #ff6b00;

          font-size:
            9px;

          font-weight:
            900;

          letter-spacing:
            1.5px;
        }


        .lep-add-title {
          margin-top:
            6px;

          color:
            #1a365d;

          font-size:
            clamp(
              34px,
              5vw,
              52px
            );

          line-height:
            1;

          letter-spacing:
            -1.7px;
        }


        .lep-add-description {
          max-width:
            700px;

          margin-top:
            9px;

          color:
            #718096;

          font-size:
            12px;

          line-height:
            1.7;
        }


        .lep-add-back {
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


        .lep-add-back:hover {
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

        .lep-add-message {
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


        .lep-add-message.error {
          background:
            #fff2f2;

          border:
            1px solid #f1cccc;

          color:
            #b42318;
        }


        .lep-add-message.success {
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

        .lep-add-form {
          display:
            grid;

          gap:
            16px;
        }


        /* =====================================================
           FORM SECTION
        ===================================================== */

        .lep-form-section {
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


        .lep-form-section:hover {
          border-color:
            rgba(44,95,138,.18);

          box-shadow:
            0 18px 38px
            rgba(26,54,93,.075);
        }


        .lep-form-section::after {
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


        .lep-form-section-header {
          display:
            flex;

          align-items:
            center;

          gap:
            13px;

          margin-bottom:
            21px;
        }


        .lep-form-number {
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


        .lep-form-section-icon {
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


        .lep-form-section:hover
        .lep-form-section-icon {
          transform:
            perspective(650px)
            rotateX(0)
            rotateY(0)
            translateY(-3px);
        }


        .lep-form-section-heading h2 {
          color:
            #1a365d;

          font-size:
            20px;

          line-height:
            1.2;
        }


        .lep-form-section-heading p {
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

        .lep-form-grid {
          display:
            grid;

          grid-template-columns:
            repeat(2, minmax(0,1fr));

          gap:
            13px;
        }


        .lep-field.full {
          grid-column:
            1 / -1;
        }


        /* =====================================================
           FIELD
        ===================================================== */

        .lep-field {
          display:
            flex;

          flex-direction:
            column;

          gap:
            7px;
        }


        .lep-field label {
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


        .lep-field label svg {
          color:
            #2c5f8a;
        }


        .lep-field input,
        .lep-field textarea,
        .lep-field select {
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


        .lep-field input:focus,
        .lep-field textarea:focus,
        .lep-field select:focus {
          background:
            #ffffff;

          border-color:
            #2c5f8a;

          box-shadow:
            0 0 0 4px
            rgba(44,95,138,.07);
        }


        .lep-field textarea {
          min-height:
            100px;

          resize:
            vertical;

          line-height:
            1.65;
        }


        .lep-field small {
          color:
            #94a3b8;

          font-size:
            8px;

          line-height:
            1.5;
        }


        /* =====================================================
           COORDINATES
        ===================================================== */

        .lep-coordinate-note {
          display:
            flex;

          align-items:
            flex-start;

          gap:
            8px;

          margin-top:
            3px;

          padding:
            10px 12px;

          border:
            1px solid #e1e9f0;

          border-radius:
            8px;

          background:
            #f7fafc;

          color:
            #718096;

          font-size:
            9px;

          line-height:
            1.55;
        }


        .lep-coordinate-note svg {
          color:
            #ff6b00;

          flex-shrink:
            0;
        }


        /* =====================================================
           MEDIA PREVIEW
        ===================================================== */

        .lep-media-preview-grid {
          display:
            grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap:
            11px;

          margin-top:
            14px;
        }


        .lep-media-preview {
          min-height:
            145px;

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
            11px;

          background:
            #f8fafc;
        }


        .lep-media-preview img {
          width:
            100%;

          height:
            190px;

          object-fit:
            cover;

          display:
            block;
        }


        .lep-media-placeholder {
          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;

          gap:
            7px;

          color:
            #94a3b8;

          text-align:
            center;

          font-size:
            9px;
        }


        .lep-media-placeholder svg {
          color:
            #2c5f8a;
        }


        /* =====================================================
           SUBMIT ACTIONS
        ===================================================== */

        .lep-form-actions {
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


        .lep-form-actions-note {
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


        .lep-form-actions-note svg {
          color:
            #ff9348;
        }


        .lep-form-buttons {
          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            8px;
        }


        .lep-cancel-btn,
        .lep-save-btn {
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


        .lep-cancel-btn {
          border:
            1px solid
            rgba(255,255,255,.20);

          background:
            rgba(255,255,255,.08);

          color:
            #ffffff;
        }


        .lep-save-btn {
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


        .lep-cancel-btn:hover,
        .lep-save-btn:hover {
          transform:
            translateY(-2px);
        }


        .lep-save-btn:hover {
          background:
            #e65f00;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 800px) {

          .lep-add-header {
            display:
              block;
          }


          .lep-add-back {
            margin-top:
              16px;
          }


          .lep-form-grid {
            grid-template-columns:
              1fr;
          }


          .lep-field.full {
            grid-column:
              auto;
          }


          .lep-media-preview-grid {
            grid-template-columns:
              1fr;
          }


          .lep-form-actions {
            display:
              block;
          }


          .lep-form-buttons {
            margin-top:
              14px;
          }

        }


        @media (max-width: 550px) {

          .lep-add-page {
            padding-top:
              30px;
          }


          .lep-add-heading {
            align-items:
              flex-start;
          }


          .lep-add-title {
            font-size:
              36px;
          }


          .lep-form-section {
            padding:
              19px;
          }


          .lep-form-section-header {
            align-items:
              flex-start;
          }


          .lep-form-number {
            display:
              none;
          }


          .lep-form-actions {
            padding:
              17px;
          }


          .lep-form-buttons {
            display:
              grid;

            grid-template-columns:
              1fr 1fr;
          }


          .lep-cancel-btn,
          .lep-save-btn {
            width:
              100%;
          }

        }

      `}</style>


      <main className="lep-add-page">

        <div className="lep-add-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-add-header">

            <div className="lep-add-heading">


              <div className="lep-add-page-icon">

                <SmartIcon
                  name={config.icon}
                  size={29}
                />

              </div>


              <div>

                <span className="lep-add-eyebrow">

                  <SmartIcon
                    name="plus"
                    size={12}
                  />

                  ADMINISTRATION

                </span>


                <h1 className="lep-add-title">
                  {config.title}
                </h1>


                <p className="lep-add-description">
                  {config.description}
                </p>

              </div>

            </div>


            <Link
              to={
                config.backPath
              }
              className="lep-add-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              Back to {config.singular}s

            </Link>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-add-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-add-message success">

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
            className="lep-add-form"
            onSubmit={
              handleSubmit
            }
          >


            {/* =================================================
                01 BASIC INFORMATION
            ================================================= */}

            <section className="lep-form-section">

              <div className="lep-form-section-header">

                <div className="lep-form-number">
                  01
                </div>


                <div className="lep-form-section-icon">

                  <SmartIcon
                    name={
                      config.icon
                    }
                    size={21}
                  />

                </div>


                <div className="lep-form-section-heading">

                  <h2>
                    Basic Information
                  </h2>


                  <p>
                    Main information about the{" "}
                    {config.singular.toLowerCase()}.
                  </p>

                </div>

              </div>


              <div className="lep-form-grid">


                {/* NAME */}

                <div className="lep-field full">

                  <label>

                    <SmartIcon
                      name={config.icon}
                      size={14}
                    />

                    {config.singular} Name *

                  </label>


                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={`Enter ${config.singular.toLowerCase()} name`}
                    required
                  />

                </div>


                {/* OWNERSHIP */}

                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="verified"
                      size={14}
                    />

                    Ownership

                  </label>


                  <select
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


                {/* GENDER */}

                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="students"
                      size={14}
                    />

                    Gender Type

                  </label>


                  <select
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


                {/* PRINCIPAL */}

                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="teacher"
                      size={14}
                    />

                    Principal / Head

                  </label>


                  <input
                    name="principal_name"
                    value={
                      form.principal_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter principal or head name"
                  />

                </div>


                {/* ESTABLISHED */}

                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="calendar"
                      size={14}
                    />

                    Established Year

                  </label>


                  <input
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
                    placeholder="e.g. 2005"
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="lep-field full">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Description

                  </label>


                  <textarea
                    name="description"
                    rows="5"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={`Write a clear description of the ${config.singular.toLowerCase()}...`}
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                02 CONTACT
            ================================================= */}

            <section className="lep-form-section">

              <div className="lep-form-section-header">

                <div className="lep-form-number">
                  02
                </div>


                <div className="lep-form-section-icon">

                  <SmartIcon
                    name="contacts"
                    size={21}
                  />

                </div>


                <div className="lep-form-section-heading">

                  <h2>
                    Contact Information
                  </h2>


                  <p>
                    Official contact details.
                  </p>

                </div>

              </div>


              <div className="lep-form-grid">


                <div className="lep-field">

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


                <div className="lep-field">

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
                    placeholder="example@email.com"
                  />

                </div>


                <div className="lep-field full">

                  <label>

                    <SmartIcon
                      name="globe"
                      size={14}
                    />

                    Website

                  </label>


                  <input
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


            {/* =================================================
                03 LOCATION
            ================================================= */}

            <section className="lep-form-section">

              <div className="lep-form-section-header">

                <div className="lep-form-number">
                  03
                </div>


                <div className="lep-form-section-icon">

                  <SmartIcon
                    name="location"
                    size={21}
                  />

                </div>


                <div className="lep-form-section-heading">

                  <h2>
                    Location
                  </h2>


                  <p>
                    Complete physical location
                    and map coordinates.
                  </p>

                </div>

              </div>


              <div className="lep-form-grid">


                {/* ADDRESS */}

                <div className="lep-field full">

                  <label>

                    <SmartIcon
                      name="location"
                      size={14}
                    />

                    Full Address *

                  </label>


                  <textarea
                    name="address"
                    rows="4"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Complete institution address..."
                    required
                  />

                </div>


                {/* AREA */}

                <div className="lep-field">

                  <label>
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
                    placeholder="e.g. Main Bazaar"
                  />

                </div>


                {/* CITY */}

                <div className="lep-field">

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

                <div className="lep-field">

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

                <div className="lep-field">

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

                <div className="lep-field">

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


                {/* LATITUDE */}

                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="location"
                      size={14}
                    />

                    Latitude

                  </label>


                  <input
                    name="latitude"
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    value={
                      form.latitude
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 30.3700"
                  />


                  <small>
                    Valid range: -90 to 90
                  </small>

                </div>


                {/* LONGITUDE */}

                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="location"
                      size={14}
                    />

                    Longitude

                  </label>


                  <input
                    name="longitude"
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    value={
                      form.longitude
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. 68.3500"
                  />


                  <small>
                    Valid range: -180 to 180
                  </small>

                </div>


                <div className="lep-field full">

                  <div className="lep-coordinate-note">

                    <SmartIcon
                      name="location"
                      size={14}
                    />

                    <span>
                      Use decimal coordinates from
                      Google Maps. Latitude is limited
                      to -90 through 90, while longitude
                      is limited to -180 through 180.
                    </span>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                04 MEDIA
            ================================================= */}

            <section className="lep-form-section">

              <div className="lep-form-section-header">

                <div className="lep-form-number">
                  04
                </div>


                <div className="lep-form-section-icon">

                  <SmartIcon
                    name="document"
                    size={21}
                  />

                </div>


                <div className="lep-form-section-heading">

                  <h2>
                    Media
                  </h2>


                  <p>
                    Optional logo and cover image URLs.
                  </p>

                </div>

              </div>


              <div className="lep-form-grid">


                {/* LOGO */}

                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name={config.icon}
                      size={14}
                    />

                    Logo URL

                  </label>


                  <input
                    name="logo_url"
                    value={
                      form.logo_url
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="/uploads/logo.png"
                  />

                </div>


                {/* COVER */}

                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Cover Image URL

                  </label>


                  <input
                    name="cover_image_url"
                    value={
                      form.cover_image_url
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="/uploads/cover.jpg"
                  />

                </div>

              </div>


              <div className="lep-media-preview-grid">


                <div className="lep-media-preview">

                  {form.logo_url ? (

                    <img
                      src={
                        form.logo_url
                      }
                      alt="Logo preview"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="lep-media-placeholder">

                      <SmartIcon
                        name={config.icon}
                        size={30}
                      />

                      <span>
                        Logo preview
                      </span>

                    </div>

                  )}

                </div>


                <div className="lep-media-preview">

                  {form.cover_image_url ? (

                    <img
                      src={
                        form.cover_image_url
                      }
                      alt="Cover preview"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="lep-media-placeholder">

                      <SmartIcon
                        name="document"
                        size={30}
                      />

                      <span>
                        Cover preview
                      </span>

                    </div>

                  )}

                </div>

              </div>

            </section>


            {/* =================================================
                05 STATISTICS
            ================================================= */}

            <section className="lep-form-section">

              <div className="lep-form-section-header">

                <div className="lep-form-number">
                  05
                </div>


                <div className="lep-form-section-icon">

                  <SmartIcon
                    name="students"
                    size={21}
                  />

                </div>


                <div className="lep-form-section-heading">

                  <h2>
                    Institution Statistics
                  </h2>


                  <p>
                    Verified student and teacher
                    information.
                  </p>

                </div>

              </div>


              <div className="lep-form-grid">


                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="students"
                      size={14}
                    />

                    Total Students

                  </label>


                  <input
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


                <div className="lep-field">

                  <label>

                    <SmartIcon
                      name="teacher"
                      size={14}
                    />

                    Total Teachers

                  </label>


                  <input
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


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="lep-form-actions">


              <div className="lep-form-actions-note">

                <SmartIcon
                  name="verified"
                  size={15}
                />

                <span>
                  Information will be saved as a
                  draft until it is verified and
                  approved.
                </span>

              </div>


              <div className="lep-form-buttons">

                <Link
                  to={
                    config.backPath
                  }
                  className="lep-cancel-btn"
                >

                  <SmartIcon
                    name="arrow-left"
                    size={14}
                  />

                  Cancel

                </Link>


                <button
                  type="submit"
                  className="lep-save-btn"
                  disabled={
                    saving
                  }
                >

                  <SmartIcon
                    name={
                      saving
                        ? "settings"
                        : "verified"
                    }
                    size={14}
                  />

                  {saving
                    ? "Saving..."
                    : `Create ${config.singular}`}

                </button>

              </div>

            </div>

          </form>

        </div>

      </main>
    </>
  );
}


export default AddInstitution;