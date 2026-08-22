import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


function ManageContacts() {
  const { id } = useParams();

  const [school, setSchool] = useState(null);
  const [contacts, setContacts] = useState([]);

  const [form, setForm] = useState({
    contact_type: "phone",
    contact_value: "",
    is_primary: false,
  });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadData = async () => {
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
          "Institution ID is missing."
        );
      }

      const [
        schoolResponse,
        contactResponse,
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
          `${API_URL}/api/contacts/institution/${id}`
        ),
      ]);

      const schoolData =
        await schoolResponse.json();

      const contactData =
        await contactResponse.json();

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
        !contactResponse.ok ||
        !contactData.success
      ) {
        throw new Error(
          contactData.message ||
            "Failed to load contacts."
        );
      }

      setSchool(
        schoolData.data?.institution
      );

      setContacts(
        contactData.data?.contacts || []
      );

    } catch (err) {
      console.error(
        "Load contacts error:",
        err
      );

      setError(
        err.message ||
          "Failed to load contact information."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, [id]);


  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  // =========================================================
  // RESET
  // =========================================================

  const resetForm = () => {
    setForm({
      contact_type: "phone",
      contact_value: "",
      is_primary: false,
    });
  };


  // =========================================================
  // ADD CONTACT
  // =========================================================

  const handleAddContact =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!form.contact_value.trim()) {
        setError(
          "Contact value is required."
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
            `${API_URL}/api/contacts`,
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

                contact_type:
                  form.contact_type,

                contact_value:
                  form.contact_value.trim(),

                is_primary:
                  form.is_primary,
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
              "Failed to add contact."
          );
        }


        setSuccess(
          "Contact added successfully."
        );


        resetForm();


        await loadData();

      } catch (err) {
        console.error(
          "Add contact error:",
          err
        );

        setError(
          err.message ||
            "Failed to add contact."
        );
      } finally {
        setSaving(false);
      }
    };


  // =========================================================
  // DELETE CONTACT
  // =========================================================

  const handleDeleteContact =
    async (contactId) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete this contact?"
        );

      if (!confirmed) {
        return;
      }


      try {
        setDeleting(contactId);

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
            `${API_URL}/api/contacts/${contactId}`,
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
              "Failed to delete contact."
          );
        }


        setSuccess(
          "Contact deleted successfully."
        );


        await loadData();

      } catch (err) {
        console.error(
          "Delete contact error:",
          err
        );

        setError(
          err.message ||
            "Failed to delete contact."
        );
      } finally {
        setDeleting(null);
      }
    };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredContacts =
    useMemo(() => {

      const query =
        search.trim().toLowerCase();


      if (!query) {
        return contacts;
      }


      return contacts.filter(
        (contact) =>
          contact.contact_type
            ?.toLowerCase()
            .includes(query) ||
          contact.contact_value
            ?.toLowerCase()
            .includes(query)
      );

    }, [
      contacts,
      search,
    ]);


  const primaryCount =
    contacts.filter(
      (contact) =>
        Boolean(contact.is_primary)
    ).length;


  return (
    <>
      <style>{styles}</style>

      <main className="lep-contacts-page">

        <div className="lep-contacts-container">


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="lep-contacts-state">

              <div className="lep-contacts-state-icon">

                <SmartIcon
                  name="contacts"
                  size={28}
                />

              </div>

              <span className="lep-contacts-eyebrow">
                ADMINISTRATION
              </span>

              <h1>
                Loading Contacts...
              </h1>

              <p>
                Please wait while we load the
                institution contact information.
              </p>

            </div>

          ) : (

            <>

              {/* =================================================
                  HEADER
              ================================================= */}

              <header className="lep-contacts-header">

                <div className="lep-contacts-heading">

                  <div className="lep-contacts-page-icon">

                    <SmartIcon
                      name="contacts"
                      size={29}
                    />

                  </div>


                  <div>

                    <span className="lep-contacts-eyebrow">

                      <SmartIcon
                        name="dashboard"
                        size={12}
                      />

                      CONTACT MANAGEMENT

                    </span>


                    <h1>
                      Contacts
                    </h1>


                    <p>
                      Manage official contact
                      information for{" "}
                      <strong>
                        {school?.name ||
                          "Institution"}
                      </strong>.
                    </p>

                  </div>

                </div>


                <Link
                  to={`/admin/schools/${id}/manage`}
                  className="lep-contacts-back"
                >

                  <SmartIcon
                    name="arrow-left"
                    size={14}
                  />

                  Manage School

                </Link>

              </header>


              {/* =================================================
                  MESSAGES
              ================================================= */}

              {error && (

                <div className="lep-contacts-message error">

                  <SmartIcon
                    name="warning"
                    size={15}
                  />

                  {error}

                </div>

              )}


              {success && (

                <div className="lep-contacts-message success">

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

              <section className="lep-contacts-metrics">


                <div className="lep-contacts-metric">

                  <div className="lep-contacts-metric-icon">

                    <SmartIcon
                      name="contacts"
                      size={19}
                    />

                  </div>

                  <span>
                    TOTAL CONTACTS
                  </span>

                  <strong>
                    {contacts.length}
                  </strong>

                </div>


                <div className="lep-contacts-metric">

                  <div className="lep-contacts-metric-icon">

                    <SmartIcon
                      name="verified"
                      size={19}
                    />

                  </div>

                  <span>
                    PRIMARY
                  </span>

                  <strong>
                    {primaryCount}
                  </strong>

                </div>


                <div className="lep-contacts-metric">

                  <div className="lep-contacts-metric-icon">

                    <SmartIcon
                      name="phone"
                      size={19}
                    />

                  </div>

                  <span>
                    PHONE
                  </span>

                  <strong>
                    {
                      contacts.filter(
                        (contact) =>
                          contact.contact_type ===
                          "phone"
                      ).length
                    }
                  </strong>

                </div>


                <div className="lep-contacts-metric">

                  <div className="lep-contacts-metric-icon">

                    <SmartIcon
                      name="mail"
                      size={19}
                    />

                  </div>

                  <span>
                    EMAIL
                  </span>

                  <strong>
                    {
                      contacts.filter(
                        (contact) =>
                          contact.contact_type ===
                          "email"
                      ).length
                    }
                  </strong>

                </div>

              </section>


              {/* =================================================
                  DIRECTORY
              ================================================= */}

              <section className="lep-contacts-section">


                <div className="lep-contacts-section-header">

                  <div className="lep-contacts-section-icon">

                    <SmartIcon
                      name="contacts"
                      size={21}
                    />

                  </div>


                  <div>

                    <span>
                      OFFICIAL CONTACTS
                    </span>

                    <h2>
                      Contact Directory
                    </h2>

                    <p>
                      Phone, WhatsApp, email,
                      website and social links.
                    </p>

                  </div>

                </div>


                {contacts.length > 0 && (

                  <div className="lep-contacts-search">

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
                      placeholder="Search contacts..."
                    />

                    <span>
                      {filteredContacts.length}
                    </span>

                  </div>

                )}


                {contacts.length === 0 ? (

                  <div className="lep-contacts-empty">

                    <div className="lep-contacts-empty-icon">

                      <SmartIcon
                        name="contacts"
                        size={28}
                      />

                    </div>


                    <h3>
                      No Contacts Added
                    </h3>


                    <p>
                      Add the official contact
                      information collected from
                      the institution.
                    </p>

                  </div>

                ) : filteredContacts.length === 0 ? (

                  <div className="lep-contacts-empty">

                    <div className="lep-contacts-empty-icon">

                      <SmartIcon
                        name="search"
                        size={28}
                      />

                    </div>


                    <h3>
                      No Matching Contacts
                    </h3>


                    <p>
                      Try another search term.
                    </p>

                  </div>

                ) : (

                  <div className="lep-contacts-list">

                    {filteredContacts.map(
                      (contact) => {

                        const deletingThis =
                          deleting ===
                          contact.id;


                        const type =
                          contact.contact_type ||
                          "other";


                        return (

                          <article
                            key={
                              contact.id
                            }
                            className="lep-contact-card"
                          >

                            <div className="lep-contact-icon">

                              <SmartIcon
                                name={
                                  type ===
                                  "phone"
                                    ? "phone"
                                    : type ===
                                      "whatsapp"
                                    ? "whatsapp"
                                    : type ===
                                      "email"
                                    ? "mail"
                                    : type ===
                                      "website"
                                    ? "globe"
                                    : type ===
                                      "facebook"
                                    ? "facebook"
                                    : "contacts"
                                }
                                size={21}
                              />

                            </div>


                            <div className="lep-contact-content">


                              <div className="lep-contact-title">

                                <h3>
                                  {type}
                                </h3>


                                {contact.is_primary && (

                                  <span className="lep-contact-primary">

                                    <SmartIcon
                                      name="verified"
                                      size={10}
                                    />

                                    Primary

                                  </span>

                                )}

                              </div>


                              <p>
                                {
                                  contact.contact_value
                                }
                              </p>

                            </div>


                            <button
                              type="button"
                              className="lep-contact-delete"
                              onClick={() =>
                                handleDeleteContact(
                                  contact.id
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

                          </article>

                        );

                      }
                    )}

                  </div>

                )}

              </section>


              {/* =================================================
                  ADD CONTACT
              ================================================= */}

              <section className="lep-contacts-section">


                <div className="lep-contacts-section-header">

                  <div className="lep-contacts-section-icon">

                    <SmartIcon
                      name="plus"
                      size={21}
                    />

                  </div>


                  <div>

                    <span>
                      ADD CONTACT
                    </span>

                    <h2>
                      New Contact
                    </h2>

                    <p>
                      Add verified official
                      contact information.
                    </p>

                  </div>

                </div>


                <form
                  className="lep-contacts-form"
                  onSubmit={
                    handleAddContact
                  }
                >


                  <div className="lep-contacts-grid">


                    <div className="lep-contact-field">

                      <label>

                        <SmartIcon
                          name="contacts"
                          size={14}
                        />

                        Contact Type

                      </label>


                      <select
                        name="contact_type"
                        value={
                          form.contact_type
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="phone">
                          Phone
                        </option>

                        <option value="whatsapp">
                          WhatsApp
                        </option>

                        <option value="email">
                          Email
                        </option>

                        <option value="website">
                          Website
                        </option>

                        <option value="facebook">
                          Facebook
                        </option>

                        <option value="other">
                          Other
                        </option>

                      </select>

                    </div>


                    <div className="lep-contact-field">

                      <label>

                        <SmartIcon
                          name={
                            form.contact_type ===
                            "email"
                              ? "mail"
                              : form.contact_type ===
                                "website"
                              ? "globe"
                              : "phone"
                          }
                          size={14}
                        />

                        Contact Value *

                      </label>


                      <input
                        type="text"
                        name="contact_value"
                        value={
                          form.contact_value
                        }
                        onChange={
                          handleChange
                        }
                        placeholder={
                          form.contact_type ===
                          "email"
                            ? "school@example.com"
                            : form.contact_type ===
                              "website"
                            ? "https://example.com"
                            : "03001234567"
                        }
                        required
                      />

                    </div>


                    <label className="lep-contact-primary-toggle">

                      <input
                        type="checkbox"
                        name="is_primary"
                        checked={
                          form.is_primary
                        }
                        onChange={
                          handleChange
                        }
                      />


                      <span>

                        <SmartIcon
                          name="verified"
                          size={14}
                        />

                        Primary Contact

                      </span>

                    </label>

                  </div>


                  <div className="lep-contacts-form-actions">


                    <div className="lep-contacts-note">

                      <SmartIcon
                        name="verified"
                        size={15}
                      />

                      <span>
                        Mark the main official
                        contact as primary.
                      </span>

                    </div>


                    <button
                      type="submit"
                      className="lep-contacts-save"
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
                        : "Add Contact"}

                    </button>

                  </div>

                </form>

              </section>

            </>

          )}

        </div>

      </main>
    </>
  );
}


const styles = `

  .lep-contacts-page {
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


  .lep-contacts-container {
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

  .lep-contacts-header {
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


  .lep-contacts-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      15px;
  }


  .lep-contacts-page-icon {
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


  .lep-contacts-eyebrow {
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


  .lep-contacts-heading h1 {
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


  .lep-contacts-heading p {
    margin-top:
      9px;

    color:
      #718096;

    font-size:
      12px;

    line-height:
      1.7;
  }


  .lep-contacts-heading p strong {
    color:
      #1a365d;
  }


  .lep-contacts-back {
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


  /* =====================================================
     MESSAGES
  ===================================================== */

  .lep-contacts-message {
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


  .lep-contacts-message.error {
    background:
      #fff2f2;

    border:
      1px solid #f1cccc;

    color:
      #b42318;
  }


  .lep-contacts-message.success {
    background:
      #effaf2;

    border:
      1px solid #c8e7d0;

    color:
      #16803c;
  }


  /* =====================================================
     METRICS
  ===================================================== */

  .lep-contacts-metrics {
    display:
      grid;

    grid-template-columns:
      repeat(4,1fr);

    gap:
      12px;

    margin:
      22px 0;
  }


  .lep-contacts-metric {
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


  .lep-contacts-metric:hover {
    transform:
      translateY(-4px);

    box-shadow:
      0 21px 44px
      rgba(26,54,93,.10);
  }


  .lep-contacts-metric-icon {
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


  .lep-contacts-metric span {
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


  .lep-contacts-metric strong {
    display:
      block;

    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      20px;
  }


  /* =====================================================
     SECTION
  ===================================================== */

  .lep-contacts-section {
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


  .lep-contacts-section-header {
    display:
      flex;

    align-items:
      center;

    gap:
      12px;

    margin-bottom:
      20px;
  }


  .lep-contacts-section-icon {
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


  .lep-contacts-section-header span {
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


  .lep-contacts-section-header h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      21px;
  }


  .lep-contacts-section-header p {
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
     SEARCH
  ===================================================== */

  .lep-contacts-search {
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


  .lep-contacts-search svg {
    color:
      #2c5f8a;
  }


  .lep-contacts-search input {
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


  .lep-contacts-search span {
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


  /* =====================================================
     LIST
  ===================================================== */

  .lep-contacts-list {
    display:
      grid;

    gap:
      10px;
  }


  .lep-contact-card {
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


  .lep-contact-card:hover {
    transform:
      translateY(-3px);

    box-shadow:
      0 17px 34px
      rgba(26,54,93,.09);

    border-color:
      rgba(44,95,138,.20);
  }


  .lep-contact-icon {
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


  .lep-contact-title {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      7px;
  }


  .lep-contact-title h3 {
    color:
      #1a365d;

    font-size:
      15px;

    text-transform:
      capitalize;
  }


  .lep-contact-primary {
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


  .lep-contact-content p {
    margin-top:
      5px;

    color:
      #718096;

    font-size:
      10px;

    word-break:
      break-word;
  }


  .lep-contact-delete {
    min-height:
      35px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      5px;

    padding:
      0 10px;

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


  /* =====================================================
     EMPTY
  ===================================================== */

  .lep-contacts-empty,
  .lep-contacts-state {
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


  .lep-contacts-empty-icon,
  .lep-contacts-state-icon {
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


  .lep-contacts-empty h3,
  .lep-contacts-state h1 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-contacts-empty p,
  .lep-contacts-state p {
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


  /* =====================================================
     FORM
  ===================================================== */

  .lep-contacts-form {
    display:
      grid;

    gap:
      15px;
  }


  .lep-contacts-grid {
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


  .lep-contact-field {
    display:
      flex;

    flex-direction:
      column;

    gap:
      7px;
  }


  .lep-contact-field label {
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


  .lep-contact-field label svg {
    color:
      #2c5f8a;
  }


  .lep-contact-field input,
  .lep-contact-field select {
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


  .lep-contact-field input:focus,
  .lep-contact-field select:focus {
    background:
      #ffffff;

    border-color:
      #2c5f8a;

    box-shadow:
      0 0 0 4px
      rgba(44,95,138,.07);
  }


  .lep-contact-primary-toggle {
    min-height:
      44px;

    align-self:
      end;

    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    padding:
      0 12px;

    border:
      1px solid #e1e8ef;

    border-radius:
      9px;

    background:
      #f9fbfd;

    color:
      #475569;

    font-size:
      9px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  .lep-contact-primary-toggle input {
    width:
      15px;

    height:
      15px;

    accent-color:
      #1a365d;

    cursor:
      pointer;
  }


  .lep-contact-primary-toggle span {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      6px;
  }


  .lep-contact-primary-toggle svg {
    color:
      #ff6b00;
  }


  .lep-contacts-form-actions {
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


  .lep-contacts-note {
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


  .lep-contacts-note svg {
    color:
      #ff9348;
  }


  .lep-contacts-save {
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


  .lep-contacts-save:hover {
    background:
      #e65f00;
  }


  /* =====================================================
     RESPONSIVE
  ===================================================== */

  @media (max-width: 900px) {

    .lep-contacts-header {
      display:
        block;
    }


    .lep-contacts-back {
      margin-top:
        16px;
    }


    .lep-contacts-metrics {
      grid-template-columns:
        repeat(2,1fr);
    }


    .lep-contact-card {
      grid-template-columns:
        50px
        minmax(0,1fr);
    }


    .lep-contact-delete {
      grid-column:
        1 / -1;

      justify-self:
        start;
    }

  }


  @media (max-width: 650px) {

    .lep-contacts-heading {
      align-items:
        flex-start;
    }


    .lep-contacts-heading h1 {
      font-size:
        37px;
    }


    .lep-contacts-metrics {
      grid-template-columns:
        1fr;
    }


    .lep-contacts-grid {
      grid-template-columns:
        1fr;
    }


    .lep-contact-primary-toggle {
      align-self:
        stretch;
    }


    .lep-contacts-section {
      padding:
        19px;
    }


    .lep-contacts-form-actions {
      display:
        block;
    }


    .lep-contacts-save {
      width:
        100%;

      margin-top:
        12px;
    }

  }

`;

export default ManageContacts;
