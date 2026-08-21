import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


const CATEGORIES = [
  {
    value: "education",
    label: "Education",
    icon: "school",
  },
  {
    value: "scholarships",
    label: "Scholarships",
    icon: "document",
  },
  {
    value: "admissions",
    label: "Admissions",
    icon: "admissions",
  },
  {
    value: "exams",
    label: "Exams",
    icon: "calendar",
  },
  {
    value: "events",
    label: "Events",
    icon: "calendar",
  },
  {
    value: "jobs",
    label: "Jobs",
    icon: "teacher",
  },
  {
    value: "announcements",
    label: "Announcements",
    icon: "news",
  },
  {
    value: "general",
    label: "General",
    icon: "news",
  },
];


function AdminNews() {

  const [news, setNews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState({
      title: "",
      category: "education",
      summary: "",
      content: "",
      cover_image_url: "",
      status: "draft",
    });


  // =========================================================
  // LOAD NEWS
  // =========================================================

  const loadNews = async () => {

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


      const response =
        await fetch(
          "http://localhost:5000/api/news/admin/all",
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
            "Failed to load news."
        );
      }


      setNews(
        data.data?.news || []
      );

    } catch (err) {

      console.error(
        "Load admin news error:",
        err
      );

      setError(
        err.message ||
          "Failed to load news."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadNews();
  }, []);


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


    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  };


  // =========================================================
  // RESET
  // =========================================================

  const resetForm = () => {

    setForm({
      title: "",
      category: "education",
      summary: "",
      content: "",
      cover_image_url: "",
      status: "draft",
    });

    setEditingId(null);

  };


  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (
    article
  ) => {

    setEditingId(
      article.id
    );

    setForm({
      title:
        article.title || "",

      category:
        article.category ||
        "general",

      summary:
        article.summary || "",

      content:
        article.content || "",

      cover_image_url:
        article.cover_image_url ||
        "",

      status:
        article.status ||
        "draft",
    });


    setError("");
    setSuccess("");


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
        !form.title.trim()
      ) {

        setError(
          "News title is required."
        );

        return;
      }


      if (
        !form.content.trim()
      ) {

        setError(
          "News content is required."
        );

        return;
      }


      try {

        setSaving(true);


        const token =
          localStorage.getItem(
            "authToken"
          );


        const payload = {
          title:
            form.title.trim(),

          category:
            form.category,

          summary:
            form.summary.trim() ||
            null,

          content:
            form.content.trim(),

          cover_image_url:
            form.cover_image_url.trim() ||
            null,

          status:
            form.status,
        };


        let response;


        if (editingId) {

          response =
            await fetch(
              `http://localhost:5000/api/news/${editingId}`,
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

        } else {

          response =
            await fetch(
              "http://localhost:5000/api/news",
              {
                method: "POST",

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
              "Failed to save news."
          );
        }


        setSuccess(
          editingId
            ? "News updated successfully."
            : "News created successfully."
        );


        resetForm();

        await loadNews();

      } catch (err) {

        console.error(
          "Save news error:",
          err
        );

        setError(
          err.message ||
            "Failed to save news."
        );

      } finally {

        setSaving(false);

      }

    };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (
    article
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${article.title}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setActionLoading(
        article.id
      );

      setError("");
      setSuccess("");


      const token =
        localStorage.getItem(
          "authToken"
        );


      const response =
        await fetch(
          `http://localhost:5000/api/news/${article.id}`,
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
            "Failed to delete news."
        );
      }


      setSuccess(
        "News deleted successfully."
      );


      if (
        editingId ===
        article.id
      ) {
        resetForm();
      }


      await loadNews();

    } catch (err) {

      console.error(
        "Delete news error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete news."
      );

    } finally {

      setActionLoading(null);

    }

  };


  // =========================================================
  // PUBLISH / DRAFT
  // =========================================================

  const toggleStatus =
    async (article) => {

      try {

        setActionLoading(
          article.id
        );

        setError("");
        setSuccess("");


        const token =
          localStorage.getItem(
            "authToken"
          );


        const response =
          await fetch(
            `http://localhost:5000/api/news/${article.id}/status`,
            {
              method: "PUT",

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
              "Failed to change news status."
          );
        }


        setSuccess(
          data.message ||
            "News status updated."
        );


        await loadNews();

      } catch (err) {

        console.error(
          "Toggle news error:",
          err
        );

        setError(
          err.message ||
            "Failed to change news status."
        );

      } finally {

        setActionLoading(null);

      }

    };


  // =========================================================
  // CATEGORY INFORMATION
  // =========================================================

  const getCategory = (
    value
  ) => {

    return (
      CATEGORIES.find(
        (category) =>
          category.value === value
      ) ||
      CATEGORIES[CATEGORIES.length - 1]
    );

  };


  return (
    <>
      <style>{`
        /* =====================================================
           ADMIN NEWS PREMIUM 3D
        ===================================================== */

        .lep-news-admin {
          min-height: 100vh;

          padding:
            45px 0 90px;

          background:
            radial-gradient(
              circle at 90% 6%,
              rgba(44,95,138,.12),
              transparent 24%
            ),
            radial-gradient(
              circle at 5% 65%,
              rgba(255,107,0,.06),
              transparent 22%
            ),
            linear-gradient(
              180deg,
              #f7f9fc,
              #edf3f8
            );
        }


        .lep-news-container {
          width:
            min(1180px, calc(100% - 32px));

          margin:
            0 auto;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .lep-news-header {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 25px;

          margin-bottom: 25px;
        }


        .lep-news-eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 6px;

          color: #ff6b00;

          font-size: 10px;

          font-weight: 900;

          letter-spacing: 1.5px;
        }


        .lep-news-title {
          margin-top: 8px;

          color: #1a365d;

          font-size:
            clamp(
              36px,
              5vw,
              53px
            );

          line-height: 1;

          letter-spacing: -1.7px;
        }


        .lep-news-header p {
          max-width: 690px;

          margin-top: 10px;

          color: #718096;

          font-size: 12px;

          line-height: 1.7;
        }


        .lep-news-back {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          min-height: 42px;

          padding:
            0 14px;

          border:
            1px solid #dce4ec;

          border-radius: 9px;

          background: #ffffff;

          color: #1a365d;

          text-decoration: none;

          font-size: 10px;

          font-weight: 800;

          box-shadow:
            0 8px 20px
            rgba(26,54,93,.05);

          transition:
            transform .2s ease,
            border-color .2s ease,
            color .2s ease;
        }


        .lep-news-back:hover {
          transform:
            translateY(-2px);

          border-color:
            #2c5f8a;

          color:
            #2c5f8a;
        }


        /* =====================================================
           ALERTS
        ===================================================== */

        .lep-news-alert {
          display: flex;

          align-items: center;

          gap: 9px;

          margin-bottom: 15px;

          padding:
            12px 14px;

          border-radius:
            9px;

          font-size:
            11px;

          font-weight:
            700;
        }


        .lep-news-alert.error {
          background: #fff2f2;

          border:
            1px solid #f3cccc;

          color:
            #b42318;
        }


        .lep-news-alert.success {
          background: #effaf2;

          border:
            1px solid #c6e6ce;

          color:
            #17743a;
        }


        /* =====================================================
           EDITOR
        ===================================================== */

        .lep-news-editor {
          padding:
            26px;

          background:
            rgba(255,255,255,.95);

          border:
            1px solid #e2e8f0;

          border-radius:
            18px;

          box-shadow:
            0 18px 42px
            rgba(26,54,93,.065);

          backdrop-filter:
            blur(14px);
        }


        .lep-editor-heading {
          display: flex;

          align-items: center;

          gap: 13px;

          margin-bottom: 22px;
        }


        .lep-editor-icon {
          width: 46px;
          height: 46px;

          display: grid;

          place-items: center;

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
            0 9px 0 #142b47,
            0 15px 27px
            rgba(26,54,93,.14);

          transform:
            perspective(700px)
            rotateX(4deg);
        }


        .lep-editor-heading span {
          display: block;

          color:
            #ff6b00;

          font-size:
            9px;

          font-weight:
            900;

          letter-spacing:
            1.3px;
        }


        .lep-editor-heading h2 {
          margin-top:
            4px;

          color:
            #1a365d;

          font-size:
            23px;
        }


        .lep-editor-heading p {
          margin-top:
            4px;

          color:
            #718096;

          font-size:
            10px;
        }


        /* FORM */

        .lep-news-form {
          display:
            grid;

          gap:
            17px;
        }


        .lep-news-form-grid {
          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            14px;
        }


        .lep-news-field {
          display:
            flex;

          flex-direction:
            column;

          gap:
            7px;
        }


        .lep-news-field.full {
          grid-column:
            1 / -1;
        }


        .lep-news-field label {
          display:
            flex;

          align-items:
            center;

          gap:
            6px;

          color:
            #475569;

          font-size:
            10px;

          font-weight:
            900;
        }


        .lep-news-field label svg {
          color:
            #2c5f8a;
        }


        .lep-news-field input,
        .lep-news-field select,
        .lep-news-field textarea {
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

          resize:
            vertical;

          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }


        .lep-news-field input:focus,
        .lep-news-field select:focus,
        .lep-news-field textarea:focus {
          background:
            #ffffff;

          border-color:
            #2c5f8a;

          box-shadow:
            0 0 0 4px
            rgba(44,95,138,.07);
        }


        .lep-news-field input::placeholder,
        .lep-news-field textarea::placeholder {
          color:
            #a0acb8;
        }


        .lep-news-field textarea {
          min-height:
            120px;

          line-height:
            1.7;
        }


        .lep-news-editor-image {
          margin-top:
            -3px;

          min-height:
            150px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          overflow:
            hidden;

          border:
            1px dashed #ccd7e1;

          border-radius:
            11px;

          background:
            #f8fafc;
        }


        .lep-news-editor-image img {
          width:
            100%;

          max-height:
            220px;

          object-fit:
            cover;

          display:
            block;
        }


        .lep-news-editor-image-placeholder {
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
            10px;
        }


        .lep-news-editor-image-placeholder svg {
          color:
            #2c5f8a;
        }


        /* FORM ACTIONS */

        .lep-news-form-actions {
          display:
            flex;

          align-items:
            center;

          justify-content:
            flex-end;

          flex-wrap:
            wrap;

          gap:
            8px;

          padding-top:
            4px;
        }


        .lep-news-cancel,
        .lep-news-save {
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
            background .2s ease,
            border-color .2s ease;
        }


        .lep-news-cancel {
          border:
            1px solid #dce4ec;

          background:
            #ffffff;

          color:
            #1a365d;
        }


        .lep-news-save {
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
            0 9px 20px
            rgba(26,54,93,.14);
        }


        .lep-news-save:hover,
        .lep-news-cancel:hover {
          transform:
            translateY(-2px);
        }


        .lep-news-save:hover {
          background:
            linear-gradient(
              135deg,
              #ff6b00,
              #e65f00
            );
        }


        /* =====================================================
           NEWS DIRECTORY
        ===================================================== */

        .lep-news-directory {
          margin-top:
            24px;

          padding:
            26px;

          background:
            rgba(255,255,255,.95);

          border:
            1px solid #e2e8f0;

          border-radius:
            18px;

          box-shadow:
            0 18px 42px
            rgba(26,54,93,.05);
        }


        .lep-directory-heading {
          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            20px;

          margin-bottom:
            20px;
        }


        .lep-directory-heading > div:first-child span {
          color:
            #ff6b00;

          font-size:
            9px;

          font-weight:
            900;

          letter-spacing:
            1.4px;
        }


        .lep-directory-heading h2 {
          margin-top:
            6px;

          color:
            #1a365d;

          font-size:
            25px;
        }


        .lep-news-total {
          min-width:
            100px;

          padding:
            10px 12px;

          border-radius:
            9px;

          background:
            #f1f5f9;

          text-align:
            center;
        }


        .lep-news-total span {
          display:
            block;

          color:
            #94a3b8;

          font-size:
            8px;

          font-weight:
            900;
        }


        .lep-news-total strong {
          display:
            block;

          margin-top:
            3px;

          color:
            #1a365d;

          font-size:
            20px;
        }


        /* LOADING / EMPTY */

        .lep-news-state {
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

          text-align:
            center;

          padding:
            40px;

          border:
            1px solid #e7edf2;

          border-radius:
            14px;

          background:
            #f9fbfd;
        }


        .lep-news-state-icon {
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


        .lep-news-state h3 {
          color:
            #1a365d;

          font-size:
            18px;
        }


        .lep-news-state p {
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


        /* =====================================================
           NEWS CARDS
        ===================================================== */

        .lep-news-list {
          display:
            grid;

          gap:
            12px;
        }


        .lep-news-item {
          display:
            grid;

          grid-template-columns:
            90px
            minmax(0,1fr)
            auto;

          gap:
            15px;

          align-items:
            center;

          padding:
            15px;

          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f5f8fb
            );

          border:
            1px solid #e2e8f0;

          border-radius:
            13px;

          transition:
            transform .28s ease,
            box-shadow .28s ease,
            border-color .28s ease;
        }


        .lep-news-item:hover {
          transform:
            translateY(-4px);

          border-color:
            rgba(44,95,138,.23);

          box-shadow:
            0 18px 36px
            rgba(26,54,93,.09);
        }


        .lep-news-thumb {
          width:
            90px;

          height:
            75px;

          overflow:
            hidden;

          display:
            grid;

          place-items:
            center;

          border-radius:
            10px;

          background:
            linear-gradient(
              135deg,
              #dce8f1,
              #2c5f8a
            );

          color:
            #ff9348;
        }


        .lep-news-thumb img {
          width:
            100%;

          height:
            100%;

          object-fit:
            cover;

          display:
            block;
        }


        .lep-news-item-body {
          min-width:
            0;
        }


        .lep-news-item-top {
          display:
            flex;

          align-items:
            center;

          flex-wrap:
            wrap;

          gap:
            7px;
        }


        .lep-news-category {
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
            rgba(255,107,0,.09);

          color:
            #cf5600;

          font-size:
            8px;

          font-weight:
            900;

          text-transform:
            uppercase;
        }


        .lep-news-item h3 {
          margin-top:
            7px;

          color:
            #1a365d;

          font-size:
            15px;

          line-height:
            1.3;
        }


        .lep-news-item p {
          margin-top:
            5px;

          color:
            #718096;

          font-size:
            10px;

          line-height:
            1.55;
        }


        .lep-news-meta {
          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            12px;

          margin-top:
            7px;

          color:
            #9aa5b1;

          font-size:
            8px;
        }


        .lep-news-status {
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

          font-size:
            8px;

          font-weight:
            900;

          text-transform:
            uppercase;
        }


        .lep-news-status.published {
          background:
            #eaf7ee;

          color:
            #16803c;
        }


        .lep-news-status.draft {
          background:
            #fff5e8;

          color:
            #b25c00;
        }


        .lep-news-actions {
          display:
            flex;

          flex-wrap:
            wrap;

          justify-content:
            flex-end;

          gap:
            7px;
        }


        .lep-news-action {
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
            background .2s ease,
            color .2s ease,
            border-color .2s ease;
        }


        .lep-news-action:hover {
          transform:
            translateY(-2px);
        }


        .lep-news-action.edit {
          border:
            1px solid #dce4ec;

          background:
            #ffffff;

          color:
            #1a365d;
        }


        .lep-news-action.publish {
          border:
            none;

          background:
            #1a365d;

          color:
            #ffffff;
        }


        .lep-news-action.publish:hover {
          background:
            #ff6b00;
        }


        .lep-news-action.delete {
          border:
            1px solid #f1caca;

          background:
            #fff7f7;

          color:
            #b42318;
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 900px) {

          .lep-news-form-grid {
            grid-template-columns:
              1fr;
          }

          .lep-news-field.full {
            grid-column:
              auto;
          }

          .lep-news-item {
            grid-template-columns:
              78px
              minmax(0,1fr);
          }

          .lep-news-actions {
            grid-column:
              1 / -1;

            justify-content:
              flex-start;

            padding-top:
              4px;
          }

        }


        @media (max-width: 650px) {

          .lep-news-header {
            display:
              block;
          }

          .lep-news-back {
            margin-top:
              16px;
          }

          .lep-news-editor,
          .lep-news-directory {
            padding:
              19px;
          }

          .lep-news-item {
            grid-template-columns:
              1fr;
          }

          .lep-news-thumb {
            width:
              100%;

            height:
              150px;
          }

          .lep-news-actions {
            width:
              100%;
          }

          .lep-news-action {
            flex:
              1;
          }

        }
      `}</style>


      <main className="lep-news-admin">

        <div className="lep-news-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-news-header">

            <div>

              <span className="lep-news-eyebrow">

                <SmartIcon
                  name="news"
                  size={13}
                />

                ADMINISTRATION

              </span>


              <h1 className="lep-news-title">
                Educational News
              </h1>


              <p>
                Publish scholarships, admissions,
                exam notices, educational events,
                jobs and important announcements
                for the Loralai community.
              </p>

            </div>


            <Link
              to="/admin"
              className="lep-news-back"
            >

              <SmartIcon
                name="arrow-left"
                size={14}
              />

              Dashboard

            </Link>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-news-alert error">

              <SmartIcon
                name="warning"
                size={15}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-news-alert success">

              <SmartIcon
                name="verified"
                size={15}
              />

              {success}

            </div>

          )}


          {/* =====================================================
              EDITOR
          ===================================================== */}

          <section className="lep-news-editor">


            <div className="lep-editor-heading">

              <div className="lep-editor-icon">

                <SmartIcon
                  name={
                    editingId
                      ? "edit"
                      : "news"
                  }
                  size={23}
                />

              </div>


              <div>

                <span>
                  {editingId
                    ? "EDIT NEWS"
                    : "CREATE NEWS"}
                </span>


                <h2>
                  {editingId
                    ? "Edit Educational News"
                    : "Publish Educational News"}
                </h2>


                <p>
                  Create clear and useful
                  educational updates for
                  students, teachers and parents.
                </p>

              </div>

            </div>


            <form
              className="lep-news-form"
              onSubmit={
                handleSubmit
              }
            >


              <div className="lep-news-form-grid">


                {/* TITLE */}

                <div className="lep-news-field full">

                  <label>

                    <SmartIcon
                      name="news"
                      size={14}
                    />

                    News Title *

                  </label>


                  <input
                    type="text"
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter a clear news headline"
                    required
                  />

                </div>


                {/* CATEGORY */}

                <div className="lep-news-field">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Category

                  </label>


                  <select
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleChange
                    }
                  >

                    {CATEGORIES.map(
                      (category) => (

                        <option
                          key={
                            category.value
                          }
                          value={
                            category.value
                          }
                        >
                          {category.label}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* STATUS */}

                <div className="lep-news-field">

                  <label>

                    <SmartIcon
                      name="verified"
                      size={14}
                    />

                    Publication Status

                  </label>


                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>

                  </select>

                </div>


                {/* COVER IMAGE */}

                <div className="lep-news-field full">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Cover Image URL

                  </label>


                  <input
                    type="url"
                    name="cover_image_url"
                    value={
                      form.cover_image_url
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://example.com/news-image.jpg"
                  />

                </div>


                {/* IMAGE PREVIEW */}

                <div className="lep-news-field full">

                  <div className="lep-news-editor-image">

                    {form.cover_image_url ? (

                      <img
                        src={
                          form.cover_image_url
                        }
                        alt="News preview"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="lep-news-editor-image-placeholder">

                        <SmartIcon
                          name="news"
                          size={34}
                        />

                        <span>
                          Cover image preview
                        </span>

                      </div>

                    )}

                  </div>

                </div>


                {/* SUMMARY */}

                <div className="lep-news-field full">

                  <label>

                    <SmartIcon
                      name="document"
                      size={14}
                    />

                    Short Summary

                  </label>


                  <textarea
                    name="summary"
                    rows="4"
                    value={
                      form.summary
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Write a short description that will appear on the news card..."
                  />

                </div>


                {/* CONTENT */}

                <div className="lep-news-field full">

                  <label>

                    <SmartIcon
                      name="news"
                      size={14}
                    />

                    Full Article *

                  </label>


                  <textarea
                    name="content"
                    rows="14"
                    value={
                      form.content
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Write the complete educational news article here..."
                    required
                  />

                </div>

              </div>


              {/* ACTIONS */}

              <div className="lep-news-form-actions">

                {editingId && (

                  <button
                    type="button"
                    className="lep-news-cancel"
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
                  className="lep-news-save"
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
                    ? "Update News"
                    : "Create News"}

                </button>

              </div>

            </form>

          </section>


          {/* =====================================================
              NEWS DIRECTORY
          ===================================================== */}

          <section className="lep-news-directory">


            <div className="lep-directory-heading">

              <div>

                <span>
                  NEWS DIRECTORY
                </span>


                <h2>
                  All Educational News
                </h2>

              </div>


              <div className="lep-news-total">

                <span>
                  TOTAL ARTICLES
                </span>

                <strong>
                  {news.length}
                </strong>

              </div>

            </div>


            {/* LOADING */}

            {loading && (

              <div className="lep-news-state">

                <div className="lep-news-state-icon">

                  <SmartIcon
                    name="news"
                    size={25}
                  />

                </div>


                <h3>
                  Loading news...
                </h3>


                <p>
                  Loading your educational
                  news directory.
                </p>

              </div>

            )}


            {/* EMPTY */}

            {!loading &&
              news.length === 0 && (

                <div className="lep-news-state">

                  <div className="lep-news-state-icon">

                    <SmartIcon
                      name="news"
                      size={25}
                    />

                  </div>


                  <h3>
                    No News Yet
                  </h3>


                  <p>
                    Create your first educational
                    news article using the editor
                    above.
                  </p>

                </div>

              )}


            {/* LIST */}

            {!loading &&
              news.length > 0 && (

                <div className="lep-news-list">

                  {news.map(
                    (article) => {

                      const category =
                        getCategory(
                          article.category
                        );


                      const processing =
                        actionLoading ===
                        article.id;


                      return (
                        <article
                          key={
                            article.id
                          }
                          className="lep-news-item"
                        >


                          {/* THUMBNAIL */}

                          <div className="lep-news-thumb">

                            {article.cover_image_url ? (

                              <img
                                src={
                                  article.cover_image_url
                                }
                                alt=""
                              />

                            ) : (

                              <SmartIcon
                                name="news"
                                size={27}
                              />

                            )}

                          </div>


                          {/* BODY */}

                          <div className="lep-news-item-body">


                            <div className="lep-news-item-top">

                              <span className="lep-news-category">

                                <SmartIcon
                                  name={
                                    category.icon
                                  }
                                  size={11}
                                />

                                {category.label}

                              </span>


                              <span
                                className={
                                  article.status ===
                                  "published"
                                    ? "lep-news-status published"
                                    : "lep-news-status draft"
                                }
                              >

                                <SmartIcon
                                  name={
                                    article.status ===
                                    "published"
                                      ? "verified"
                                      : "calendar"
                                  }
                                  size={10}
                                />

                                {article.status}

                              </span>

                            </div>


                            <h3>
                              {article.title}
                            </h3>


                            <p>
                              {article.summary ||
                                "No summary provided."}
                            </p>


                            <div className="lep-news-meta">

                              <span>
                                Author:{" "}
                                {article.author_name ||
                                  "Admin"}
                              </span>


                              <span>
                                {article.published_at
                                  ? new Date(
                                      article.published_at
                                    ).toLocaleDateString()
                                  : "Not published"}
                              </span>

                            </div>

                          </div>


                          {/* ACTIONS */}

                          <div className="lep-news-actions">


                            <button
                              type="button"
                              className="lep-news-action edit"
                              onClick={() =>
                                handleEdit(
                                  article
                                )
                              }
                              disabled={
                                processing
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
                              className="lep-news-action publish"
                              onClick={() =>
                                toggleStatus(
                                  article
                                )
                              }
                              disabled={
                                processing
                              }
                            >

                              <SmartIcon
                                name={
                                  processing
                                    ? "settings"
                                    : article.status ===
                                      "published"
                                    ? "calendar"
                                    : "verified"
                                }
                                size={12}
                              />

                              {processing
                                ? "Processing..."
                                : article.status ===
                                  "published"
                                ? "Draft"
                                : "Publish"}

                            </button>


                            <button
                              type="button"
                              className="lep-news-action delete"
                              onClick={() =>
                                handleDelete(
                                  article
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

                              Delete

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


export default AdminNews;