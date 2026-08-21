import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


function ManageFees() {
  const { id } = useParams();


  const [school, setSchool] =
    useState(null);

  const [fees, setFees] =
    useState([]);


  const [form, setForm] = useState({
    fee_name: "",
    class_name: "",
    amount: "",
    frequency: "monthly",
    description: "",
  });


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
        schoolResponse,
        feeResponse,
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
          `http://localhost:5000/api/fees/institution/${id}`
        ),

      ]);


      const schoolData =
        await schoolResponse.json();


      const feeData =
        await feeResponse.json();


      if (
        !schoolResponse.ok ||
        !schoolData.success
      ) {
        throw new Error(
          schoolData.message ||
            "Failed to load institution."
        );
      }


      if (
        !feeResponse.ok ||
        !feeData.success
      ) {
        throw new Error(
          feeData.message ||
            "Failed to load fees."
        );
      }


      setSchool(
        schoolData.data?.institution
      );


      setFees(
        feeData.data?.fees || []
      );


    } catch (err) {

      console.error(
        "Load fees error:",
        err
      );


      setError(
        err.message ||
          "Failed to load fee information."
      );


    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadData();
  }, [id]);


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
  // RESET FORM
  // =========================================================

  const resetForm = () => {

    setForm({
      fee_name: "",
      class_name: "",
      amount: "",
      frequency: "monthly",
      description: "",
    });

  };


  // =========================================================
  // ADD FEE
  // =========================================================

  const handleAddFee = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!form.fee_name.trim()) {

      setError(
        "Fee name is required."
      );

      return;
    }


    if (
      form.amount !== "" &&
      Number(form.amount) < 0
    ) {

      setError(
        "Fee amount cannot be negative."
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
          "http://localhost:5000/api/fees",
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

              fee_name:
                form.fee_name.trim(),

              class_name:
                form.class_name.trim() ||
                null,

              amount:
                Number(
                  form.amount || 0
                ),

              frequency:
                form.frequency,

              description:
                form.description.trim() ||
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
            "Failed to add fee."
        );

      }


      setSuccess(
        "Fee added successfully."
      );


      resetForm();


      await loadData();


    } catch (err) {

      console.error(
        "Add fee error:",
        err
      );


      setError(
        err.message ||
          "Failed to add fee."
      );


    } finally {

      setSaving(false);

    }
  };


  // =========================================================
  // DELETE FEE
  // =========================================================

  const handleDeleteFee =
    async (feeId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete this fee?"
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeleting(feeId);

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
            `http://localhost:5000/api/fees/${feeId}`,
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
              "Failed to delete fee."
          );

        }


        setSuccess(
          "Fee deleted successfully."
        );


        await loadData();


      } catch (err) {

        console.error(
          "Delete fee error:",
          err
        );


        setError(
          err.message ||
            "Failed to delete fee."
        );


      } finally {

        setDeleting(null);

      }

  };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredFees =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      if (!query) {
        return fees;
      }


      return fees.filter(
        (fee) =>

          fee.fee_name
            ?.toLowerCase()
            .includes(query) ||

          fee.class_name
            ?.toLowerCase()
            .includes(query) ||

          fee.frequency
            ?.toLowerCase()
            .includes(query) ||

          fee.description
            ?.toLowerCase()
            .includes(query)
      );

    }, [
      fees,
      search,
    ]);


  // =========================================================
  // METRICS
  // =========================================================

  const totalAmount = fees.reduce(
    (sum, fee) =>
      sum +
      Number(
        fee.amount || 0
      ),
    0
  );


  const monthlyFees =
    fees.filter(
      (fee) =>
        fee.frequency ===
        "monthly"
    ).length;


  const annualFees =
    fees.filter(
      (fee) =>
        fee.frequency ===
        "annual"
    ).length;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-fees-page">

          <div className="lep-fees-container">

            <div className="lep-fees-state">

              <div className="lep-fees-state-icon">

                <SmartIcon
                  name="fees"
                  size={28}
                />

              </div>


              <span className="lep-fees-eyebrow">

                ADMINISTRATION

              </span>


              <h1>
                Loading Fees...
              </h1>


              <p>
                Please wait while we load
                the fee information.
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

  if (!school) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-fees-page">

          <div className="lep-fees-container">

            <div className="lep-fees-state">

              <div className="lep-fees-state-icon">

                <SmartIcon
                  name="search"
                  size={28}
                />

              </div>


              <span className="lep-fees-eyebrow">

                ADMINISTRATION

              </span>


              <h1>
                Institution Not Found
              </h1>


              <p>
                {error ||
                  "The institution could not be loaded."}
              </p>


              <Link
                to="/admin/schools"
                className="lep-fees-primary"
              >

                <SmartIcon
                  name="arrow-left"
                  size={14}
                />

                Back to Schools

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


      <main className="lep-fees-page">

        <div className="lep-fees-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-fees-header">

            <div className="lep-fees-heading">

              <div className="lep-fees-page-icon">

                <SmartIcon
                  name="fees"
                  size={29}
                />

              </div>


              <div>

                <span className="lep-fees-eyebrow">

                  <SmartIcon
                    name="dashboard"
                    size={12}
                  />

                  FEE MANAGEMENT

                </span>


                <h1>
                  Fees
                </h1>


                <p>

                  Manage verified fee information
                  for{" "}

                  <strong>
                    {school.name}
                  </strong>.

                </p>

              </div>

            </div>


            <Link
              to={`/admin/schools/${id}/manage`}
              className="lep-fees-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              Manage School

            </Link>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-fees-message error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-fees-message success">

              <SmartIcon
                name="verified"
                size={15}
              />

              {success}

            </div>

          )}


          {/* =====================================================
              METRICS
          ===================================================== */}

          <section className="lep-fees-metrics">


            <div className="lep-fees-metric">

              <div className="lep-fees-metric-icon">

                <SmartIcon
                  name="fees"
                  size={19}
                />

              </div>


              <span>
                TOTAL FEE ITEMS
              </span>


              <strong>
                {fees.length}
              </strong>

            </div>


            <div className="lep-fees-metric">

              <div className="lep-fees-metric-icon">

                <SmartIcon
                  name="calendar"
                  size={19}
                />

              </div>


              <span>
                MONTHLY
              </span>


              <strong>
                {monthlyFees}
              </strong>

            </div>


            <div className="lep-fees-metric">

              <div className="lep-fees-metric-icon">

                <SmartIcon
                  name="verified"
                  size={19}
                />

              </div>


              <span>
                ANNUAL
              </span>


              <strong>
                {annualFees}
              </strong>

            </div>


            <div className="lep-fees-metric">

              <div className="lep-fees-metric-icon">

                <SmartIcon
                  name="document"
                  size={19}
                />

              </div>


              <span>
                TOTAL LISTED
              </span>


              <strong>
                Rs.{" "}
                {totalAmount.toLocaleString()}
              </strong>

            </div>

          </section>


          {/* =====================================================
              FEE DIRECTORY
          ===================================================== */}

          <section className="lep-fees-section">


            <div className="lep-fees-section-header">

              <div className="lep-fees-section-icon">

                <SmartIcon
                  name="fees"
                  size={21}
                />

              </div>


              <div>

                <span>
                  FEE DIRECTORY
                </span>


                <h2>
                  Fee Information
                </h2>


                <p>
                  Fees collected and verified
                  from the institution.
                </p>

              </div>

            </div>


            {fees.length > 0 && (

              <div className="lep-fees-search">

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
                  placeholder="Search fee name, class or frequency..."
                />


                <span>
                  {filteredFees.length}
                </span>

              </div>

            )}


            {fees.length === 0 ? (

              <div className="lep-fees-empty">

                <div className="lep-fees-empty-icon">

                  <SmartIcon
                    name="fees"
                    size={28}
                  />

                </div>


                <h3>
                  No Fees Added
                </h3>


                <p>
                  Add tuition, admission,
                  transport or other verified fees.
                </p>

              </div>

            ) : filteredFees.length === 0 ? (

              <div className="lep-fees-empty">

                <div className="lep-fees-empty-icon">

                  <SmartIcon
                    name="search"
                    size={28}
                  />

                </div>


                <h3>
                  No Matching Fees
                </h3>


                <p>
                  Try another search term.
                </p>

              </div>

            ) : (

              <div className="lep-fees-list">

                {filteredFees.map(
                  (fee) => {

                    const deletingThis =
                      deleting ===
                      fee.id;


                    return (
                      <article
                        key={
                          fee.id
                        }
                        className="lep-fee-card"
                      >


                        <div className="lep-fee-icon">

                          <SmartIcon
                            name="fees"
                            size={22}
                          />

                        </div>


                        <div className="lep-fee-content">


                          <div className="lep-fee-title">

                            <h3>
                              {fee.fee_name}
                            </h3>


                            <span>

                              <SmartIcon
                                name="verified"
                                size={10}
                              />

                              Verified

                            </span>

                          </div>


                          <div className="lep-fee-meta">


                            <span>

                              <SmartIcon
                                name="school"
                                size={11}
                              />

                              {fee.class_name ||
                                "All Classes"}

                            </span>


                            <span>

                              <SmartIcon
                                name="calendar"
                                size={11}
                              />

                              {(
                                fee.frequency ||
                                "other"
                              ).replaceAll(
                                "_",
                                " "
                              )}

                            </span>


                          </div>


                          {fee.description && (

                            <p className="lep-fee-description">

                              {
                                fee.description
                              }

                            </p>

                          )}

                        </div>


                        <div className="lep-fee-right">


                          <strong>

                            Rs.{" "}

                            {Number(
                              fee.amount || 0
                            ).toLocaleString()}

                          </strong>


                          <span>
                            PKR
                          </span>


                          <button
                            type="button"
                            className="lep-fee-delete"
                            onClick={() =>
                              handleDeleteFee(
                                fee.id
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


          {/* =====================================================
              ADD FEE
          ===================================================== */}

          <section className="lep-fees-section">


            <div className="lep-fees-section-header">

              <div className="lep-fees-section-icon">

                <SmartIcon
                  name="plus"
                  size={21}
                />

              </div>


              <div>

                <span>
                  ADD FEE
                </span>


                <h2>
                  New Fee
                </h2>


                <p>
                  Add verified fee information
                  for this institution.
                </p>

              </div>

            </div>


            <form
              className="lep-fees-form"
              onSubmit={
                handleAddFee
              }
            >


              <div className="lep-fees-grid">


                {/* FEE NAME */}

                <div className="lep-fee-field">

                  <label>

                    <SmartIcon
                      name="fees"
                      size={14}
                    />

                    Fee Name *

                  </label>


                  <input
                    name="fee_name"
                    value={
                      form.fee_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Monthly Tuition"
                    required
                  />

                </div>


                {/* CLASS */}

                <div className="lep-fee-field">

                  <label>

                    <SmartIcon
                      name="school"
                      size={14}
                    />

                    Class

                  </label>


                  <input
                    name="class_name"
                    value={
                      form.class_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Grade 5"
                  />

                </div>


                {/* AMOUNT */}

                <div className="lep-fee-field">

                  <label>

                    <SmartIcon
                      name="fees"
                      size={14}
                    />

                    Amount (PKR)

                  </label>


                  <input
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      form.amount
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="2500"
                  />

                </div>


                {/* FREQUENCY */}

                <div className="lep-fee-field">

                  <label>

                    <SmartIcon
                      name="calendar"
                      size={14}
                    />

                    Frequency

                  </label>


                  <select
                    name="frequency"
                    value={
                      form.frequency
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="one_time">
                      One Time
                    </option>

                    <option value="monthly">
                      Monthly
                    </option>

                    <option value="quarterly">
                      Quarterly
                    </option>

                    <option value="annual">
                      Annual
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>


                {/* DESCRIPTION */}

                <div className="lep-fee-field full">

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
                    placeholder="Optional fee details..."
                  />

                </div>

              </div>


              <div className="lep-fees-form-actions">


                <div className="lep-fees-note">

                  <SmartIcon
                    name="verified"
                    size={15}
                  />


                  <span>
                    Add only fee amounts
                    verified by the institution.
                  </span>

                </div>


                <button
                  type="submit"
                  className="lep-fees-save"
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
                    : "Add Fee"}

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

  .lep-fees-page {
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


  .lep-fees-container {
    width:
      min(
        1120px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  .lep-fees-header {
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


  .lep-fees-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-fees-page-icon {
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


  .lep-fees-eyebrow {
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


  .lep-fees-heading h1 {
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


  .lep-fees-heading p {
    margin-top:
      9px;

    color:
      #718096;

    font-size:
      12px;

    line-height:
      1.7;
  }


  .lep-fees-heading p strong {
    color:
      #1a365d;
  }


  .lep-fees-back {
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
  }


  .lep-fees-message {
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


  .lep-fees-message.error {
    background:
      #fff2f2;

    border:
      1px solid #f1cccc;

    color:
      #b42318;
  }


  .lep-fees-message.success {
    background:
      #effaf2;

    border:
      1px solid #c8e7d0;

    color:
      #16803c;
  }


  /* METRICS */

  .lep-fees-metrics {
    display:
      grid;

    grid-template-columns:
      repeat(4,1fr);

    gap:
      12px;

    margin:
      22px 0;
  }


  .lep-fees-metric {
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


  .lep-fees-metric:hover {
    transform:
      translateY(-4px);

    box-shadow:
      0 21px 44px
      rgba(26,54,93,.10);
  }


  .lep-fees-metric-icon {
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


  .lep-fees-metric span {
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


  .lep-fees-metric strong {
    display:
      block;

    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      18px;

    word-break:
      break-word;
  }


  /* SECTION */

  .lep-fees-section {
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


  .lep-fees-section-header {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      20px;
  }


  .lep-fees-section-icon {
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


  .lep-fees-section-header span {
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


  .lep-fees-section-header h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      21px;
  }


  .lep-fees-section-header p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;

    line-height:
      1.5;
  }


  /* SEARCH */

  .lep-fees-search {
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


  .lep-fees-search svg {
    color:
      #2c5f8a;
  }


  .lep-fees-search input {
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


  .lep-fees-search span {
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


  /* FEE CARDS */

  .lep-fees-list {
    display:
      grid;

    gap:
      10px;
  }


  .lep-fee-card {
    display:
      grid;

    grid-template-columns:
      50px
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


  .lep-fee-card:hover {
    transform:
      translateY(-3px);

    box-shadow:
      0 17px 34px
      rgba(26,54,93,.09);

    border-color:
      rgba(44,95,138,.20);
  }


  .lep-fee-icon {
    width:
      50px;

    height:
      50px;

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
      0 7px 0 #142b47;
  }


  .lep-fee-title {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;
  }


  .lep-fee-title h3 {
    color:
      #1a365d;

    font-size:
      15px;
  }


  .lep-fee-title span {
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


  .lep-fee-meta {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      9px;

    margin-top:
      6px;
  }


  .lep-fee-meta span {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      4px;

    color:
      #718096;

    font-size:
      8px;

    font-weight:
      700;

    text-transform:
      capitalize;
  }


  .lep-fee-description {
    margin-top:
      6px;

    color:
      #94a3b8;

    font-size:
      9px;

    line-height:
      1.55;
  }


  .lep-fee-right {
    display:
      flex;

    flex-direction:
      column;

    align-items:
      flex-end;

    gap:
      3px;
  }


  .lep-fee-right > strong {
    color:
      #1a365d;

    font-size:
      17px;
  }


  .lep-fee-right > span {
    color:
      #94a3b8;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1px;
  }


  .lep-fee-delete {
    min-height:
      33px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      5px;

    margin-top:
      4px;

    padding:
      0 9px;

    border:
      1px solid #f0caca;

    border-radius:
      8px;

    background:
      #fff7f7;

    color:
      #b42318;

    font-family:
      inherit;

    font-size:
      8px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  /* EMPTY */

  .lep-fees-empty,
  .lep-fees-state {
    min-height:
      270px;

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


  .lep-fees-empty-icon,
  .lep-fees-state-icon {
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


  .lep-fees-empty h3,
  .lep-fees-state h1 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-fees-empty p,
  .lep-fees-state p {
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


  .lep-fees-primary {
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


  /* FORM */

  .lep-fees-form {
    display:
      grid;

    gap:
      15px;
  }


  .lep-fees-grid {
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


  .lep-fee-field {
    display:
      flex;

    flex-direction:
      column;

    gap:
      7px;
  }


  .lep-fee-field.full {
    grid-column:
      1 / -1;
  }


  .lep-fee-field label {
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


  .lep-fee-field label svg {
    color:
      #2c5f8a;
  }


  .lep-fee-field input,
  .lep-fee-field select,
  .lep-fee-field textarea {
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


  .lep-fee-field input:focus,
  .lep-fee-field select:focus,
  .lep-fee-field textarea:focus {
    background:
      #ffffff;

    border-color:
      #2c5f8a;

    box-shadow:
      0 0 0 4px
      rgba(44,95,138,.07);
  }


  .lep-fee-field textarea {
    min-height:
      110px;

    resize:
      vertical;

    line-height:
      1.65;
  }


  .lep-fees-form-actions {
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

    border-radius:
      13px;

    background:
      #1a365d;
  }


  .lep-fees-note {
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


  .lep-fees-note svg {
    color:
      #ff9348;
  }


  .lep-fees-save {
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


  .lep-fees-save:hover {
    background:
      #e65f00;
  }


  /* RESPONSIVE */

  @media (max-width: 900px) {

    .lep-fees-header {
      display:
        block;
    }


    .lep-fees-back {
      margin-top:
        16px;
    }


    .lep-fees-metrics {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-fee-card {
      grid-template-columns:
        50px
        minmax(0,1fr);
    }


    .lep-fee-right {
      grid-column:
        1 / -1;

      flex-direction:
        row;

      align-items:
        center;

      justify-content:
        flex-start;
    }

  }


  @media (max-width: 650px) {

    .lep-fees-heading {
      align-items:
        flex-start;
    }


    .lep-fees-heading h1 {
      font-size:
        37px;
    }


    .lep-fees-metrics {
      grid-template-columns:
        1fr;
    }


    .lep-fees-grid {
      grid-template-columns:
        1fr;
    }


    .lep-fee-field.full {
      grid-column:
        auto;
    }


    .lep-fees-section {
      padding:
        19px;
    }


    .lep-fees-form-actions {
      display:
        block;
    }


    .lep-fees-save {
      width:
        100%;

      margin-top:
        12px;
    }

  }

`;

export default ManageFees;