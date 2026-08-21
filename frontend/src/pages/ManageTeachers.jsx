import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


// =========================================================
// INSTITUTION CONFIG
// =========================================================

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


// =========================================================
// COMPONENT
// =========================================================

function ManageTeachers({ type = "school" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const config =
    TYPE_CONFIG[type] ||
    TYPE_CONFIG.school;


  const [institution, setInstitution] =
    useState(null);

  const [teachers, setTeachers] =
    useState([]);


  const [form, setForm] = useState({
    full_name: "",
    gender: "not_specified",
    qualification: "",
    subject: "",
    specialization: "",
    experience_years: 0,
    phone: "",
    email: "",
    profile_photo_url: "",
  });


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(null);


  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const [search, setSearch] =
    useState("");


  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadData = async () => {
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


      const [
        institutionResponse,
        teacherResponse,
      ] = await Promise.all([

        fetch(
          `http://localhost:5000/api/admin/institutions/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        ),

        fetch(
          `http://localhost:5000/api/teachers/institution/${id}`
        ),

      ]);


      const institutionData =
        await institutionResponse.json();


      const teacherData =
        await teacherResponse.json();


      if (
        !institutionResponse.ok ||
        !institutionData.success
      ) {
        throw new Error(
          institutionData.message ||
            `Failed to load ${config.singular.toLowerCase()}.`
        );
      }


      if (
        !teacherResponse.ok ||
        !teacherData.success
      ) {
        throw new Error(
          teacherData.message ||
            "Failed to load teachers."
        );
      }


      const loadedInstitution =
        institutionData.data?.institution;


      if (!loadedInstitution) {
        throw new Error(
          "Institution information was not returned."
        );
      }


      // Prevent using the wrong institution type.
      if (
        loadedInstitution.institution_type &&
        loadedInstitution.institution_type !==
          type
      ) {
        throw new Error(
          `This record is not a ${config.singular.toLowerCase()}.`
        );
      }


      setInstitution(
        loadedInstitution
      );


      setTeachers(
        teacherData.data?.teachers ||
          []
      );

    } catch (err) {

      console.error(
        "Load teachers error:",
        err
      );


      setError(
        err.message ||
          "Failed to load teacher information."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadData();
  }, [id, type]);


  // =========================================================
  // FORM CHANGE
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
  // RESET
  // =========================================================

  const resetForm = () => {

    setForm({
      full_name: "",
      gender: "not_specified",
      qualification: "",
      subject: "",
      specialization: "",
      experience_years: 0,
      phone: "",
      email: "",
      profile_photo_url: "",
    });

  };


  // =========================================================
  // ADD TEACHER
  // =========================================================

  const handleAddTeacher =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      if (!form.full_name.trim()) {

        setError(
          "Teacher name is required."
        );

        return;
      }


      if (
        Number(
          form.experience_years || 0
        ) < 0
      ) {

        setError(
          "Experience cannot be negative."
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
            "http://localhost:5000/api/teachers",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({

                institution_id:
                  Number(id),

                full_name:
                  form.full_name.trim(),

                gender:
                  form.gender,

                qualification:
                  form.qualification.trim() ||
                  null,

                subject:
                  form.subject.trim() ||
                  null,

                specialization:
                  form.specialization.trim() ||
                  null,

                experience_years:
                  Number(
                    form.experience_years ||
                      0
                  ),

                phone:
                  form.phone.trim() ||
                  null,

                email:
                  form.email.trim() ||
                  null,

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
              "Failed to add teacher."
          );

        }


        setSuccess(
          "Teacher added successfully."
        );


        resetForm();


        await loadData();

      } catch (err) {

        console.error(
          "Add teacher error:",
          err
        );


        setError(
          err.message ||
            "Failed to add teacher."
        );

      } finally {

        setSaving(false);

      }
    };


  // =========================================================
  // DELETE TEACHER
  // =========================================================

  const handleDeleteTeacher =
    async (teacherId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete this teacher?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeleting(
          teacherId
        );

        setError("");
        setSuccess("");


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
            `http://localhost:5000/api/teachers/${teacherId}`,
            {
              method: "DELETE",

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
              "Failed to delete teacher."
          );

        }


        setSuccess(
          "Teacher deleted successfully."
        );


        await loadData();

      } catch (err) {

        console.error(
          "Delete teacher error:",
          err
        );


        setError(
          err.message ||
            "Failed to delete teacher."
        );

      } finally {

        setDeleting(null);

      }
    };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredTeachers =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      if (!query) {
        return teachers;
      }


      return teachers.filter(
        (teacher) =>
          teacher.full_name
            ?.toLowerCase()
            .includes(query) ||

          teacher.subject
            ?.toLowerCase()
            .includes(query) ||

          teacher.qualification
            ?.toLowerCase()
            .includes(query) ||

          teacher.specialization
            ?.toLowerCase()
            .includes(query)
      );

    }, [
      teachers,
      search,
    ]);


  // =========================================================
  // METRICS
  // =========================================================

  const qualifiedCount =
    teachers.filter(
      (teacher) =>
        Boolean(
          teacher.qualification
        )
    ).length;


  const subjectCount =
    new Set(
      teachers
        .map(
          (teacher) =>
            teacher.subject
        )
        .filter(Boolean)
    ).size;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-teachers-page">

          <div className="lep-teachers-container">

            <div className="lep-teachers-state">

              <div className="lep-teachers-state-icon">

                <SmartIcon
                  name="teacher"
                  size={28}
                />

              </div>


              <span className="lep-teachers-eyebrow">
                ADMINISTRATION
              </span>


              <h1>
                Loading Teachers...
              </h1>


              <p>
                Please wait while we load
                the teacher information.
              </p>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!institution) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-teachers-page">

          <div className="lep-teachers-container">

            <div className="lep-teachers-state">

              <div className="lep-teachers-state-icon">

                <SmartIcon
                  name="search"
                  size={28}
                />

              </div>


              <span className="lep-teachers-eyebrow">
                ADMINISTRATION
              </span>


              <h1>
                {config.singular} Not Found
              </h1>


              <p>
                {error ||
                  "The institution could not be loaded."}
              </p>


              <Link
                to={config.adminBase}
                className="lep-teachers-primary"
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
      <style>{styles}</style>

      <main className="lep-teachers-page">

        <div className="lep-teachers-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="lep-teachers-header">

            <div className="lep-teachers-heading">

              <div className="lep-teachers-page-icon">

                <SmartIcon
                  name="teacher"
                  size={28}
                />

              </div>


              <div>

                <span className="lep-teachers-eyebrow">

                  <SmartIcon
                    name="dashboard"
                    size={12}
                  />

                  FACULTY MANAGEMENT

                </span>


                <h1>
                  Teachers
                </h1>


                <p>
                  Manage faculty information for{" "}
                  <strong>
                    {institution.name}
                  </strong>.
                </p>

              </div>

            </div>


            <Link
              to={`${config.adminBase}/${id}/manage`}
              className="lep-teachers-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              Manage {config.singular}

            </Link>

          </header>


          {/* =================================================
              MESSAGES
          ================================================= */}

          {error && (

            <div className="lep-teachers-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-teachers-message success">

              <SmartIcon
                name="verified"
                size={15}
              />

              {success}

            </div>

          )}


          {/* =================================================
              METRICS
          ================================================= */}

          <section className="lep-teachers-metrics">

            <div className="lep-teachers-metric">

              <div className="lep-teachers-metric-icon">

                <SmartIcon
                  name="teacher"
                  size={19}
                />

              </div>


              <span>
                TOTAL TEACHERS
              </span>


              <strong>
                {teachers.length}
              </strong>

            </div>


            <div className="lep-teachers-metric">

              <div className="lep-teachers-metric-icon">

                <SmartIcon
                  name="verified"
                  size={19}
                />

              </div>


              <span>
                QUALIFIED
              </span>


              <strong>
                {qualifiedCount}
              </strong>

            </div>


            <div className="lep-teachers-metric">

              <div className="lep-teachers-metric-icon">

                <SmartIcon
                  name="programs"
                  size={19}
                />

              </div>


              <span>
                SUBJECTS
              </span>


              <strong>
                {subjectCount}
              </strong>

            </div>


            <div className="lep-teachers-metric">

              <div className="lep-teachers-metric-icon">

                <SmartIcon
                  name="location"
                  size={19}
                />

              </div>


              <span>
                LOCATION
              </span>


              <strong>
                {institution.city ||
                  "Loralai"}
              </strong>

            </div>

          </section>


          {/* =================================================
              TEACHER DIRECTORY
          ================================================= */}

          <section className="lep-teachers-section">

            <div className="lep-teachers-section-header">

              <div className="lep-teachers-section-icon">

                <SmartIcon
                  name="teacher"
                  size={21}
                />

              </div>


              <div>

                <span>
                  FACULTY DIRECTORY
                </span>


                <h2>
                  Current Teachers
                </h2>


                <p>
                  Teachers associated with this{" "}
                  {config.singular.toLowerCase()}.
                </p>

              </div>

            </div>


            {teachers.length > 0 && (

              <div className="lep-teachers-search">

                <SmartIcon
                  name="search"
                  size={16}
                />


                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search teacher, subject, qualification..."
                />


                <span>
                  {filteredTeachers.length}
                </span>

              </div>

            )}


            {teachers.length === 0 ? (

              <div className="lep-teachers-empty">

                <div className="lep-teachers-empty-icon">

                  <SmartIcon
                    name="teacher"
                    size={28}
                  />

                </div>


                <h3>
                  No Teachers Added
                </h3>


                <p>
                  Start adding verified teacher
                  information using the form below.
                </p>

              </div>

            ) : filteredTeachers.length === 0 ? (

              <div className="lep-teachers-empty">

                <div className="lep-teachers-empty-icon">

                  <SmartIcon
                    name="search"
                    size={28}
                  />

                </div>


                <h3>
                  No Matching Teachers
                </h3>


                <p>
                  Try another search term.
                </p>

              </div>

            ) : (

              <div className="lep-teachers-list">

                {filteredTeachers.map(
                  (teacher) => {

                    const deletingThis =
                      deleting ===
                      teacher.id;


                    const photo =
                      teacher.profile_photo_url;


                    return (

                      <article
                        key={
                          teacher.id
                        }
                        className="lep-teacher-card"
                      >


                        <div className="lep-teacher-avatar">

                          {photo ? (

                            <img
                              src={
                                photo.startsWith(
                                  "http"
                                )
                                  ? photo
                                  : `http://localhost:5000${photo}`
                              }
                              alt={
                                teacher.full_name
                              }
                              onError={(
                                event
                              ) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />

                          ) : (

                            <SmartIcon
                              name="teacher"
                              size={24}
                            />

                          )}

                        </div>


                        <div className="lep-teacher-content">

                          <div className="lep-teacher-title">

                            <h3>
                              {
                                teacher.full_name
                              }
                            </h3>


                            <span>

                              <SmartIcon
                                name="verified"
                                size={10}
                              />

                              Teacher

                            </span>

                          </div>


                          <p className="lep-teacher-subject">

                            <SmartIcon
                              name="programs"
                              size={12}
                            />

                            {teacher.subject ||
                              "Subject not specified"}

                          </p>


                          <p className="lep-teacher-qualification">

                            {teacher.qualification ||
                              "Qualification not specified"}

                          </p>


                          <div className="lep-teacher-details">

                            {teacher.specialization && (

                              <span>

                                <SmartIcon
                                  name="academy"
                                  size={11}
                                />

                                {
                                  teacher.specialization
                                }

                              </span>

                            )}


                            {teacher.experience_years !==
                              null &&
                              teacher.experience_years !==
                                undefined && (

                                <span>

                                  <SmartIcon
                                    name="calendar"
                                    size={11}
                                  />

                                  {
                                    teacher.experience_years
                                  }{" "}
                                  years experience

                                </span>

                              )}

                          </div>

                        </div>


                        <div className="lep-teacher-actions">

                          <button
                            type="button"
                            className="lep-teacher-view"
                            onClick={() => {
                              window.alert(
                                `Teacher: ${teacher.full_name}\nSubject: ${
                                  teacher.subject ||
                                  "Not specified"
                                }\nQualification: ${
                                  teacher.qualification ||
                                  "Not specified"
                                }`
                              );
                            }}
                          >

                            <SmartIcon
                              name="search"
                              size={12}
                            />

                            View

                          </button>


                          <button
                            type="button"
                            className="lep-teacher-delete"
                            onClick={() =>
                              handleDeleteTeacher(
                                teacher.id
                              )
                            }
                            disabled={
                              deletingThis
                            }
                          >

                            <SmartIcon
                              name="delete"
                              size={12}
                            />

                            {deletingThis
                              ? "Deleting..."
                              : "Delete"}

                          </button>

                        </div>

                      </article>

                    );

                  }
                )}

              </div>

            )}

          </section>


          {/* =================================================
              ADD TEACHER
          ================================================= */}

          <section className="lep-teachers-section">

            <div className="lep-teachers-section-header">

              <div className="lep-teachers-section-icon">

                <SmartIcon
                  name="plus"
                  size={21}
                />

              </div>


              <div>

                <span>
                  ADD TEACHER
                </span>


                <h2>
                  New Teacher
                </h2>


                <p>
                  Enter verified faculty information
                  for this {config.singular.toLowerCase()}.
                </p>

              </div>

            </div>


            <form
              className="lep-teachers-form"
              onSubmit={
                handleAddTeacher
              }
            >

              <div className="lep-teachers-grid">


                <div className="lep-teacher-field">

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


                <div className="lep-teacher-field">

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


                <div className="lep-teacher-field">

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
                    placeholder="M.Ed"
                  />

                </div>


                <div className="lep-teacher-field">

                  <label>

                    <SmartIcon
                      name="programs"
                      size={14}
                    />

                    Subject

                  </label>


                  <input
                    name="subject"
                    value={
                      form.subject
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Mathematics"
                  />

                </div>


                <div className="lep-teacher-field">

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


                <div className="lep-teacher-field">

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


                <div className="lep-teacher-field">

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


                <div className="lep-teacher-field">

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
                    placeholder="teacher@example.com"
                  />

                </div>


                <div className="lep-teacher-field full">

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
                    placeholder="/uploads/teachers/photo.jpg"
                  />

                </div>

              </div>


              <div className="lep-teachers-form-actions">

                <div className="lep-teachers-form-note">

                  <SmartIcon
                    name="verified"
                    size={15}
                  />

                  <span>
                    Add only verified teacher
                    information.
                  </span>

                </div>


                <button
                  type="submit"
                  className="lep-teachers-save"
                  disabled={
                    saving
                  }
                >

                  <SmartIcon
                    name={
                      saving
                        ? "settings"
                        : "plus"
                    }
                    size={14}
                  />

                  {saving
                    ? "Saving..."
                    : "Add Teacher"}

                </button>

              </div>

            </form>

          </section>


        </div>

      </main>
    </>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = `

  .lep-teachers-page {
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


  .lep-teachers-container {
    width:
      min(
        1120px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  .lep-teachers-header {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      24px;

    margin-bottom:
      25px;
  }


  .lep-teachers-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-teachers-page-icon {
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
  }


  .lep-teachers-eyebrow {
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


  .lep-teachers-heading h1 {
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


  .lep-teachers-heading p {
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


  .lep-teachers-heading p strong {
    color:
      #1a365d;
  }


  .lep-teachers-back {
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


  .lep-teachers-message {
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


  .lep-teachers-message.error {
    background:
      #fff2f2;

    border:
      1px solid #f1cccc;

    color:
      #b42318;
  }


  .lep-teachers-message.success {
    background:
      #effaf2;

    border:
      1px solid #c8e7d0;

    color:
      #16803c;
  }


  .lep-teachers-metrics {
    display:
      grid;

    grid-template-columns:
      repeat(4,1fr);

    gap:
      12px;

    margin:
      22px 0;
  }


  .lep-teachers-metric {
    min-height:
      116px;

    padding:
      18px;

    background:
      #ffffff;

    border:
      1px solid #e2e8f0;

    border-radius:
      14px;

    box-shadow:
      0 10px 27px
      rgba(26,54,93,.055);

    transition:
      transform .3s ease,
      box-shadow .3s ease;
  }


  .lep-teachers-metric:hover {
    transform:
      translateY(-4px);

    box-shadow:
      0 21px 44px
      rgba(26,54,93,.10);
  }


  .lep-teachers-metric-icon {
    width:
      39px;

    height:
      39px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      10px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 7px 0 #142b47;
  }


  .lep-teachers-metric span {
    display:
      block;

    margin-top:
      9px;

    color:
      #94a3b8;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1px;
  }


  .lep-teachers-metric strong {
    display:
      block;

    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-teachers-section {
    margin-top:
      17px;

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


  .lep-teachers-section-header {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      20px;
  }


  .lep-teachers-section-icon {
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
  }


  .lep-teachers-section-header span {
    display:
      block;

    color:
      #ff6b00;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.2px;
  }


  .lep-teachers-section-header h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      21px;
  }


  .lep-teachers-section-header p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;
  }


  .lep-teachers-search {
    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    min-height:
      46px;

    margin-bottom:
      15px;

    padding:
      0 13px;

    border:
      1px solid #e2e8f0;

    border-radius:
      9px;

    background:
      #fbfdff;
  }


  .lep-teachers-search svg {
    color:
      #2c5f8a;
  }


  .lep-teachers-search input {
    width:
      100%;

    border:
      none;

    outline:
      none;

    background:
      transparent;

    color:
      #2d3748;

    font-family:
      inherit;

    font-size:
      11px;
  }


  .lep-teachers-search span {
    min-width:
      28px;

    padding:
      5px 7px;

    border-radius:
      6px;

    background:
      #1a365d;

    color:
      #ff9348;

    text-align:
      center;

    font-size:
      8px;

    font-weight:
      900;
  }


  .lep-teachers-list {
    display:
      grid;

    gap:
      10px;
  }


  .lep-teacher-card {
    display:
      grid;

    grid-template-columns:
      54px
      minmax(0,1fr)
      auto;

    gap:
      13px;

    align-items:
      center;

    padding:
      15px;

    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f4f8fb
      );

    border:
      1px solid #e2e8f0;

    border-radius:
      13px;

    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease;
  }


  .lep-teacher-card:hover {
    transform:
      translateY(-3px);

    box-shadow:
      0 17px 34px
      rgba(26,54,93,.09);

    border-color:
      rgba(44,95,138,.20);
  }


  .lep-teacher-avatar {
    width:
      54px;

    height:
      54px;

    display:
      grid;

    place-items:
      center;

    overflow:
      hidden;

    border-radius:
      13px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 7px 0 #142b47;
  }


  .lep-teacher-avatar img {
    width:
      100%;

    height:
      100%;

    object-fit:
      cover;
  }


  .lep-teacher-title {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;
  }


  .lep-teacher-title h3 {
    color:
      #1a365d;

    font-size:
      15px;
  }


  .lep-teacher-title span {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      4px;

    padding:
      5px 7px;

    border-radius:
      6px;

    background:
      #eaf7ee;

    color:
      #16803c;

    font-size:
      7px;

    font-weight:
      900;

    text-transform:
      uppercase;
  }


  .lep-teacher-subject {
    display:
      flex;

    align-items:
      center;

    gap:
      5px;

    margin-top:
      5px;

    color:
      #2c5f8a;

    font-size:
      9px;

    font-weight:
      800;
  }


  .lep-teacher-qualification {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      9px;
  }


  .lep-teacher-details {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      10px;

    margin-top:
      6px;
  }


  .lep-teacher-details span {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      4px;

    color:
      #94a3b8;

    font-size:
      8px;
  }


  .lep-teacher-actions {
    display:
      flex;

    flex-wrap:
      wrap;

    justify-content:
      flex-end;

    gap:
      7px;
  }


  .lep-teacher-view,
  .lep-teacher-delete {
    min-height:
      34px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      5px;

    padding:
      0 9px;

    border-radius:
      8px;

    font-family:
      inherit;

    font-size:
      8px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  .lep-teacher-view {
    border:
      1px solid #dce4ec;

    background:
      #ffffff;

    color:
      #1a365d;
  }


  .lep-teacher-delete {
    border:
      1px solid #f0caca;

    background:
      #fff7f7;

    color:
      #b42318;
  }


  .lep-teachers-empty,
  .lep-teachers-state {
    min-height:
      260px;

    display:
      flex;

    flex-direction:
      column;

    align-items:
      center;

    justify-content:
      center;

    padding:
      35px;

    text-align:
      center;

    border:
      1px solid #e7edf2;

    border-radius:
      13px;

    background:
      #f9fbfd;
  }


  .lep-teachers-empty-icon,
  .lep-teachers-state-icon {
    width:
      58px;

    height:
      58px;

    display:
      grid;

    place-items:
      center;

    margin-bottom:
      13px;

    border-radius:
      14px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 10px 22px
      rgba(26,54,93,.14);
  }


  .lep-teachers-empty h3,
  .lep-teachers-state h1 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-teachers-empty p,
  .lep-teachers-state p {
    max-width:
      480px;

    margin-top:
      7px;

    color:
      #718096;

    font-size:
      11px;

    line-height:
      1.6;
  }


  .lep-teachers-primary {
    min-height:
      40px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      7px;

    margin-top:
      17px;

    padding:
      0 13px;

    border-radius:
      9px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ffffff;

    text-decoration:
      none;

    font-size:
      10px;

    font-weight:
      900;
  }


  .lep-teachers-form {
    display:
      grid;

    gap:
      15px;
  }


  .lep-teachers-grid {
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


  .lep-teacher-field {
    display:
      flex;

    flex-direction:
      column;

    gap:
      7px;
  }


  .lep-teacher-field.full {
    grid-column:
      1 / -1;
  }


  .lep-teacher-field label {
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


  .lep-teacher-field label svg {
    color:
      #2c5f8a;
  }


  .lep-teacher-field input,
  .lep-teacher-field select {
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


  .lep-teacher-field input:focus,
  .lep-teacher-field select:focus {
    background:
      #ffffff;

    border-color:
      #2c5f8a;

    box-shadow:
      0 0 0 4px
      rgba(44,95,138,.07);
  }


  .lep-teachers-form-actions {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      15px;

    padding:
      17px 18px;

    background:
      #1a365d;

    border-radius:
      13px;
  }


  .lep-teachers-form-note {
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


  .lep-teachers-form-note svg {
    color:
      #ff9348;
  }


  .lep-teachers-save {
    min-height:
      40px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      7px;

    padding:
      0 14px;

    border:
      none;

    border-radius:
      9px;

    background:
      #ff6b00;

    color:
      #ffffff;

    font-family:
      inherit;

    font-size:
      10px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  .lep-teachers-save:hover {
    background:
      #e65f00;
  }


  @media (max-width: 900px) {

    .lep-teachers-header {
      display:
        block;
    }


    .lep-teachers-back {
      margin-top:
        16px;
    }


    .lep-teachers-metrics {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-teacher-card {
      grid-template-columns:
        54px
        minmax(0,1fr);
    }


    .lep-teacher-actions {
      grid-column:
        1 / -1;

      justify-content:
        flex-start;
    }

  }


  @media (max-width: 650px) {

    .lep-teachers-heading {
      align-items:
        flex-start;
    }


    .lep-teachers-heading h1 {
      font-size:
        37px;
    }


    .lep-teachers-metrics {
      grid-template-columns:
        1fr;
    }


    .lep-teachers-grid {
      grid-template-columns:
        1fr;
    }


    .lep-teacher-field.full {
      grid-column:
        auto;
    }


    .lep-teachers-section {
      padding:
        19px;
    }


    .lep-teachers-form-actions {
      display:
        block;
    }


    .lep-teachers-save {
      width:
        100%;

      margin-top:
        12px;
    }

  }

`;

export default ManageTeachers;