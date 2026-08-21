import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";


function AdminTutors() {
  const [tutors, setTutors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");


  // =========================================================
  // LOAD TUTORS
  // =========================================================

  const loadTutors = async () => {
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

      const response =
        await fetch(
          "http://localhost:5000/api/tutors",
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
            "Failed to load tutors."
        );
      }

      setTutors(
        data.data?.tutors || []
      );

    } catch (err) {
      console.error(
        "Load tutors error:",
        err
      );

      setError(
        err.message ||
          "Failed to load tutors."
      );

      setTutors([]);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTutors();
  }, []);


  // =========================================================
  // ACTION
  // =========================================================

  const handleAction = async (
    tutorId,
    action
  ) => {

    const messages = {
      approve:
        "Approve this tutor and publish the profile?",

      reject:
        "Reject this tutor?",

      delete:
        "Delete this tutor permanently?",
    };


    if (
      !window.confirm(
        messages[action]
      )
    ) {
      return;
    }


    try {
      setActionLoading(tutorId);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem(
          "authToken"
        );


      const options = {
        method:
          action === "delete"
            ? "DELETE"
            : "PUT",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      };


      const response =
        await fetch(
          `http://localhost:5000/api/tutors/${tutorId}${
            action === "delete"
              ? ""
              : `/${action}`
          }`,
          options
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            `Failed to ${action} tutor.`
        );
      }


      const successMessages = {
        approve:
          "Tutor approved successfully.",

        reject:
          "Tutor rejected successfully.",

        delete:
          "Tutor deleted successfully.",
      };


      setSuccess(
        successMessages[action]
      );


      await loadTutors();

    } catch (err) {
      console.error(
        "Tutor action error:",
        err
      );

      setError(
        err.message ||
          `Failed to ${action} tutor.`
      );

    } finally {
      setActionLoading(null);
    }
  };


  // =========================================================
  // FILTER
  // =========================================================

  const filteredTutors = useMemo(() => {

    const query =
      search.trim().toLowerCase();


    return tutors.filter(
      (tutor) => {

        const matchesSearch =
          !query ||
          tutor.full_name
            ?.toLowerCase()
            .includes(query) ||
          tutor.qualification
            ?.toLowerCase()
            .includes(query) ||
          tutor.subjects
            ?.toLowerCase()
            .includes(query) ||
          tutor.specialization
            ?.toLowerCase()
            .includes(query) ||
          tutor.city
            ?.toLowerCase()
            .includes(query) ||
          tutor.area
            ?.toLowerCase()
            .includes(query);


        const matchesStatus =
          statusFilter === "all" ||
          tutor.status ===
            statusFilter;


        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  }, [
    tutors,
    search,
    statusFilter,
  ]);


  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics = useMemo(() => {

    return {
      total:
        tutors.length,

      approved:
        tutors.filter(
          (tutor) =>
            tutor.status === "approved"
        ).length,

      pending:
        tutors.filter(
          (tutor) =>
            tutor.status === "pending" ||
            tutor.status === "draft"
        ).length,

      rejected:
        tutors.filter(
          (tutor) =>
            tutor.status === "rejected"
        ).length,
    };

  }, [tutors]);


  return (
    <>
      <style>{`

        /* =====================================================
           ADMIN TUTORS
        ===================================================== */

        .lep-admin-tutors {
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


        .lep-tutor-container {
          width:
            min(
              1200px,
              calc(100% - 32px)
            );

          margin:
            0 auto;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .lep-tutor-header {
          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            24px;

          margin-bottom:
            24px;
        }


        .lep-tutor-heading {
          display:
            flex;

          align-items:
            center;

          gap:
            15px;
        }


        .lep-tutor-page-icon {
          width:
            58px;

          height:
            58px;

          display:
            grid;

          place-items:
            center;

          flex-shrink:
            0;

          border-radius:
            15px;

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


        .lep-tutor-eyebrow {
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


        .lep-tutor-title {
          margin-top:
            7px;

          color:
            #1a365d;

          font-size:
            clamp(
              35px,
              5vw,
              53px
            );

          line-height:
            1;

          letter-spacing:
            -1.8px;
        }


        .lep-tutor-description {
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


        .lep-tutor-header-actions {
          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            8px;
        }


        .lep-tutor-refresh,
        .lep-tutor-add {
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
            0 14px;

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
            background .2s ease,
            border-color .2s ease;
        }


        .lep-tutor-refresh {
          border:
            1px solid #dce4ec;

          background:
            #ffffff;

          color:
            #1a365d;
        }


        .lep-tutor-add {
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


        .lep-tutor-refresh:hover,
        .lep-tutor-add:hover {
          transform:
            translateY(-2px);
        }


        .lep-tutor-add:hover {
          background:
            linear-gradient(
              135deg,
              #ff6b00,
              #e65f00
            );
        }


        /* =====================================================
           MESSAGES
        ===================================================== */

        .lep-tutor-message {
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


        .lep-tutor-message.error {
          background:
            #fff2f2;

          border:
            1px solid #f1cccc;

          color:
            #b42318;
        }


        .lep-tutor-message.success {
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

        .lep-tutor-metrics {
          display:
            grid;

          grid-template-columns:
            repeat(4,1fr);

          gap:
            12px;

          margin:
            22px 0;
        }


        .lep-tutor-metric {
          min-height:
            118px;

          padding:
            18px;

          background:
            rgba(255,255,255,.96);

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


        .lep-tutor-metric:hover {
          transform:
            translateY(-5px);

          box-shadow:
            0 21px 44px
            rgba(26,54,93,.10);
        }


        .lep-tutor-metric-icon {
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
            0 7px 0 #142b47,
            0 12px 20px
            rgba(26,54,93,.12);
        }


        .lep-tutor-metric span {
          display:
            block;

          margin-top:
            10px;

          color:
            #94a3b8;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            1px;
        }


        .lep-tutor-metric strong {
          display:
            block;

          margin-top:
            3px;

          color:
            #1a365d;

          font-size:
            26px;
        }


        /* =====================================================
           FILTER
        ===================================================== */

        .lep-tutor-filter {
          display:
            grid;

          grid-template-columns:
            minmax(0,1fr)
            190px
            110px;

          gap:
            10px;

          margin-bottom:
            16px;

          padding:
            14px;

          background:
            #ffffff;

          border:
            1px solid #e2e8f0;

          border-radius:
            14px;

          box-shadow:
            0 12px 28px
            rgba(26,54,93,.05);
        }


        .lep-tutor-search {
          min-height:
            48px;

          display:
            flex;

          align-items:
            center;

          gap:
            8px;

          padding:
            0 13px;

          border:
            1px solid #e2e8f0;

          border-radius:
            9px;

          background:
            #fbfdff;
        }


        .lep-tutor-search svg {
          color:
            #2c5f8a;
        }


        .lep-tutor-search input {
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


        .lep-tutor-select {
          min-height:
            48px;

          display:
            flex;

          flex-direction:
            column;

          justify-content:
            center;

          padding:
            0 11px;

          border:
            1px solid #e2e8f0;

          border-radius:
            9px;

          background:
            #ffffff;
        }


        .lep-tutor-select span {
          color:
            #94a3b8;

          font-size:
            8px;

          font-weight:
            900;
        }


        .lep-tutor-select select {
          margin-top:
            2px;

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
            10px;
        }


        .lep-tutor-count {
          min-height:
            48px;

          display:
            flex;

          flex-direction:
            column;

          justify-content:
            center;

          padding:
            0 12px;

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
        }


        .lep-tutor-count span {
          color:
            #c7d5e1;

          font-size:
            8px;

          font-weight:
            900;
        }


        .lep-tutor-count strong {
          color:
            #ff964d;

          font-size:
            18px;
        }


        /* =====================================================
           LIST
        ===================================================== */

        .lep-tutor-list {
          display:
            grid;

          gap:
            12px;
        }


        .lep-tutor-card {
          position:
            relative;

          overflow:
            hidden;

          display:
            grid;

          grid-template-columns:
            minmax(0,1fr)
            auto;

          gap:
            18px;

          padding:
            18px;

          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f4f8fb
            );

          border:
            1px solid #e2e8f0;

          border-radius:
            16px;

          box-shadow:
            0 10px 27px
            rgba(26,54,93,.05);

          transition:
            transform .28s ease,
            box-shadow .28s ease,
            border-color .28s ease;
        }


        .lep-tutor-card::before {
          content:
            "";

          position:
            absolute;

          left:
            0;

          top:
            0;

          bottom:
            0;

          width:
            4px;

          background:
            linear-gradient(
              180deg,
              #1a365d,
              #ff6b00
            );
        }


        .lep-tutor-card:hover {
          transform:
            translateY(-5px);

          box-shadow:
            0 23px 48px
            rgba(26,54,93,.11);

          border-color:
            rgba(44,95,138,.25);
        }


        /* MAIN */

        .lep-tutor-main {
          min-width:
            0;

          display:
            grid;

          grid-template-columns:
            62px minmax(0,1fr);

          gap:
            14px;

          align-items:
            start;
        }


        .lep-tutor-avatar {
          width:
            62px;

          height:
            62px;

          display:
            grid;

          place-items:
            center;

          overflow:
            hidden;

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

          font-size:
            22px;

          font-weight:
            900;

          box-shadow:
            0 8px 0 #142b47,
            0 15px 25px
            rgba(26,54,93,.14);

          transform:
            perspective(700px)
            rotateX(4deg)
            rotateY(-3deg);
        }


        .lep-tutor-avatar img {
          width:
            100%;

          height:
            100%;

          object-fit:
            cover;

          display:
            block;
        }


        .lep-tutor-title-row {
          display:
            flex;

          align-items:
            center;

          flex-wrap:
            wrap;

          gap:
            7px;
        }


        .lep-tutor-title-row h2 {
          color:
            #1a365d;

          font-size:
            18px;

          line-height:
            1.25;
        }


        .lep-tutor-status {
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


        .lep-tutor-status.approved {
          background:
            #eaf7ee;

          color:
            #16803c;
        }


        .lep-tutor-status.pending,
        .lep-tutor-status.draft {
          background:
            #fff5e8;

          color:
            #b25c00;
        }


        .lep-tutor-status.rejected {
          background:
            #fff0f0;

          color:
            #b42318;
        }


        .lep-tutor-subtitle {
          margin-top:
            6px;

          color:
            #425466;

          font-size:
            10px;
        }


        .lep-tutor-subjects {
          margin-top:
            4px;

          color:
            #718096;

          font-size:
            10px;
        }


        .lep-tutor-location {
          display:
            flex;

          align-items:
            center;

          gap:
            5px;

          margin-top:
            6px;

          color:
            #718096;

          font-size:
            10px;
        }


        .lep-tutor-location svg {
          color:
            #ff6b00;
        }


        /* META */

        .lep-tutor-meta {
          display:
            grid;

          grid-template-columns:
            repeat(4,minmax(80px,1fr));

          gap:
            8px;

          margin-top:
            14px;

          padding-top:
            12px;

          border-top:
            1px solid #edf1f5;
        }


        .lep-tutor-meta-box {
          padding:
            9px;

          border-radius:
            8px;

          background:
            #f8fafc;
        }


        .lep-tutor-meta-box span {
          display:
            block;

          color:
            #94a3b8;

          font-size:
            7px;

          font-weight:
            900;

          letter-spacing:
            .7px;
        }


        .lep-tutor-meta-box strong {
          display:
            block;

          margin-top:
            3px;

          color:
            #1a365d;

          font-size:
            10px;
        }


        /* ACTIONS */

        .lep-tutor-actions {
          display:
            flex;

          flex-wrap:
            wrap;

          align-items:
            center;

          justify-content:
            flex-end;

          gap:
            7px;

          max-width:
            330px;
        }


        .lep-tutor-action {
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
            0 9px;

          border-radius:
            8px;

          font-family:
            inherit;

          font-size:
            8px;

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


        .lep-tutor-action:hover {
          transform:
            translateY(-2px);
        }


        .lep-tutor-action.edit {
          border:
            1px solid #dce4ec;

          background:
            #ffffff;

          color:
            #1a365d;
        }


        .lep-tutor-action.approve {
          border:
            none;

          background:
            #16803c;

          color:
            #ffffff;
        }


        .lep-tutor-action.approve:hover {
          background:
            #11652f;
        }


        .lep-tutor-action.reject {
          border:
            1px solid #f0caca;

          background:
            #fff7f7;

          color:
            #b42318;
        }


        .lep-tutor-action.delete {
          border:
            1px solid #f0caca;

          background:
            #fff7f7;

          color:
            #b42318;
        }


        /* =====================================================
           STATE
        ===================================================== */

        .lep-tutor-state {
          min-height:
            330px;

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
            rgba(255,255,255,.96);

          border:
            1px solid #e2e8f0;

          border-radius:
            17px;

          box-shadow:
            0 14px 34px
            rgba(26,54,93,.06);
        }


        .lep-tutor-state-icon {
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

          box-shadow:
            0 10px 22px
            rgba(26,54,93,.14);
        }


        .lep-tutor-state h2 {
          color:
            #1a365d;

          font-size:
            21px;
        }


        .lep-tutor-state p {
          max-width:
            490px;

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
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1050px) {

          .lep-tutor-metrics {
            grid-template-columns:
              repeat(2,1fr);
          }


          .lep-tutor-card {
            grid-template-columns:
              1fr;
          }


          .lep-tutor-actions {
            max-width:
              none;

            justify-content:
              flex-start;
          }

        }


        @media (max-width: 780px) {

          .lep-tutor-header {
            display:
              block;
          }


          .lep-tutor-header-actions {
            margin-top:
              16px;
          }


          .lep-tutor-filter {
            grid-template-columns:
              1fr;
          }


          .lep-tutor-meta {
            grid-template-columns:
              repeat(2,1fr);
          }

        }


        @media (max-width: 600px) {

          .lep-tutor-metrics {
            grid-template-columns:
              1fr;
          }


          .lep-tutor-main {
            grid-template-columns:
              48px minmax(0,1fr);
          }


          .lep-tutor-avatar {
            width:
              48px;

            height:
              48px;

            border-radius:
              12px;
          }


          .lep-tutor-actions {
            display:
              grid;

            grid-template-columns:
              repeat(2,1fr);

            width:
              100%;
          }


          .lep-tutor-action {
            width:
              100%;
          }

        }

      `}</style>


      <main className="lep-admin-tutors">

        <div className="lep-tutor-container">


          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-tutor-header">

            <div className="lep-tutor-heading">

              <div className="lep-tutor-page-icon">

                <SmartIcon
                  name="tutor"
                  size={27}
                />

              </div>


              <div>

                <span className="lep-tutor-eyebrow">

                  <SmartIcon
                    name="dashboard"
                    size={12}
                  />

                  ADMINISTRATION

                </span>


                <h1 className="lep-tutor-title">
                  Tutor Management
                </h1>


                <p className="lep-tutor-description">
                  Add, review, approve and manage
                  verified home tutors for students
                  and parents in Loralai.
                </p>

              </div>

            </div>


            <div className="lep-tutor-header-actions">

              <button
                type="button"
                className="lep-tutor-refresh"
                onClick={loadTutors}
                disabled={loading}
              >

                <SmartIcon
                  name="settings"
                  size={14}
                />

                Refresh

              </button>


              <Link
                to="/admin/tutors/add"
                className="lep-tutor-add"
              >

                <SmartIcon
                  name="plus"
                  size={15}
                />

                Add Tutor

              </Link>

            </div>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-tutor-message error">

              <SmartIcon
                name="warning"
                size={14}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-tutor-message success">

              <SmartIcon
                name="verified"
                size={14}
              />

              {success}

            </div>

          )}


          {/* =====================================================
              METRICS
          ===================================================== */}

          <section className="lep-tutor-metrics">


            <div className="lep-tutor-metric">

              <div className="lep-tutor-metric-icon">

                <SmartIcon
                  name="tutor"
                  size={19}
                />

              </div>


              <span>
                TOTAL TUTORS
              </span>


              <strong>
                {statistics.total}
              </strong>

            </div>


            <div className="lep-tutor-metric">

              <div className="lep-tutor-metric-icon">

                <SmartIcon
                  name="verified"
                  size={19}
                />

              </div>


              <span>
                APPROVED
              </span>


              <strong>
                {statistics.approved}
              </strong>

            </div>


            <div className="lep-tutor-metric">

              <div className="lep-tutor-metric-icon">

                <SmartIcon
                  name="calendar"
                  size={19}
                />

              </div>


              <span>
                PENDING
              </span>


              <strong>
                {statistics.pending}
              </strong>

            </div>


            <div className="lep-tutor-metric">

              <div className="lep-tutor-metric-icon">

                <SmartIcon
                  name="delete"
                  size={19}
                />

              </div>


              <span>
                REJECTED
              </span>


              <strong>
                {statistics.rejected}
              </strong>

            </div>

          </section>


          {/* =====================================================
              FILTER
          ===================================================== */}

          <div className="lep-tutor-filter">


            <div className="lep-tutor-search">

              <SmartIcon
                name="search"
                size={17}
              />


              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search tutor, subject, qualification or area..."
              />

            </div>


            <div className="lep-tutor-select">

              <span>
                STATUS
              </span>


              <select
                value={
                  statusFilter
                }
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="all">
                  All Statuses
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="draft">
                  Draft
                </option>

                <option value="rejected">
                  Rejected
                </option>

              </select>

            </div>


            <div className="lep-tutor-count">

              <span>
                SHOWING
              </span>

              <strong>
                {filteredTutors.length}
              </strong>

            </div>

          </div>


          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading && (

            <div className="lep-tutor-state">

              <div className="lep-tutor-state-icon">

                <SmartIcon
                  name="tutor"
                  size={26}
                />

              </div>


              <h2>
                Loading Tutors...
              </h2>


              <p>
                Please wait while we load
                the tutor directory.
              </p>

            </div>

          )}


          {/* =====================================================
              EMPTY
          ===================================================== */}

          {!loading &&
            tutors.length === 0 && (

              <div className="lep-tutor-state">

                <div className="lep-tutor-state-icon">

                  <SmartIcon
                    name="tutor"
                    size={26}
                  />

                </div>


                <h2>
                  No Tutors Yet
                </h2>


                <p>
                  Add your first tutor to
                  the Loralai Education Portal.
                </p>


                <Link
                  to="/admin/tutors/add"
                  className="lep-tutor-add"
                  style={{
                    marginTop: "18px",
                  }}
                >

                  <SmartIcon
                    name="plus"
                    size={14}
                  />

                  Add First Tutor

                </Link>

              </div>

            )}


          {/* =====================================================
              NO SEARCH RESULTS
          ===================================================== */}

          {!loading &&
            tutors.length > 0 &&
            filteredTutors.length === 0 && (

              <div className="lep-tutor-state">

                <div className="lep-tutor-state-icon">

                  <SmartIcon
                    name="search"
                    size={26}
                  />

                </div>


                <h2>
                  No Matching Tutors
                </h2>


                <p>
                  Try another search term or
                  change the status filter.
                </p>

              </div>

            )}


          {/* =====================================================
              TUTOR LIST
          ===================================================== */}

          {!loading &&
            filteredTutors.length > 0 && (

              <div className="lep-tutor-list">

                {filteredTutors.map(
                  (tutor) => {

                    const processing =
                      actionLoading ===
                      tutor.id;


                    const status =
                      tutor.status ||
                      "draft";


                    const availability =
                      (
                        tutor.availability ||
                        "available"
                      ).replaceAll(
                        "_",
                        " "
                      );


                    return (
                      <article
                        key={tutor.id}
                        className="lep-tutor-card"
                      >


                        {/* MAIN */}

                        <div>


                          <div className="lep-tutor-main">


                            <div className="lep-tutor-avatar">

                              {tutor.profile_photo_url ? (

                                <img
                                  src={`http://localhost:5000${tutor.profile_photo_url}`}
                                  alt={
                                    tutor.full_name
                                  }
                                />

                              ) : (

                                <SmartIcon
                                  name="tutor"
                                  size={25}
                                />

                              )}

                            </div>


                            <div>


                              <div className="lep-tutor-title-row">

                                <h2>
                                  {
                                    tutor.full_name
                                  }
                                </h2>


                                <span
                                  className={
                                    `lep-tutor-status ${status}`
                                  }
                                >

                                  <SmartIcon
                                    name={
                                      status ===
                                      "approved"
                                        ? "verified"
                                        : status ===
                                          "rejected"
                                        ? "delete"
                                        : "calendar"
                                    }
                                    size={10}
                                  />

                                  {status}

                                </span>

                              </div>


                              <p className="lep-tutor-subtitle">

                                {tutor.qualification ||
                                  "Qualification not listed"}

                              </p>


                              <p className="lep-tutor-subjects">

                                {tutor.subjects ||
                                  "Subjects not listed"}

                              </p>


                              <p className="lep-tutor-location">

                                <SmartIcon
                                  name="location"
                                  size={12}
                                />

                                {tutor.area
                                  ? `${tutor.area}, `
                                  : ""}

                                {tutor.city ||
                                  "Loralai"}

                              </p>

                            </div>

                          </div>


                          {/* META */}

                          <div className="lep-tutor-meta">


                            <div className="lep-tutor-meta-box">

                              <span>
                                VERIFICATION
                              </span>

                              <strong>
                                {
                                  tutor.verification_status ||
                                  "Unverified"
                                }
                              </strong>

                            </div>


                            <div className="lep-tutor-meta-box">

                              <span>
                                EXPERIENCE
                              </span>

                              <strong>
                                {
                                  tutor.experience_years ??
                                  0
                                }{" "}
                                years
                              </strong>

                            </div>


                            <div className="lep-tutor-meta-box">

                              <span>
                                AVAILABILITY
                              </span>

                              <strong
                                style={{
                                  textTransform:
                                    "capitalize",
                                }}
                              >
                                {
                                  availability
                                }
                              </strong>

                            </div>


                            <div className="lep-tutor-meta-box">

                              <span>
                                HOURLY FEE
                              </span>

                              <strong>
                                {
                                  tutor.hourly_fee !==
                                    null &&
                                  tutor.hourly_fee !==
                                    undefined
                                    ? `Rs. ${Number(
                                        tutor.hourly_fee
                                      ).toLocaleString()}`
                                    : "Not listed"
                                }
                              </strong>

                            </div>

                          </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="lep-tutor-actions">


                          <Link
                            to={`/admin/tutors/${tutor.id}/edit`}
                            className="lep-tutor-action edit"
                          >

                            <SmartIcon
                              name="edit"
                              size={12}
                            />

                            Edit

                          </Link>


                          {status !==
                            "approved" && (

                            <button
                              type="button"
                              className="lep-tutor-action approve"
                              onClick={() =>
                                handleAction(
                                  tutor.id,
                                  "approve"
                                )
                              }
                              disabled={
                                processing
                              }
                            >

                              <SmartIcon
                                name="verified"
                                size={12}
                              />

                              {processing
                                ? "Processing..."
                                : "Approve"}

                            </button>

                          )}


                          {status !==
                            "rejected" && (

                            <button
                              type="button"
                              className="lep-tutor-action reject"
                              onClick={() =>
                                handleAction(
                                  tutor.id,
                                  "reject"
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

                              Reject

                            </button>

                          )}


                          <button
                            type="button"
                            className="lep-tutor-action delete"
                            onClick={() =>
                              handleAction(
                                tutor.id,
                                "delete"
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
                              ? "Processing..."
                              : "Delete"}

                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            )}

        </div>

      </main>
    </>
  );
}


export default AdminTutors;