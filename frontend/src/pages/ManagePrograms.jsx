import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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


function ManagePrograms({ type }) {

  const { id } = useParams();

  const navigate = useNavigate();

  const config =
    TYPE_CONFIG[type];


  const [institution, setInstitution] =
    useState(null);

  const [programs, setPrograms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    level: "",
    description: "",
  });


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


      const institutionResponse =
        await fetch(
          `http://localhost:5000/api/admin/institutions/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const institutionData =
        await institutionResponse.json();


      if (
        !institutionResponse.ok ||
        !institutionData.success
      ) {
        throw new Error(
          institutionData.message ||
            "Failed to load institution."
        );
      }


      const loadedInstitution =
        institutionData.data?.institution;


      if (!loadedInstitution) {
        throw new Error(
          "Institution not found."
        );
      }


      if (
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


      // Programs are public-readable in the
      // existing backend API.
      const programsResponse =
        await fetch(
          `http://localhost:5000/api/programs/institution/${id}`
        );


      const programsData =
        await programsResponse.json();


      if (
        !programsResponse.ok ||
        !programsData.success
      ) {
        throw new Error(
          programsData.message ||
            "Failed to load programs."
        );
      }


      setPrograms(
        programsData.data?.programs ||
          []
      );

    } catch (err) {

      console.error(
        "Load programs error:",
        err
      );


      setError(
        err.message ||
          "Failed to load academic programs."
      );


      setInstitution(null);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    if (!config) {

      setLoading(false);

      setError(
        "Invalid institution type."
      );

      return;
    }


    loadData();

  }, [
    id,
    type,
  ]);


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
      name: "",
      level: "",
      description: "",
    });

    setEditingId(null);

  };


  // =========================================================
  // EDIT
  // =========================================================

  const startEdit = (
    program
  ) => {

    setEditingId(
      program.id
    );


    setForm({
      name:
        program.name || "",

      level:
        program.level || "",

      description:
        program.description || "",
    });


    setSuccess("");
    setError("");


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =========================================================
  // SAVE
  // =========================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      if (
        !form.name.trim()
      ) {

        setError(
          "Program name is required."
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


        const payload = {

          name:
            form.name.trim(),

          level:
            form.level.trim() ||
            null,

          description:
            form.description.trim() ||
            null,

        };


        let response;


        // CREATE

        if (!editingId) {

          response =
            await fetch(
              "http://localhost:5000/api/programs",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify({
                    institution_id:
                      Number(id),

                    ...payload,
                  }),
              }
            );

        }


        // UPDATE

        else {

          response =
            await fetch(
              `http://localhost:5000/api/programs/${editingId}`,
              {
                method: "PUT",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`,
                },

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );

        }


        const data =
          await response.json();


        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to save program."
          );
        }


        setSuccess(
          editingId
            ? "Program updated successfully."
            : "Program added successfully."
        );


        resetForm();


        await loadProgramsOnly();

      } catch (err) {

        console.error(
          "Save program error:",
          err
        );


        setError(
          err.message ||
            "Failed to save program."
        );

      } finally {

        setSaving(false);

      }

    };


  // =========================================================
  // REFRESH PROGRAMS
  // =========================================================

  const loadProgramsOnly =
    async () => {

      try {

        const response =
          await fetch(
            `http://localhost:5000/api/programs/institution/${id}`
          );


        const data =
          await response.json();


        if (
          response.ok &&
          data.success
        ) {

          setPrograms(
            data.data?.programs ||
              []
          );

        }

      } catch (err) {

        console.error(
          "Refresh programs error:",
          err
        );

      }

    };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (
    program
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${program.name}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(
        program.id
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
          `http://localhost:5000/api/programs/${program.id}`,
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
            "Failed to delete program."
        );
      }


      setSuccess(
        "Program deleted successfully."
      );


      if (
        editingId ===
        program.id
      ) {
        resetForm();
      }


      await loadProgramsOnly();

    } catch (err) {

      console.error(
        "Delete program error:",
        err
      );


      setError(
        err.message ||
          "Failed to delete program."
      );

    } finally {

      setDeletingId(null);

    }

  };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredPrograms =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      if (!query) {
        return programs;
      }


      return programs.filter(
        (program) =>
          program.name
            ?.toLowerCase()
            .includes(query) ||
          program.level
            ?.toLowerCase()
            .includes(query) ||
          program.description
            ?.toLowerCase()
            .includes(query)
      );

    }, [
      programs,
      search,
    ]);


  // =========================================================
  // INVALID TYPE
  // =========================================================

  if (!config) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-programs-page">

          <div className="lep-programs-container">

            <div className="lep-programs-state">

              <div className="lep-programs-state-icon">

                <SmartIcon
                  name="warning"
                  size={27}
                />

              </div>

              <span className="lep-programs-eyebrow">
                ADMINISTRATION
              </span>

              <h1>
                Invalid Institution Type
              </h1>

              <p>
                The requested institution
                type is not supported.
              </p>

              <Link
                to="/admin"
                className="lep-programs-primary"
              >
                <SmartIcon
                  name="arrow-left"
                  size={14}
                />

                Admin Dashboard
              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-programs-page">

          <div className="lep-programs-container">

            <div className="lep-programs-state">

              <div className="lep-programs-state-icon">

                <SmartIcon
                  name="programs"
                  size={27}
                />

              </div>

              <span className="lep-programs-eyebrow">
                ACADEMIC PROGRAMS
              </span>

              <h1>
                Loading Programs...
              </h1>

              <p>
                Please wait while we load
                the academic program information.
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

        <main className="lep-programs-page">

          <div className="lep-programs-container">

            <div className="lep-programs-state">

              <div className="lep-programs-state-icon">

                <SmartIcon
                  name="search"
                  size={27}
                />

              </div>

              <span className="lep-programs-eyebrow">
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
                className="lep-programs-primary"
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

      <main className="lep-programs-page">

        <div className="lep-programs-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-programs-header">

            <div className="lep-programs-heading">

              <div className="lep-programs-page-icon">

                <SmartIcon
                  name="programs"
                  size={28}
                />

              </div>


              <div>

                <span className="lep-programs-eyebrow">

                  <SmartIcon
                    name="academy"
                    size={12}
                  />

                  ACADEMIC MANAGEMENT

                </span>


                <h1>
                  Academic Programs
                </h1>


                <p>
                  Manage academic programs for{" "}
                  <strong>
                    {institution.name}
                  </strong>.
                </p>

              </div>

            </div>


            <button
              type="button"
              className="lep-programs-back"
              onClick={() =>
                navigate(
                  `${config.adminBase}/${institution.id}/manage`
                )
              }
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              Back to Management

            </button>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-programs-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-programs-message success">

              <SmartIcon
                name="verified"
                size={15}
              />

              {success}

            </div>

          )}


          {/* =====================================================
              STATS
          ===================================================== */}

          <section className="lep-programs-metrics">

            <div className="lep-programs-metric">

              <div className="lep-programs-metric-icon">

                <SmartIcon
                  name={config.icon}
                  size={19}
                />

              </div>

              <span>
                INSTITUTION
              </span>

              <strong>
                {config.singular}
              </strong>

            </div>


            <div className="lep-programs-metric">

              <div className="lep-programs-metric-icon">

                <SmartIcon
                  name="programs"
                  size={19}
                />

              </div>

              <span>
                TOTAL PROGRAMS
              </span>

              <strong>
                {programs.length}
              </strong>

            </div>


            <div className="lep-programs-metric">

              <div className="lep-programs-metric-icon">

                <SmartIcon
                  name="verified"
                  size={19}
                />

              </div>

              <span>
                STATUS
              </span>

              <strong>
                {institution.status ||
                  "Draft"}
              </strong>

            </div>


            <div className="lep-programs-metric">

              <div className="lep-programs-metric-icon">

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


          {/* =====================================================
              PROGRAM FORM
          ===================================================== */}

          <section className="lep-programs-section">

            <div className="lep-programs-section-header">

              <div className="lep-programs-section-icon">

                <SmartIcon
                  name={
                    editingId
                      ? "edit"
                      : "plus"
                  }
                  size={21}
                />

              </div>


              <div>

                <span>
                  {editingId
                    ? "EDIT PROGRAM"
                    : "ADD PROGRAM"}
                </span>


                <h2>
                  {editingId
                    ? "Edit Academic Program"
                    : "Add Academic Program"}
                </h2>


                <p>
                  Enter clear and accurate
                  academic information.
                </p>

              </div>

            </div>


            <form
              className="lep-programs-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="lep-programs-grid">


                {/* PROGRAM NAME */}

                <div className="lep-programs-field full">

                  <label>

                    <SmartIcon
                      name="programs"
                      size={14}
                    />

                    Program Name *

                  </label>


                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. BS Computer Science"
                    required
                  />

                </div>


                {/* LEVEL */}

                <div className="lep-programs-field">

                  <label>

                    <SmartIcon
                      name="academy"
                      size={14}
                    />

                    Level

                  </label>


                  <input
                    name="level"
                    value={
                      form.level
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Undergraduate"
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="lep-programs-field full">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Description

                  </label>


                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    rows="6"
                    placeholder="Describe the academic program..."
                  />

                </div>

              </div>


              {/* FORM BUTTONS */}

              <div className="lep-programs-form-actions">


                {editingId && (

                  <button
                    type="button"
                    className="lep-programs-cancel"
                    onClick={
                      resetForm
                    }
                    disabled={
                      saving
                    }
                  >

                    <SmartIcon
                      name="arrow-left"
                      size={14}
                    />

                    Cancel Edit

                  </button>

                )}


                <button
                  type="submit"
                  className="lep-programs-save"
                  disabled={
                    saving
                  }
                >

                  <SmartIcon
                    name={
                      saving
                        ? "settings"
                        : editingId
                        ? "edit"
                        : "plus"
                    }
                    size={14}
                  />

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Program"
                    : "Add Program"}

                </button>

              </div>

            </form>

          </section>


          {/* =====================================================
              DIRECTORY
          ===================================================== */}

          <section className="lep-programs-section">


            <div className="lep-programs-directory-header">

              <div className="lep-programs-section-header">

                <div className="lep-programs-section-icon">

                  <SmartIcon
                    name="programs"
                    size={21}
                  />

                </div>


                <div>

                  <span>
                    PROGRAM DIRECTORY
                  </span>


                  <h2>
                    Academic Programs
                  </h2>


                  <p>
                    {programs.length === 0
                      ? "No programs have been added yet."
                      : `${programs.length} ${
                          programs.length === 1
                            ? "program"
                            : "programs"
                        } currently available.`}
                  </p>

                </div>

              </div>


              {programs.length > 0 && (

                <div className="lep-programs-count">

                  <span>
                    TOTAL
                  </span>

                  <strong>
                    {filteredPrograms.length}
                  </strong>

                </div>

              )}

            </div>


            {/* SEARCH */}

            {programs.length > 0 && (

              <div className="lep-programs-search">

                <SmartIcon
                  name="search"
                  size={16}
                />

                <input
                  type="text"
                  value={
                    search
                  }
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search programs, levels or descriptions..."
                />

              </div>

            )}


            {/* EMPTY */}

            {programs.length === 0 ? (

              <div className="lep-programs-empty">

                <div className="lep-programs-empty-icon">

                  <SmartIcon
                    name="programs"
                    size={28}
                  />

                </div>


                <h3>
                  No Programs Added Yet
                </h3>


                <p>
                  Use the form above to add
                  the first academic program.
                </p>

              </div>

            ) : filteredPrograms.length === 0 ? (

              <div className="lep-programs-empty">

                <div className="lep-programs-empty-icon">

                  <SmartIcon
                    name="search"
                    size={28}
                  />

                </div>


                <h3>
                  No Matching Programs
                </h3>


                <p>
                  Try another search term.
                </p>

              </div>

            ) : (

              <div className="lep-programs-list">

                {filteredPrograms.map(
                  (program) => {

                    const processing =
                      deletingId ===
                      program.id;


                    return (

                      <article
                        key={
                          program.id
                        }
                        className="lep-program-card"
                      >


                        <div className="lep-program-card-icon">

                          <SmartIcon
                            name="programs"
                            size={22}
                          />

                        </div>


                        <div className="lep-program-card-content">

                          <div className="lep-program-card-title">

                            <h3>
                              {program.name}
                            </h3>


                            <span>

                              <SmartIcon
                                name="verified"
                                size={10}
                              />

                              Program

                            </span>

                          </div>


                          {program.level && (

                            <p className="lep-program-level">

                              <SmartIcon
                                name="academy"
                                size={12}
                              />

                              Level:{" "}
                              {program.level}

                            </p>

                          )}


                          {program.description && (

                            <p className="lep-program-description">
                              {
                                program.description
                              }
                            </p>

                          )}

                        </div>


                        <div className="lep-program-card-actions">


                          <button
                            type="button"
                            className="lep-program-edit"
                            onClick={() =>
                              startEdit(
                                program
                              )
                            }
                          >

                            <SmartIcon
                              name="edit"
                              size={12}
                            />

                            Edit

                          </button>


                          <button
                            type="button"
                            className="lep-program-delete"
                            onClick={() =>
                              handleDelete(
                                program
                              )
                            }
                            disabled={
                              processing
                            }
                          >

                            <SmartIcon
                              name="delete"
                              size={12}
                            />

                            {processing
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

        </div>

      </main>
    </>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = `

  .lep-programs-page {
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


  .lep-programs-container {
    width:
      min(
        1120px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  /* HEADER */

  .lep-programs-header {
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


  .lep-programs-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-programs-page-icon {
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


  .lep-programs-eyebrow {
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


  .lep-programs-heading h1 {
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


  .lep-programs-heading p {
    margin-top:
      9px;

    color:
      #718096;

    font-size:
      12px;

    line-height:
      1.7;
  }


  .lep-programs-back {
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

    font-family:
      inherit;

    font-size:
      10px;

    font-weight:
      900;

    cursor:
      pointer;

    box-shadow:
      0 8px 20px
      rgba(26,54,93,.05);

    transition:
      transform .2s ease,
      border-color .2s ease;
  }


  .lep-programs-back:hover {
    transform:
      translateY(-2px);

    border-color:
      #2c5f8a;
  }


  /* MESSAGES */

  .lep-programs-message {
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


  .lep-programs-message.error {
    background:
      #fff2f2;

    border:
      1px solid #f1cccc;

    color:
      #b42318;
  }


  .lep-programs-message.success {
    background:
      #effaf2;

    border:
      1px solid #c8e7d0;

    color:
      #16803c;
  }


  /* METRICS */

  .lep-programs-metrics {
    display:
      grid;

    grid-template-columns:
      repeat(4,1fr);

    gap:
      12px;

    margin:
      22px 0;
  }


  .lep-programs-metric {
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


  .lep-programs-metric:hover {
    transform:
      translateY(-4px);

    box-shadow:
      0 21px 44px
      rgba(26,54,93,.10);
  }


  .lep-programs-metric-icon {
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


  .lep-programs-metric span {
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


  .lep-programs-metric strong {
    display:
      block;

    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      20px;
  }


  /* SECTIONS */

  .lep-programs-section {
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


  .lep-programs-section-header {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      21px;
  }


  .lep-programs-section-icon {
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


  .lep-programs-section-header span {
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


  .lep-programs-section-header h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      21px;
  }


  .lep-programs-section-header p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;
  }


  /* FORM */

  .lep-programs-form {
    display:
      grid;

    gap:
      14px;
  }


  .lep-programs-grid {
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


  .lep-programs-field {
    display:
      flex;

    flex-direction:
      column;

    gap:
      7px;
  }


  .lep-programs-field.full {
    grid-column:
      1 / -1;
  }


  .lep-programs-field label {
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


  .lep-programs-field label svg {
    color:
      #2c5f8a;
  }


  .lep-programs-field input,
  .lep-programs-field textarea {
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


  .lep-programs-field input:focus,
  .lep-programs-field textarea:focus {
    background:
      #ffffff;

    border-color:
      #2c5f8a;

    box-shadow:
      0 0 0 4px
      rgba(44,95,138,.07);
  }


  .lep-programs-field textarea {
    min-height:
      110px;

    resize:
      vertical;

    line-height:
      1.65;
  }


  .lep-programs-form-actions {
    display:
      flex;

    justify-content:
      flex-end;

    gap:
      8px;

    padding-top:
      3px;
  }


  .lep-programs-cancel,
  .lep-programs-save {
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

    border-radius:
      9px;

    font-family:
      inherit;

    font-size:
      10px;

    font-weight:
      900;

    cursor:
      pointer;

    transition:
      transform .2s ease,
      background .2s ease;
  }


  .lep-programs-cancel {
    border:
      1px solid #dce4ec;

    background:
      #ffffff;

    color:
      #1a365d;
  }


  .lep-programs-save {
    border:
      none;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ffffff;

    box-shadow:
      0 8px 18px
      rgba(26,54,93,.14);
  }


  .lep-programs-save:hover {
    transform:
      translateY(-2px);

    background:
      linear-gradient(
        135deg,
        #ff6b00,
        #e65f00
      );
  }


  .lep-programs-cancel:hover {
    transform:
      translateY(-2px);
  }


  /* DIRECTORY HEADER */

  .lep-programs-directory-header {
    display:
      flex;

    align-items:
      flex-start;

    justify-content:
      space-between;

    gap:
      20px;
  }


  .lep-programs-count {
    min-width:
      85px;

    padding:
      10px 12px;

    border-radius:
      9px;

    background:
      #f1f5f9;

    text-align:
      center;
  }


  .lep-programs-count span {
    display:
      block;

    color:
      #94a3b8;

    font-size:
      7px;

    font-weight:
      900;
  }


  .lep-programs-count strong {
    display:
      block;

    margin-top:
      3px;

    color:
      #1a365d;

    font-size:
      18px;
  }


  /* SEARCH */

  .lep-programs-search {
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


  .lep-programs-search svg {
    color:
      #2c5f8a;
  }


  .lep-programs-search input {
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


  /* PROGRAM LIST */

  .lep-programs-list {
    display:
      grid;

    gap:
      10px;
  }


  .lep-program-card {
    display:
      grid;

    grid-template-columns:
      48px
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
      12px;

    transition:
      transform .25s ease,
      box-shadow .25s ease,
      border-color .25s ease;
  }


  .lep-program-card:hover {
    transform:
      translateY(-3px);

    box-shadow:
      0 16px 32px
      rgba(26,54,93,.08);

    border-color:
      rgba(44,95,138,.20);
  }


  .lep-program-card-icon {
    width:
      48px;

    height:
      48px;

    display:
      grid;

    place-items:
      center;

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
      0 7px 0 #142b47,
      0 12px 20px
      rgba(26,54,93,.12);
  }


  .lep-program-card-title {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;
  }


  .lep-program-card-title h3 {
    color:
      #1a365d;

    font-size:
      15px;

    line-height:
      1.3;
  }


  .lep-program-card-title span {
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


  .lep-program-level {
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


  .lep-program-description {
    margin-top:
      5px;

    color:
      #718096;

    font-size:
      10px;

    line-height:
      1.55;
  }


  .lep-program-card-actions {
    display:
      flex;

    flex-wrap:
      wrap;

    justify-content:
      flex-end;

    gap:
      7px;
  }


  .lep-program-edit,
  .lep-program-delete {
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

    transition:
      transform .2s ease,
      background .2s ease;
  }


  .lep-program-edit {
    border:
      1px solid #dce4ec;

    background:
      #ffffff;

    color:
      #1a365d;
  }


  .lep-program-delete {
    border:
      1px solid #f0caca;

    background:
      #fff7f7;

    color:
      #b42318;
  }


  .lep-program-edit:hover,
  .lep-program-delete:hover {
    transform:
      translateY(-2px);
  }


  /* EMPTY / STATE */

  .lep-programs-empty,
  .lep-programs-state {
    min-height:
      280px;

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

    border:
      1px solid #e7edf2;

    border-radius:
      13px;

    background:
      #f9fbfd;
  }


  .lep-programs-empty-icon,
  .lep-programs-state-icon {
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


  .lep-programs-empty h3,
  .lep-programs-state h1 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-programs-empty p,
  .lep-programs-state p {
    max-width:
      470px;

    margin-top:
      7px;

    color:
      #718096;

    font-size:
      11px;

    line-height:
      1.6;
  }


  .lep-programs-primary {
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


  /* RESPONSIVE */

  @media (max-width: 850px) {

    .lep-programs-header {
      display:
        block;
    }


    .lep-programs-back {
      margin-top:
        16px;
    }


    .lep-programs-metrics {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-program-card {
      grid-template-columns:
        48px
        minmax(0,1fr);
    }


    .lep-program-card-actions {
      grid-column:
        1 / -1;

      justify-content:
        flex-start;
    }

  }


  @media (max-width: 650px) {

    .lep-programs-heading {
      align-items:
        flex-start;
    }


    .lep-programs-heading h1 {
      font-size:
        37px;
    }


    .lep-programs-metrics {
      grid-template-columns:
        1fr;
    }


    .lep-programs-grid {
      grid-template-columns:
        1fr;
    }


    .lep-programs-field.full {
      grid-column:
        auto;
    }


    .lep-programs-section {
      padding:
        19px;
    }


    .lep-programs-directory-header {
      display:
        block;
    }


    .lep-programs-count {
      display:
        inline-block;

      margin-top:
        10px;
    }

  }

`;

export default ManagePrograms;