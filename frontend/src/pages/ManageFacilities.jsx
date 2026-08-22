import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


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


function ManageFacilities({
  type = "school",
}) {
  const { id } = useParams();

  const config =
    TYPE_CONFIG[type] ||
    TYPE_CONFIG.school;


  const [institution, setInstitution] =
    useState(null);

  const [facilities, setFacilities] =
    useState([]);


  const [facilityName, setFacilityName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [available, setAvailable] =
    useState(true);

  const [search, setSearch] =
    useState("");


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
        facilityResponse,
      ] = await Promise.all([

        fetch(
          `${API_URL}/api/admin/institutions/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        ),

        fetch(
          `${API_URL}/api/facilities/institution/${id}`
        ),

      ]);


      const institutionData =
        await institutionResponse.json();

      const facilityData =
        await facilityResponse.json();


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
        !facilityResponse.ok ||
        !facilityData.success
      ) {
        throw new Error(
          facilityData.message ||
            "Failed to load facilities."
        );
      }


      const loadedInstitution =
        institutionData.data?.institution;


      if (!loadedInstitution) {
        throw new Error(
          "Institution information was not returned."
        );
      }


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


      setFacilities(
        facilityData.data?.facilities ||
          []
      );

    } catch (err) {

      console.error(
        "Load facilities error:",
        err
      );


      setError(
        err.message ||
          "Failed to load facility information."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadData();
  }, [id, type]);


  // =========================================================
  // ADD FACILITY
  // =========================================================

  const handleAddFacility =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");


      if (!facilityName.trim()) {
        setError(
          "Facility name is required."
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
            `${API_URL}/api/facilities`,
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

                facility_name:
                  facilityName.trim(),

                description:
                  description.trim() ||
                  null,

                available,

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
              "Failed to add facility."
          );
        }


        setSuccess(
          "Facility added successfully."
        );


        setFacilityName("");
        setDescription("");
        setAvailable(true);


        await loadData();

    } catch (err) {

      console.error(
        "Add facility error:",
        err
      );


      setError(
        err.message ||
          "Failed to add facility."
      );

    } finally {

      setSaving(false);

    }
  };


  // =========================================================
  // DELETE FACILITY
  // =========================================================

  const handleDeleteFacility =
    async (facilityId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete this facility?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeleting(
          facilityId
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
            `${API_URL}/api/facilities/${facilityId}`,
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
              "Failed to delete facility."
          );
        }


        setSuccess(
          "Facility deleted successfully."
        );


        await loadData();

    } catch (err) {

      console.error(
        "Delete facility error:",
        err
      );


      setError(
        err.message ||
          "Failed to delete facility."
      );

    } finally {

      setDeleting(null);

    }
  };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredFacilities =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      if (!query) {
        return facilities;
      }


      return facilities.filter(
        (facility) =>
          facility.facility_name
            ?.toLowerCase()
            .includes(query) ||

          facility.description
            ?.toLowerCase()
            .includes(query) ||

          (
            facility.available
              ? "available"
              : "not available"
          ).includes(query)
      );

    }, [
      facilities,
      search,
    ]);


  const availableCount =
    facilities.filter(
      (facility) =>
        Boolean(
          facility.available
        )
    ).length;


  const unavailableCount =
    facilities.length -
    availableCount;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <main className="lep-facilities-page">

          <div className="lep-facilities-container">

            <div className="lep-facilities-state">

              <div className="lep-facilities-state-icon">

                <SmartIcon
                  name="facilities"
                  size={28}
                />

              </div>


              <span className="lep-facilities-eyebrow">
                ADMINISTRATION
              </span>


              <h1>
                Loading Facilities...
              </h1>


              <p>
                Please wait while we load
                the campus resources.
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

        <main className="lep-facilities-page">

          <div className="lep-facilities-container">

            <div className="lep-facilities-state">

              <div className="lep-facilities-state-icon">

                <SmartIcon
                  name="search"
                  size={28}
                />

              </div>


              <span className="lep-facilities-eyebrow">
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
                className="lep-facilities-primary"
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


      <main className="lep-facilities-page">

        <div className="lep-facilities-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <header className="lep-facilities-header">

            <div className="lep-facilities-heading">

              <div className="lep-facilities-page-icon">

                <SmartIcon
                  name="facilities"
                  size={29}
                />

              </div>


              <div>

                <span className="lep-facilities-eyebrow">

                  <SmartIcon
                    name="dashboard"
                    size={12}
                  />

                  FACILITY MANAGEMENT

                </span>


                <h1>
                  Facilities
                </h1>


                <p>
                  Manage campus resources for{" "}
                  <strong>
                    {institution.name}
                  </strong>.
                </p>

              </div>

            </div>


            <Link
              to={`${config.adminBase}/${id}/manage`}
              className="lep-facilities-back"
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

            <div className="lep-facilities-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-facilities-message success">

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

          <section className="lep-facilities-metrics">


            <div className="lep-facilities-metric">

              <div className="lep-facilities-metric-icon">

                <SmartIcon
                  name="facilities"
                  size={19}
                />

              </div>


              <span>
                TOTAL FACILITIES
              </span>


              <strong>
                {facilities.length}
              </strong>

            </div>


            <div className="lep-facilities-metric">

              <div className="lep-facilities-metric-icon">

                <SmartIcon
                  name="verified"
                  size={19}
                />

              </div>


              <span>
                AVAILABLE
              </span>


              <strong>
                {availableCount}
              </strong>

            </div>


            <div className="lep-facilities-metric">

              <div className="lep-facilities-metric-icon">

                <SmartIcon
                  name="warning"
                  size={19}
                />

              </div>


              <span>
                NOT AVAILABLE
              </span>


              <strong>
                {unavailableCount}
              </strong>

            </div>


            <div className="lep-facilities-metric">

              <div className="lep-facilities-metric-icon">

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
              DIRECTORY
          ================================================= */}

          <section className="lep-facilities-section">


            <div className="lep-facilities-section-header">

              <div className="lep-facilities-section-icon">

                <SmartIcon
                  name="facilities"
                  size={21}
                />

              </div>


              <div>

                <span>
                  CAMPUS RESOURCES
                </span>


                <h2>
                  Facility Directory
                </h2>


                <p>
                  Facilities associated with this{" "}
                  {config.singular.toLowerCase()}.
                </p>

              </div>

            </div>


            {facilities.length > 0 && (

              <div className="lep-facilities-search">

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
                  placeholder="Search facilities..."
                />


                <span>
                  {filteredFacilities.length}
                </span>

              </div>

            )}


            {facilities.length === 0 ? (

              <div className="lep-facilities-empty">

                <div className="lep-facilities-empty-icon">

                  <SmartIcon
                    name="facilities"
                    size={28}
                  />

                </div>


                <h3>
                  No Facilities Added
                </h3>


                <p>
                  Add resources such as libraries,
                  computer labs, playgrounds and
                  science laboratories.
                </p>

              </div>

            ) : filteredFacilities.length === 0 ? (

              <div className="lep-facilities-empty">

                <div className="lep-facilities-empty-icon">

                  <SmartIcon
                    name="search"
                    size={28}
                  />

                </div>


                <h3>
                  No Matching Facilities
                </h3>


                <p>
                  Try another search term.
                </p>

              </div>

            ) : (

              <div className="lep-facilities-list">

                {filteredFacilities.map(
                  (facility) => {

                    const deletingThis =
                      deleting ===
                      facility.id;


                    const isAvailable =
                      Boolean(
                        facility.available
                      );


                    return (

                      <article
                        key={
                          facility.id
                        }
                        className="lep-facility-card"
                      >

                        <div className="lep-facility-icon">

                          <SmartIcon
                            name="facilities"
                            size={22}
                          />

                        </div>


                        <div className="lep-facility-content">


                          <div className="lep-facility-title">

                            <h3>
                              {
                                facility.facility_name
                              }
                            </h3>


                            <span
                              className={
                                isAvailable
                                  ? "available"
                                  : "unavailable"
                              }
                            >

                              <SmartIcon
                                name={
                                  isAvailable
                                    ? "verified"
                                    : "warning"
                                }
                                size={10}
                              />

                              {isAvailable
                                ? "Available"
                                : "Not Available"}

                            </span>

                          </div>


                          {facility.description && (

                            <p className="lep-facility-description">

                              {
                                facility.description
                              }

                            </p>

                          )}

                        </div>


                        <div className="lep-facility-actions">

                          <button
                            type="button"
                            className="lep-facility-delete"
                            onClick={() =>
                              handleDeleteFacility(
                                facility.id
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
              ADD FACILITY
          ================================================= */}

          <section className="lep-facilities-section">


            <div className="lep-facilities-section-header">

              <div className="lep-facilities-section-icon">

                <SmartIcon
                  name="plus"
                  size={21}
                />

              </div>


              <div>

                <span>
                  ADD FACILITY
                </span>


                <h2>
                  New Facility
                </h2>


                <p>
                  Add a verified resource for this{" "}
                  {config.singular.toLowerCase()}.
                </p>

              </div>

            </div>


            <form
              className="lep-facilities-form"
              onSubmit={
                handleAddFacility
              }
            >

              <div className="lep-facilities-grid">


                <div className="lep-facility-field">

                  <label>

                    <SmartIcon
                      name="facilities"
                      size={14}
                    />

                    Facility Name *

                  </label>


                  <input
                    type="text"
                    value={
                      facilityName
                    }
                    onChange={(event) =>
                      setFacilityName(
                        event.target.value
                      )
                    }
                    placeholder="Computer Lab"
                    required
                  />

                </div>


                <div className="lep-facility-field">

                  <label>

                    <SmartIcon
                      name="verified"
                      size={14}
                    />

                    Availability

                  </label>


                  <select
                    value={
                      available
                        ? "available"
                        : "not_available"
                    }
                    onChange={(event) =>
                      setAvailable(
                        event.target.value ===
                          "available"
                      )
                    }
                  >

                    <option value="available">
                      Available
                    </option>

                    <option value="not_available">
                      Not Available
                    </option>

                  </select>

                </div>


                <div className="lep-facility-field full">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Description

                  </label>


                  <textarea
                    rows="5"
                    value={
                      description
                    }
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="Optional details about the facility..."
                  />

                </div>

              </div>


              <div className="lep-facilities-form-actions">

                <div className="lep-facilities-note">

                  <SmartIcon
                    name="verified"
                    size={15}
                  />

                  <span>
                    Add only facilities that
                    have been verified.
                  </span>

                </div>


                <button
                  type="submit"
                  className="lep-facilities-save"
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
                    : "Add Facility"}

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

  .lep-facilities-page {
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


  .lep-facilities-container {
    width:
      min(
        1120px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  .lep-facilities-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 25px;
  }


  .lep-facilities-heading {
    display: flex;
    align-items: center;
    gap: 15px;
  }


  .lep-facilities-page-icon {
    width: 60px;
    height: 60px;

    display: grid;
    place-items: center;

    flex-shrink: 0;

    border-radius: 16px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff9348;

    box-shadow:
      0 9px 0 #142b47,
      0 18px 32px
      rgba(26,54,93,.18);

    transform:
      perspective(700px)
      rotateX(4deg)
      rotateY(-4deg);
  }


  .lep-facilities-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 5px;

    color: #ff6b00;

    font-size: 9px;
    font-weight: 900;
    letter-spacing: 1.5px;
  }


  .lep-facilities-heading h1 {
    margin-top: 7px;

    color: #1a365d;

    font-size:
      clamp(
        35px,
        5vw,
        52px
      );

    line-height: 1;
    letter-spacing: -1.8px;
  }


  .lep-facilities-heading p {
    margin-top: 9px;

    color: #718096;

    font-size: 12px;
    line-height: 1.7;
  }


  .lep-facilities-heading p strong {
    color: #1a365d;
  }


  .lep-facilities-back {
    min-height: 42px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    padding: 0 13px;

    border: 1px solid #dce4ec;
    border-radius: 9px;

    background: #ffffff;

    color: #1a365d;

    text-decoration: none;

    font-size: 10px;
    font-weight: 900;

    box-shadow:
      0 8px 20px
      rgba(26,54,93,.05);
  }


  .lep-facilities-message {
    display: flex;
    align-items: center;
    gap: 8px;

    margin-bottom: 14px;
    padding: 12px 14px;

    border-radius: 9px;

    font-size: 10px;
    font-weight: 800;
  }


  .lep-facilities-message.error {
    background: #fff2f2;
    border: 1px solid #f1cccc;
    color: #b42318;
  }


  .lep-facilities-message.success {
    background: #effaf2;
    border: 1px solid #c8e7d0;
    color: #16803c;
  }


  .lep-facilities-metrics {
    display: grid;
    grid-template-columns:
      repeat(4, 1fr);

    gap: 12px;
    margin: 22px 0;
  }


  .lep-facilities-metric {
    min-height: 116px;
    padding: 18px;

    background: #ffffff;

    border: 1px solid #e2e8f0;
    border-radius: 14px;

    box-shadow:
      0 10px 27px
      rgba(26,54,93,.055);

    transition:
      transform .3s ease,
      box-shadow .3s ease;
  }


  .lep-facilities-metric:hover {
    transform: translateY(-4px);

    box-shadow:
      0 21px 44px
      rgba(26,54,93,.10);
  }


  .lep-facilities-metric-icon {
    width: 39px;
    height: 39px;

    display: grid;
    place-items: center;

    border-radius: 10px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff9348;

    box-shadow:
      0 7px 0 #142b47;
  }


  .lep-facilities-metric span {
    display: block;

    margin-top: 9px;

    color: #94a3b8;

    font-size: 8px;
    font-weight: 900;
    letter-spacing: 1px;
  }


  .lep-facilities-metric strong {
    display: block;

    margin-top: 4px;

    color: #1a365d;

    font-size: 20px;
  }


  .lep-facilities-section {
    margin-top: 17px;
    padding: 25px;

    background:
      rgba(255,255,255,.96);

    border: 1px solid #e2e8f0;
    border-radius: 17px;

    box-shadow:
      0 12px 30px
      rgba(26,54,93,.055);
  }


  .lep-facilities-section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }


  .lep-facilities-section-icon {
    width: 46px;
    height: 46px;

    display: grid;
    place-items: center;

    flex-shrink: 0;

    border-radius: 12px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff9348;

    box-shadow:
      0 8px 0 #142b47,
      0 14px 25px
      rgba(26,54,93,.13);
  }


  .lep-facilities-section-header span {
    display: block;

    color: #ff6b00;

    font-size: 8px;
    font-weight: 900;
    letter-spacing: 1.2px;
  }


  .lep-facilities-section-header h2 {
    margin-top: 4px;

    color: #1a365d;

    font-size: 21px;
  }


  .lep-facilities-section-header p {
    margin-top: 4px;

    color: #718096;

    font-size: 10px;
    line-height: 1.5;
  }


  .lep-facilities-search {
    min-height: 46px;

    display: flex;
    align-items: center;
    gap: 8px;

    margin-bottom: 15px;
    padding: 0 13px;

    border: 1px solid #e2e8f0;
    border-radius: 9px;

    background: #fbfdff;
  }


  .lep-facilities-search input {
    width: 100%;

    border: none;
    outline: none;

    background: transparent;

    color: #2d3748;

    font-family: inherit;
    font-size: 11px;
  }


  .lep-facilities-search span {
    min-width: 28px;

    padding: 5px 7px;

    border-radius: 6px;

    background: #1a365d;
    color: #ff9348;

    text-align: center;

    font-size: 8px;
    font-weight: 900;
  }


  .lep-facilities-list {
    display: grid;
    gap: 10px;
  }


  .lep-facility-card {
    display: grid;

    grid-template-columns:
      50px
      minmax(0,1fr)
      auto;

    gap: 13px;

    align-items: center;

    padding: 15px;

    background:
      linear-gradient(
        145deg,
        #ffffff,
        #f4f8fb
      );

    border: 1px solid #e2e8f0;
    border-radius: 13px;

    transition:
      transform .25s ease,
      box-shadow .25s ease;
  }


  .lep-facility-card:hover {
    transform: translateY(-3px);

    box-shadow:
      0 17px 34px
      rgba(26,54,93,.09);
  }


  .lep-facility-icon {
    width: 50px;
    height: 50px;

    display: grid;
    place-items: center;

    border-radius: 12px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff9348;

    box-shadow:
      0 7px 0 #142b47;
  }


  .lep-facility-title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
  }


  .lep-facility-title h3 {
    color: #1a365d;
    font-size: 15px;
  }


  .lep-facility-title span {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    padding: 5px 7px;

    border-radius: 6px;

    font-size: 7px;
    font-weight: 900;

    text-transform: uppercase;
  }


  .lep-facility-title span.available {
    background: #eaf7ee;
    color: #16803c;
  }


  .lep-facility-title span.unavailable {
    background: #fff1e9;
    color: #b25c00;
  }


  .lep-facility-description {
    margin-top: 6px;

    color: #718096;

    font-size: 9px;
    line-height: 1.6;
  }


  .lep-facility-delete {
    min-height: 35px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;

    padding: 0 10px;

    border: 1px solid #f0caca;
    border-radius: 8px;

    background: #fff7f7;
    color: #b42318;

    font-family: inherit;

    font-size: 8px;
    font-weight: 900;

    cursor: pointer;
  }


  .lep-facilities-empty,
  .lep-facilities-state {
    min-height: 270px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    padding: 35px;

    text-align: center;

    border: 1px solid #e7edf2;
    border-radius: 13px;

    background: #f9fbfd;
  }


  .lep-facilities-empty-icon,
  .lep-facilities-state-icon {
    width: 58px;
    height: 58px;

    display: grid;
    place-items: center;

    margin-bottom: 13px;

    border-radius: 14px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color: #ff9348;

    box-shadow:
      0 10px 22px
      rgba(26,54,93,.14);
  }


  .lep-facilities-empty h3,
  .lep-facilities-state h1 {
    color: #1a365d;
    font-size: 20px;
  }


  .lep-facilities-empty p,
  .lep-facilities-state p {
    max-width: 480px;

    margin-top: 7px;

    color: #718096;

    font-size: 11px;
    line-height: 1.6;
  }


  .lep-facilities-primary {
    min-height: 40px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    margin-top: 17px;
    padding: 0 13px;

    border-radius: 9px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    color: #ffffff;

    text-decoration: none;

    font-size: 10px;
    font-weight: 900;
  }


  .lep-facilities-form {
    display: grid;
    gap: 15px;
  }


  .lep-facilities-grid {
    display: grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0,1fr)
      );

    gap: 13px;
  }


  .lep-facility-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }


  .lep-facility-field.full {
    grid-column: 1 / -1;
  }


  .lep-facility-field label {
    display: flex;
    align-items: center;
    gap: 6px;

    color: #475569;

    font-size: 9px;
    font-weight: 900;
  }


  .lep-facility-field input,
  .lep-facility-field select,
  .lep-facility-field textarea {
    width: 100%;

    padding: 12px 13px;

    border: 1px solid #dfe6ed;
    border-radius: 9px;

    background: #fbfdff;

    color: #2d3748;

    font-family: inherit;
    font-size: 11px;

    outline: none;
  }


  .lep-facility-field textarea {
    min-height: 110px;
    resize: vertical;
  }


  .lep-facilities-form-actions {
    display: flex;

    align-items: center;
    justify-content: space-between;

    gap: 15px;

    padding: 17px 18px;

    border-radius: 13px;

    background: #1a365d;
  }


  .lep-facilities-note {
    display: flex;
    align-items: center;
    gap: 8px;

    color: #c8d6e3;

    font-size: 9px;
  }


  .lep-facilities-note svg {
    color: #ff9348;
  }


  .lep-facilities-save {
    min-height: 40px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    padding: 0 14px;

    border: none;
    border-radius: 9px;

    background: #ff6b00;
    color: #ffffff;

    font-family: inherit;

    font-size: 10px;
    font-weight: 900;

    cursor: pointer;
  }


  .lep-facilities-save:hover {
    background: #e65f00;
  }


  @media (max-width: 900px) {

    .lep-facilities-header {
      display: block;
    }


    .lep-facilities-back {
      margin-top: 16px;
    }


    .lep-facilities-metrics {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-facility-card {
      grid-template-columns:
        50px
        minmax(0,1fr);
    }


    .lep-facility-actions {
      grid-column: 1 / -1;
    }

  }


  @media (max-width: 650px) {

    .lep-facilities-heading {
      align-items: flex-start;
    }


    .lep-facilities-heading h1 {
      font-size: 37px;
    }


    .lep-facilities-metrics {
      grid-template-columns: 1fr;
    }


    .lep-facilities-grid {
      grid-template-columns: 1fr;
    }


    .lep-facility-field.full {
      grid-column: auto;
    }


    .lep-facilities-section {
      padding: 19px;
    }


    .lep-facilities-form-actions {
      display: block;
    }


    .lep-facilities-save {
      width: 100%;
      margin-top: 12px;
    }

  }

`;

export default ManageFacilities;
