import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


const TYPE_CONFIG = {
  school: {
    singular: "School",
    plural: "Schools",
    adminBase: "/admin/schools",
    icon: "school",
  },

  college: {
    singular: "College",
    plural: "Colleges",
    adminBase: "/admin/colleges",
    icon: "college",
  },

  university: {
    singular: "University",
    plural: "Universities",
    adminBase: "/admin/universities",
    icon: "university",
  },

  academy: {
    singular: "Academy",
    plural: "Academies",
    adminBase: "/admin/academies",
    icon: "academy",
  },
};


function EditSchool({ type: routeType }) {
  const { id } = useParams();

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

    logo_url: "",
    cover_image_url: "",

    student_count: 0,
    teacher_count: 0,
  });


  const [actualType, setActualType] =
    useState(routeType || null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const config =
    TYPE_CONFIG[actualType] ||
    TYPE_CONFIG[routeType] ||
    TYPE_CONFIG.school;


  // =========================================================
  // LOAD EXISTING INSTITUTION
  // =========================================================

  useEffect(() => {
    const loadInstitution = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "authToken"
          );

        if (!token) {
          throw new Error(
            "Please login as administrator."
          );
        }

        if (!id) {
          throw new Error(
            "Institution ID is missing."
          );
        }

        const response =
          await fetch(
            `http://localhost:5000/api/admin/institutions/${id}`,
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
              "Failed to load institution."
          );
        }

        const institution =
          data.data?.institution ||
          data.data;

        if (!institution) {
          throw new Error(
            "Institution data not found."
          );
        }

        const databaseType =
          institution.institution_type ||
          "school";

        if (
          routeType &&
          databaseType !== routeType
        ) {
          throw new Error(
            `This record is not a ${
              TYPE_CONFIG[routeType]
                ?.singular
                ?.toLowerCase() ||
              "requested institution"
            }.`
          );
        }

        setActualType(
          databaseType
        );

        setForm({
          name:
            institution.name || "",

          institution_type:
            databaseType,

          ownership_type:
            institution.ownership_type ||
            "private",

          gender_type:
            institution.gender_type ||
            "not_specified",

          principal_name:
            institution.principal_name ||
            "",

          established_year:
            institution.established_year ??
            "",

          description:
            institution.description ||
            "",

          phone:
            institution.phone ||
            "",

          email:
            institution.email ||
            "",

          website:
            institution.website ||
            "",

          address:
            institution.address ||
            "",

          area:
            institution.area ||
            "",

          city:
            institution.city ||
            "Loralai",

          district:
            institution.district ||
            "Loralai",

          province:
            institution.province ||
            "Balochistan",

          country:
            institution.country ||
            "Pakistan",

          latitude:
            institution.latitude ??
            "",

          longitude:
            institution.longitude ??
            "",

          logo_url:
            institution.logo_url ||
            "",

          cover_image_url:
            institution.cover_image_url ||
            "",

          student_count:
            institution.student_count ??
            0,

          teacher_count:
            institution.teacher_count ??
            0,
        });
      } catch (err) {
        console.error(
          "Load institution error:",
          err
        );

        setError(
          err.message ||
            "Failed to load institution."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInstitution();
  }, [id, routeType]);


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (
    event
  ) => {
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
  // SAVE
  // =========================================================

  const handleSubmit =
    async (event) => {
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
          `${config.singular} address is required.`
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


        const finalType =
          actualType ||
          form.institution_type ||
          "school";


        const body = {
          name:
            form.name.trim(),

          institution_type:
            finalType,

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
              ? Number(
                  form.latitude
                )
              : null,

          longitude:
            form.longitude !== ""
              ? Number(
                  form.longitude
                )
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
        };


        // =====================================================
        // COORDINATE VALIDATION
        // =====================================================

        if (
          body.latitude !== null &&
          (
            Number.isNaN(
              body.latitude
            ) ||
            body.latitude < -90 ||
            body.latitude > 90
          )
        ) {
          throw new Error(
            "Latitude must be between -90 and 90."
          );
        }


        if (
          body.longitude !== null &&
          (
            Number.isNaN(
              body.longitude
            ) ||
            body.longitude < -180 ||
            body.longitude > 180
          )
        ) {
          throw new Error(
            "Longitude must be between -180 and 180."
          );
        }


        // =====================================================
        // UPDATE REQUEST
        // =====================================================

        const response =
          await fetch(
            `http://localhost:5000/api/admin/institutions/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify(body),
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
              `Failed to update ${
                config.singular.toLowerCase()
              }.`
          );
        }


        setSuccess(
          `${config.singular} updated successfully.`
        );


        setTimeout(() => {
          navigate(
            config.adminBase
          );
        }, 1000);

      } catch (err) {
        console.error(
          "Update institution error:",
          err
        );

        setError(
          err.message ||
            `Failed to update ${
              config.singular.toLowerCase()
            }.`
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
        <style>{pageStyles}</style>

        <main className="lep-edit-page">

          <div className="lep-edit-container">

            <div className="lep-edit-state">

              <div className="lep-edit-state-icon">

                <SmartIcon
                  name={config.icon}
                  size={26}
                />

              </div>

              <span className="lep-edit-eyebrow">
                ADMINISTRATION
              </span>

              <h1>
                Loading {config.singular}...
              </h1>

              <p>
                Please wait while we load
                the institution information.
              </p>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =========================================================
  // FAILED
  // =========================================================

  if (
    error &&
    !form.name
  ) {
    return (
      <>
        <style>{pageStyles}</style>

        <main className="lep-edit-page">

          <div className="lep-edit-container">

            <div className="lep-edit-state">

              <div className="lep-edit-state-icon">

                <SmartIcon
                  name="search"
                  size={26}
                />

              </div>

              <span className="lep-edit-eyebrow">
                ADMINISTRATION
              </span>

              <h1>
                Unable to Load{" "}
                {config.singular}
              </h1>

              <p>
                {error}
              </p>


              <Link
                to={config.adminBase}
                className="lep-edit-back"
              >

                <SmartIcon
                  name="arrow-left"
                  size={14}
                />

                Back to {config.plural}

              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  return (
    <>
      <style>{pageStyles}</style>

      <main className="lep-edit-page">

        <div className="lep-edit-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-edit-header">

            <div className="lep-edit-heading">

              <div className="lep-edit-page-icon">

                <SmartIcon
                  name={config.icon}
                  size={28}
                />

              </div>

              <div>

                <span className="lep-edit-eyebrow">

                  <SmartIcon
                    name="edit"
                    size={12}
                  />

                  ADMINISTRATION

                </span>

                <h1>
                  Edit {config.singular}
                </h1>

                <p>
                  Update the verified information
                  for this{" "}
                  {config.singular.toLowerCase()}.
                </p>

              </div>

            </div>


            <Link
              to={config.adminBase}
              className="lep-edit-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              {config.plural}

            </Link>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-edit-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-edit-message success">

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
            className="lep-edit-form"
            onSubmit={handleSubmit}
          >


            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <section className="lep-edit-section">

              <div className="lep-edit-section-heading">

                <div className="lep-edit-number">
                  01
                </div>

                <div className="lep-edit-section-icon">

                  <SmartIcon
                    name={config.icon}
                    size={21}
                  />

                </div>

                <div>

                  <h2>
                    Basic Information
                  </h2>

                  <p>
                    Main information about this{" "}
                    {config.singular.toLowerCase()}.
                  </p>

                </div>

              </div>


              <div className="lep-edit-grid">


                {/* NAME */}

                <div className="lep-edit-field full">

                  <label>

                    <SmartIcon
                      name={config.icon}
                      size={14}
                    />

                    {config.singular} Name *

                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* TYPE */}

                <div className="lep-edit-field">

                  <label>

                    <SmartIcon
                      name="verified"
                      size={14}
                    />

                    Institution Type

                  </label>

                  <select
                    name="institution_type"
                    value={
                      form.institution_type
                    }
                    disabled
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

                  <small>
                    Institution type cannot
                    be changed after creation.
                  </small>

                </div>


                {/* OWNERSHIP */}

                <div className="lep-edit-field">

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
                    onChange={handleChange}
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

                <div className="lep-edit-field">

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
                    onChange={handleChange}
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

                <div className="lep-edit-field">

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
                    onChange={handleChange}
                  />

                </div>


                {/* ESTABLISHED */}

                <div className="lep-edit-field">

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
                    onChange={handleChange}
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="lep-edit-field full">

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
                    onChange={handleChange}
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                CONTACT
            ================================================= */}

            <section className="lep-edit-section">

              <div className="lep-edit-section-heading">

                <div className="lep-edit-number">
                  02
                </div>

                <div className="lep-edit-section-icon">

                  <SmartIcon
                    name="contacts"
                    size={21}
                  />

                </div>

                <div>

                  <h2>
                    Contact Information
                  </h2>

                  <p>
                    Official institution contact
                    information.
                  </p>

                </div>

              </div>


              <div className="lep-edit-grid">


                <div className="lep-edit-field">

                  <label>

                    <SmartIcon
                      name="phone"
                      size={14}
                    />

                    Phone

                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />

                </div>


                <div className="lep-edit-field">

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
                    value={form.email}
                    onChange={handleChange}
                  />

                </div>


                <div className="lep-edit-field full">

                  <label>

                    <SmartIcon
                      name="globe"
                      size={14}
                    />

                    Website

                  </label>

                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                LOCATION
            ================================================= */}

            <section className="lep-edit-section">

              <div className="lep-edit-section-heading">

                <div className="lep-edit-number">
                  03
                </div>

                <div className="lep-edit-section-icon">

                  <SmartIcon
                    name="location"
                    size={21}
                  />

                </div>

                <div>

                  <h2>
                    Location
                  </h2>

                  <p>
                    Physical location and map
                    coordinates.
                  </p>

                </div>

              </div>


              <div className="lep-edit-grid">


                {/* ADDRESS */}

                <div className="lep-edit-field full">

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
                    value={form.address}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="lep-edit-field">

                  <label>
                    Area
                  </label>

                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                  />

                </div>


                <div className="lep-edit-field">

                  <label>
                    City
                  </label>

                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />

                </div>


                <div className="lep-edit-field">

                  <label>
                    District
                  </label>

                  <input
                    name="district"
                    value={
                      form.district
                    }
                    onChange={handleChange}
                  />

                </div>


                <div className="lep-edit-field">

                  <label>
                    Province
                  </label>

                  <input
                    name="province"
                    value={
                      form.province
                    }
                    onChange={handleChange}
                  />

                </div>


                <div className="lep-edit-field">

                  <label>
                    Country
                  </label>

                  <input
                    name="country"
                    value={
                      form.country
                    }
                    onChange={handleChange}
                  />

                </div>


                {/* LATITUDE */}

                <div className="lep-edit-field">

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
                    min="-90"
                    max="90"
                    step="any"
                    value={
                      form.latitude
                    }
                    onChange={handleChange}
                    placeholder="30.37"
                  />

                  <small>
                    Valid range: -90 to 90
                  </small>

                </div>


                {/* LONGITUDE */}

                <div className="lep-edit-field">

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
                    min="-180"
                    max="180"
                    step="any"
                    value={
                      form.longitude
                    }
                    onChange={handleChange}
                    placeholder="68.60"
                  />

                  <small>
                    Valid range: -180 to 180
                  </small>

                </div>


                <div className="lep-edit-field full">

                  <div className="lep-edit-coordinate-note">

                    <SmartIcon
                      name="location"
                      size={14}
                    />

                    <span>
                      Use decimal coordinates
                      from Google Maps. Latitude
                      must be between -90 and 90,
                      and longitude must be between
                      -180 and 180.
                    </span>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                MEDIA
            ================================================= */}

            <section className="lep-edit-section">

              <div className="lep-edit-section-heading">

                <div className="lep-edit-number">
                  04
                </div>

                <div className="lep-edit-section-icon">

                  <SmartIcon
                    name="document"
                    size={21}
                  />

                </div>

                <div>

                  <h2>
                    Media
                  </h2>

                  <p>
                    Institution logo and cover
                    image URLs.
                  </p>

                </div>

              </div>


              <div className="lep-edit-grid">

                <div className="lep-edit-field">

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
                    onChange={handleChange}
                    placeholder="/uploads/logo.png"
                  />

                </div>


                <div className="lep-edit-field">

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
                    onChange={handleChange}
                    placeholder="/uploads/cover.jpg"
                  />

                </div>

              </div>


              <div className="lep-edit-media-grid">


                <div className="lep-edit-preview">

                  {form.logo_url ? (

                    <img
                      src={
                        form.logo_url.startsWith(
                          "http"
                        )
                          ? form.logo_url
                          : `http://localhost:5000${form.logo_url}`
                      }
                      alt="Logo preview"
                      onError={(
                        event
                      ) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div>

                      <SmartIcon
                        name={config.icon}
                        size={31}
                      />

                      <span>
                        Logo preview
                      </span>

                    </div>

                  )}

                </div>


                <div className="lep-edit-preview">

                  {form.cover_image_url ? (

                    <img
                      src={
                        form.cover_image_url.startsWith(
                          "http"
                        )
                          ? form.cover_image_url
                          : `http://localhost:5000${form.cover_image_url}`
                      }
                      alt="Cover preview"
                      onError={(
                        event
                      ) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div>

                      <SmartIcon
                        name="document"
                        size={31}
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
                STATISTICS
            ================================================= */}

            <section className="lep-edit-section">

              <div className="lep-edit-section-heading">

                <div className="lep-edit-number">
                  05
                </div>

                <div className="lep-edit-section-icon">

                  <SmartIcon
                    name="students"
                    size={21}
                  />

                </div>

                <div>

                  <h2>
                    Statistics
                  </h2>

                  <p>
                    Update verified institution
                    statistics.
                  </p>

                </div>

              </div>


              <div className="lep-edit-grid">

                <div className="lep-edit-field">

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
                    onChange={handleChange}
                  />

                </div>


                <div className="lep-edit-field">

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
                    onChange={handleChange}
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="lep-edit-actions">


              <div className="lep-edit-actions-note">

                <SmartIcon
                  name="verified"
                  size={15}
                />

                <span>
                  Changes will be saved to the
                  institution record.
                </span>

              </div>


              <div className="lep-edit-buttons">

                <Link
                  to={config.adminBase}
                  className="lep-edit-cancel"
                >

                  <SmartIcon
                    name="arrow-left"
                    size={14}
                  />

                  Cancel

                </Link>


                <button
                  type="submit"
                  className="lep-edit-save"
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

const pageStyles = `

  .lep-edit-page {
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
        circle at 6% 70%,
        rgba(255,107,0,.06),
        transparent 22%
      ),
      linear-gradient(
        180deg,
        #f7f9fc,
        #edf3f8
      );
  }


  .lep-edit-container {
    width:
      min(
        1120px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  /* HEADER */

  .lep-edit-header {
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


  .lep-edit-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-edit-page-icon {
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


  .lep-edit-page-icon:hover {
    transform:
      perspective(700px)
      rotateX(0)
      rotateY(0)
      translateY(-4px);
  }


  .lep-edit-eyebrow {
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


  .lep-edit-heading h1 {
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


  .lep-edit-heading p {
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


  .lep-edit-back {
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


  .lep-edit-back:hover {
    transform:
      translateY(-2px);

    border-color:
      #2c5f8a;

    color:
      #2c5f8a;
  }


  /* MESSAGES */

  .lep-edit-message {
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


  .lep-edit-message.error {
    background:
      #fff2f2;

    border:
      1px solid #f1cccc;

    color:
      #b42318;
  }


  .lep-edit-message.success {
    background:
      #effaf2;

    border:
      1px solid #c8e7d0;

    color:
      #16803c;
  }


  /* FORM */

  .lep-edit-form {
    display:
      grid;

    gap:
      16px;
  }


  .lep-edit-section {
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


  .lep-edit-section:hover {
    border-color:
      rgba(44,95,138,.18);

    box-shadow:
      0 18px 38px
      rgba(26,54,93,.075);
  }


  .lep-edit-section::after {
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


  .lep-edit-section-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      21px;
  }


  .lep-edit-number {
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


  .lep-edit-section-icon {
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


  .lep-edit-section:hover
  .lep-edit-section-icon {
    transform:
      perspective(650px)
      rotateX(0)
      rotateY(0)
      translateY(-3px);
  }


  .lep-edit-section-heading h2 {
    color:
      #1a365d;

    font-size:
      20px;

    line-height:
      1.2;
  }


  .lep-edit-section-heading p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;

    line-height:
      1.5;
  }


  /* GRID */

  .lep-edit-grid {
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


  .lep-edit-field {
    display:
      flex;

    flex-direction:
      column;

    gap:
      7px;
  }


  .lep-edit-field.full {
    grid-column:
      1 / -1;
  }


  .lep-edit-field label {
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


  .lep-edit-field label svg {
    color:
      #2c5f8a;
  }


  .lep-edit-field input,
  .lep-edit-field select,
  .lep-edit-field textarea {
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


  .lep-edit-field input:focus,
  .lep-edit-field select:focus,
  .lep-edit-field textarea:focus {
    background:
      #ffffff;

    border-color:
      #2c5f8a;

    box-shadow:
      0 0 0 4px
      rgba(44,95,138,.07);
  }


  .lep-edit-field textarea {
    min-height:
      105px;

    resize:
      vertical;

    line-height:
      1.65;
  }


  .lep-edit-field small {
    color:
      #94a3b8;

    font-size:
      8px;
  }


  /* COORDINATES */

  .lep-edit-coordinate-note {
    display:
      flex;

    align-items:
      flex-start;

    gap:
      8px;

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


  .lep-edit-coordinate-note svg {
    color:
      #ff6b00;

    flex-shrink:
      0;
  }


  /* MEDIA */

  .lep-edit-media-grid {
    display:
      grid;

    grid-template-columns:
      repeat(2,1fr);

    gap:
      11px;

    margin-top:
      14px;
  }


  .lep-edit-preview {
    min-height:
      150px;

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


  .lep-edit-preview img {
    width:
      100%;

    height:
      190px;

    object-fit:
      cover;

    display:
      block;
  }


  .lep-edit-preview > div {
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

    font-size:
      9px;
  }


  .lep-edit-preview svg {
    color:
      #2c5f8a;
  }


  /* ACTIONS */

  .lep-edit-actions {
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


  .lep-edit-actions-note {
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


  .lep-edit-actions-note svg {
    color:
      #ff9348;
  }


  .lep-edit-buttons {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      8px;
  }


  .lep-edit-cancel,
  .lep-edit-save {
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


  .lep-edit-cancel {
    border:
      1px solid
      rgba(255,255,255,.20);

    background:
      rgba(255,255,255,.08);

    color:
      #ffffff;
  }


  .lep-edit-save {
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


  .lep-edit-cancel:hover,
  .lep-edit-save:hover {
    transform:
      translateY(-2px);
  }


  .lep-edit-save:hover {
    background:
      #e65f00;
  }


  /* STATE */

  .lep-edit-state {
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

    text-align:
      center;

    padding:
      40px;

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


  .lep-edit-state-icon {
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


  .lep-edit-state h1 {
    margin-top:
      7px;

    color:
      #1a365d;

    font-size:
      25px;
  }


  .lep-edit-state p {
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


  /* RESPONSIVE */

  @media (max-width: 800px) {

    .lep-edit-header {
      display:
        block;
    }


    .lep-edit-back {
      margin-top:
        16px;
    }


    .lep-edit-grid {
      grid-template-columns:
        1fr;
    }


    .lep-edit-field.full {
      grid-column:
        auto;
    }


    .lep-edit-media-grid {
      grid-template-columns:
        1fr;
    }


    .lep-edit-actions {
      display:
        block;
    }


    .lep-edit-buttons {
      margin-top:
        14px;
    }

  }


  @media (max-width: 550px) {

    .lep-edit-heading {
      align-items:
        flex-start;
    }


    .lep-edit-heading h1 {
      font-size:
        36px;
    }


    .lep-edit-section {
      padding:
        19px;
    }


    .lep-edit-number {
      display:
        none;
    }


    .lep-edit-actions {
      padding:
        17px;
    }


    .lep-edit-buttons {
      display:
        grid;

      grid-template-columns:
        1fr 1fr;
    }


    .lep-edit-cancel,
    .lep-edit-save {
      width:
        100%;
    }

  }
`;


export default EditSchool;