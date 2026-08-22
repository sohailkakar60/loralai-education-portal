import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


const TYPE_CONFIG = {
  school: {
    title: "Manage Schools",
    singular: "School",
    plural: "Schools",
    description:
      "Manage verified schools and their educational information.",
    adminPath: "/admin/schools",
    addPath: "/admin/schools/add",
    manageBase: "/admin/schools",
    publicBase: "/schools",
    icon: "school",
  },

  college: {
    title: "Manage Colleges",
    singular: "College",
    plural: "Colleges",
    description:
      "Manage verified colleges and higher education institutions.",
    adminPath: "/admin/colleges",
    addPath: "/admin/colleges/add",
    manageBase: "/admin/colleges",
    publicBase: "/colleges",
    icon: "college",
  },

  university: {
    title: "Manage Universities",
    singular: "University",
    plural: "Universities",
    description:
      "Manage verified universities and degree institutions.",
    adminPath: "/admin/universities",
    addPath: "/admin/universities/add",
    manageBase: "/admin/universities",
    publicBase: "/universities",
    icon: "university",
  },

  academy: {
    title: "Manage Academies",
    singular: "Academy",
    plural: "Academies",
    description:
      "Manage verified academies and learning centers.",
    adminPath: "/admin/academies",
    addPath: "/admin/academies/add",
    manageBase: "/admin/academies",
    publicBase: "/academies",
    icon: "academy",
  },
};


function AdminInstitutions({ type }) {
  const config =
    TYPE_CONFIG[type];


  // =========================================================
  // STATE
  // =========================================================

  const [institutions, setInstitutions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");


  // =========================================================
  // LOAD INSTITUTIONS
  // =========================================================

  const loadInstitutions =
    async () => {
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
            `${API_URL}/api/admin/institutions`,
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
              "Failed to load institutions."
          );
        }

        const allInstitutions =
          data.data?.institutions ||
          [];

        const filtered =
          allInstitutions.filter(
            (institution) =>
              institution.institution_type ===
              type
          );

        setInstitutions(
          filtered
        );

      } catch (err) {
        console.error(
          "Load institutions error:",
          err
        );

        setError(
          err.message ||
            "Failed to load institutions."
        );

        setInstitutions([]);

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

    loadInstitutions();
  }, [type]);


  // =========================================================
  // APPROVE
  // =========================================================

  const handleApprove =
    async (id) => {
      const confirmed =
        window.confirm(
          `Approve this ${config.singular.toLowerCase()}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(id);
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
            `${API_URL}/api/admin/institutions/${id}/approve`,
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
              "Failed to approve institution."
          );
        }

        setSuccess(
          `${config.singular} approved successfully.`
        );

        await loadInstitutions();

      } catch (err) {
        console.error(
          "Approve institution error:",
          err
        );

        setError(
          err.message ||
            "Failed to approve institution."
        );

      } finally {
        setActionLoading(null);
      }
    };


  // =========================================================
  // REJECT
  // =========================================================

  const handleReject =
    async (id) => {
      const confirmed =
        window.confirm(
          `Reject this ${config.singular.toLowerCase()}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(id);
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
            `${API_URL}/api/admin/institutions/${id}/reject`,
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
              "Failed to reject institution."
          );
        }

        setSuccess(
          `${config.singular} rejected successfully.`
        );

        await loadInstitutions();

      } catch (err) {
        console.error(
          "Reject institution error:",
          err
        );

        setError(
          err.message ||
            "Failed to reject institution."
        );

      } finally {
        setActionLoading(null);
      }
    };


  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete =
    async (
      id,
      name
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to permanently delete "${name}"?\n\nThis action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(id);
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
            `${API_URL}/api/admin/institutions/${id}`,
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
              "Failed to delete institution."
          );
        }

        setSuccess(
          `${config.singular} deleted successfully.`
        );

        await loadInstitutions();

      } catch (err) {
        console.error(
          "Delete institution error:",
          err
        );

        setError(
          err.message ||
            "Failed to delete institution."
        );

      } finally {
        setActionLoading(null);
      }
    };


  // =========================================================
  // SEARCH + STATUS FILTER
  // =========================================================

  const filteredInstitutions =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return institutions.filter(
        (institution) => {
          const matchesSearch =
            !query ||
            institution.name
              ?.toLowerCase()
              .includes(query) ||
            institution.city
              ?.toLowerCase()
              .includes(query) ||
            institution.area
              ?.toLowerCase()
              .includes(query) ||
            institution.district
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter ===
              "all" ||
            institution.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      institutions,
      search,
      statusFilter,
    ]);


  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics =
    useMemo(() => {
      return {
        total:
          institutions.length,

        approved:
          institutions.filter(
            (item) =>
              item.status ===
              "approved"
          ).length,

        pending:
          institutions.filter(
            (item) =>
              item.status ===
                "pending" ||
              item.status ===
                "draft"
          ).length,

        rejected:
          institutions.filter(
            (item) =>
              item.status ===
              "rejected"
          ).length,
      };
    }, [institutions]);


  // =========================================================
  // INVALID TYPE
  // =========================================================

  if (!config) {
    return (
      <main className="lep-admin-institutions">

        <div className="lep-ai-container">

          <div className="lep-ai-state">

            <div className="lep-ai-state-icon">

              <SmartIcon
                name="dashboard"
                size={24}
              />

            </div>

            <span className="lep-ai-eyebrow">
              ADMINISTRATION
            </span>

            <h2>
              Invalid Institution Type
            </h2>

            <p>
              The requested management
              section does not exist.
            </p>

            <Link
              to="/admin"
              className="lep-ai-primary-btn"
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
    );
  }


  return (
    <>
      <style>{`

        /* =====================================================
           ADMIN INSTITUTIONS
           PROFESSIONAL 3D MANAGEMENT UI
        ===================================================== */

        .lep-admin-institutions {
          min-height: 100vh;

          padding:
            45px 0 90px;

          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(44,95,138,.12),
              transparent 25%
            ),

            linear-gradient(
              180deg,
              #f7f9fc,
              #edf3f8
            );

          color:
            #2d3748;
        }


        .lep-ai-container {
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

        .lep-ai-header {
          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            25px;

          margin-bottom:
            25px;
        }


        .lep-ai-heading {
          display:
            flex;

          gap:
            15px;

          align-items:
            center;
        }


        .lep-ai-page-icon {
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
            0 10px 0 #142b47,
            0 18px 32px
            rgba(26,54,93,.17);

          transform:
            perspective(700px)
            rotateX(4deg)
            rotateY(-4deg);

          transition:
            transform .3s ease;
        }


        .lep-ai-page-icon:hover {
          transform:
            perspective(700px)
            rotateX(0)
            rotateY(0)
            translateY(-4px);
        }


        .lep-ai-eyebrow {
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


        .lep-ai-title {
          margin-top:
            7px;

          color:
            #1a365d;

          font-size:
            clamp(
              33px,
              5vw,
              52px
            );

          line-height:
            1;

          letter-spacing:
            -1.8px;
        }


        .lep-ai-description {
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


        .lep-ai-actions {
          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            8px;
        }


        .lep-ai-refresh,
        .lep-ai-add {
          min-height:
            43px;

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
            border-color .2s ease,
            background .2s ease;
        }


        .lep-ai-refresh {
          border:
            1px solid #dce4ec;

          background:
            #ffffff;

          color:
            #1a365d;
        }


        .lep-ai-add {
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


        .lep-ai-refresh:hover,
        .lep-ai-add:hover {
          transform:
            translateY(-2px);
        }


        .lep-ai-add:hover {
          background:
            linear-gradient(
              135deg,
              #ff6b00,
              #e65f00
            );
        }


        /* =====================================================
           MESSAGE
        ===================================================== */

        .lep-ai-message {
          display:
            flex;

          align-items:
            center;

          gap:
            8px;

          margin-bottom:
            14px;

          padding:
            11px 13px;

          border-radius:
            9px;

          font-size:
            10px;

          font-weight:
            800;
        }


        .lep-ai-message.error {
          background:
            #fff2f2;

          border:
            1px solid #f1cdcd;

          color:
            #b42318;
        }


        .lep-ai-message.success {
          background:
            #effaf2;

          border:
            1px solid #c7e6ce;

          color:
            #16803c;
        }


        /* =====================================================
           METRICS
        ===================================================== */

        .lep-ai-metrics {
          display:
            grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap:
            12px;

          margin:
            22px 0;
        }


        .lep-ai-metric {
          position:
            relative;

          overflow:
            hidden;

          min-height:
            116px;

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
            box-shadow .3s ease,
            border-color .3s ease;
        }


        .lep-ai-metric::after {
          content:
            "";

          position:
            absolute;

          width:
            110px;

          height:
            110px;

          right:
            -55px;

          top:
            -55px;

          border-radius:
            50%;

          background:
            rgba(44,95,138,.045);

          pointer-events:
            none;
        }


        .lep-ai-metric:hover {
          transform:
            translateY(-5px);

          box-shadow:
            0 21px 44px
            rgba(26,54,93,.10);

          border-color:
            rgba(44,95,138,.20);
        }


        .lep-ai-metric-icon {
          width:
            38px;

          height:
            38px;

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


        .lep-ai-metric span {
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


        .lep-ai-metric strong {
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
           FILTER BAR
        ===================================================== */

        .lep-ai-filter {
          display:
            grid;

          grid-template-columns:
            minmax(0,1fr)
            190px
            110px;

          gap:
            10px;

          padding:
            14px;

          margin-bottom:
            17px;

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


        .lep-ai-search {
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


        .lep-ai-search svg {
          color:
            #2c5f8a;

          flex-shrink:
            0;
        }


        .lep-ai-search input {
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


        .lep-ai-status-select {
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


        .lep-ai-status-select label {
          color:
            #94a3b8;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            .8px;
        }


        .lep-ai-status-select select {
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


        .lep-ai-filter-count {
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


        .lep-ai-filter-count span {
          color:
            #c7d5e1;

          font-size:
            8px;

          font-weight:
            900;
        }


        .lep-ai-filter-count strong {
          color:
            #ff964d;

          font-size:
            18px;
        }


        /* =====================================================
           LIST
        ===================================================== */

        .lep-ai-list {
          display:
            grid;

          gap:
            12px;
        }


        .lep-ai-card {
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


        .lep-ai-card::before {
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

          opacity:
            .8;
        }


        .lep-ai-card:hover {
          transform:
            translateY(-5px);

          box-shadow:
            0 23px 48px
            rgba(26,54,93,.11);

          border-color:
            rgba(44,95,138,.25);
        }


        /* LEFT */

        .lep-ai-card-main {
          min-width:
            0;

          display:
            grid;

          grid-template-columns:
            56px minmax(0,1fr);

          gap:
            13px;

          align-items:
            start;
        }


        .lep-ai-institution-icon {
          width:
            56px;

          height:
            56px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            14px;

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
            0 16px 25px
            rgba(26,54,93,.15);

          transform:
            perspective(700px)
            rotateX(4deg)
            rotateY(-3deg);

          transition:
            transform .3s ease;
        }


        .lep-ai-card:hover
        .lep-ai-institution-icon {
          transform:
            perspective(700px)
            rotateX(0)
            rotateY(0)
            translateY(-3px);
        }


        .lep-ai-title-row {
          display:
            flex;

          align-items:
            center;

          flex-wrap:
            wrap;

          gap:
            7px;
        }


        .lep-ai-title-row h2 {
          color:
            #1a365d;

          font-size:
            18px;

          line-height:
            1.25;
        }


        .lep-ai-status {
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


        .lep-ai-status.approved {
          background:
            #eaf7ee;

          color:
            #16803c;
        }


        .lep-ai-status.pending,
        .lep-ai-status.draft {
          background:
            #fff5e8;

          color:
            #b25c00;
        }


        .lep-ai-status.rejected {
          background:
            #fff0f0;

          color:
            #b42318;
        }


        .lep-ai-meta-line {
          margin-top:
            5px;

          color:
            #718096;

          font-size:
            10px;

          text-transform:
            capitalize;
        }


        .lep-ai-location {
          display:
            flex;

          align-items:
            flex-start;

          gap:
            5px;

          margin-top:
            4px;

          color:
            #718096;

          font-size:
            10px;

          line-height:
            1.45;
        }


        .lep-ai-location svg {
          color:
            #ff6b00;

          flex-shrink:
            0;
        }


        /* META */

        .lep-ai-card-meta {
          display:
            grid;

          grid-template-columns:
            repeat(4, minmax(75px,1fr));

          gap:
            8px;

          margin-top:
            14px;

          padding-top:
            12px;

          border-top:
            1px solid #edf1f5;
        }


        .lep-ai-meta-box {
          padding:
            9px;

          border-radius:
            8px;

          background:
            #f8fafc;
        }


        .lep-ai-meta-box span {
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


        .lep-ai-meta-box strong {
          display:
            block;

          margin-top:
            3px;

          color:
            #1a365d;

          font-size:
            11px;
        }


        /* ACTIONS */

        .lep-ai-actions-column {
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
            310px;
        }


        .lep-ai-action {
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
            background .2s ease,
            border-color .2s ease;
        }


        .lep-ai-action:hover {
          transform:
            translateY(-2px);
        }


        .lep-ai-action.manage {
          border:
            none;

          background:
            #1a365d;

          color:
            #ffffff;
        }


        .lep-ai-action.manage:hover {
          background:
            #2c5f8a;
        }


        .lep-ai-action.edit,
        .lep-ai-action.view {
          border:
            1px solid #dce4ec;

          background:
            #ffffff;

          color:
            #1a365d;
        }


        .lep-ai-action.edit:hover,
        .lep-ai-action.view:hover {
          border-color:
            #2c5f8a;
        }


        .lep-ai-action.approve {
          border:
            none;

          background:
            #16803c;

          color:
            #ffffff;
        }


        .lep-ai-action.reject,
        .lep-ai-action.delete {
          border:
            1px solid #f0caca;

          background:
            #fff7f7;

          color:
            #b42318;
        }


        .lep-ai-action.approve:hover {
          background:
            #11652f;
        }


        /* =====================================================
           STATE
        ===================================================== */

        .lep-ai-state {
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


        .lep-ai-state-icon {
          width:
            60px;

          height:
            60px;

          display:
            grid;

          place-items:
            center;

          margin-bottom:
            13px;

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


        .lep-ai-state h2 {
          margin-top:
            7px;

          color:
            #1a365d;

          font-size:
            21px;
        }


        .lep-ai-state p {
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


        .lep-ai-primary-btn {
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
            18px;

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


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1050px) {

          .lep-ai-metrics {
            grid-template-columns:
              repeat(2,1fr);
          }


          .lep-ai-card {
            grid-template-columns:
              1fr;
          }


          .lep-ai-actions-column {
            max-width:
              none;

            justify-content:
              flex-start;
          }

        }


        @media (max-width: 780px) {

          .lep-ai-header {
            display:
              block;
          }


          .lep-ai-actions {
            margin-top:
              17px;
          }


          .lep-ai-filter {
            grid-template-columns:
              1fr;
          }


          .lep-ai-card-meta {
            grid-template-columns:
              repeat(2,1fr);
          }

        }


        @media (max-width: 600px) {

          .lep-ai-metrics {
            grid-template-columns:
              1fr;
          }


          .lep-ai-heading {
            align-items:
              flex-start;
          }


          .lep-ai-title {
            font-size:
              37px;
          }


          .lep-ai-card-main {
            grid-template-columns:
              46px minmax(0,1fr);
          }


          .lep-ai-institution-icon {
            width:
              46px;

            height:
              46px;
          }


          .lep-ai-actions-column {
            display:
              grid;

            grid-template-columns:
              repeat(2,1fr);

            width:
              100%;
          }


          .lep-ai-action {
            width:
              100%;
          }

        }

      `}</style>


      <main className="lep-admin-institutions">

        <div className="lep-ai-container">

          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="lep-ai-header">

            <div className="lep-ai-heading">

              <div className="lep-ai-page-icon">

                <SmartIcon
                  name={config.icon}
                  size={28}
                />

              </div>

              <div>

                <span className="lep-ai-eyebrow">

                  <SmartIcon
                    name="dashboard"
                    size={12}
                  />

                  ADMINISTRATION

                </span>

                <h1 className="lep-ai-title">
                  {config.title}
                </h1>

                <p className="lep-ai-description">
                  {config.description}
                </p>

              </div>

            </div>


            <div className="lep-ai-actions">

              <button
                type="button"
                className="lep-ai-refresh"
                onClick={
                  loadInstitutions
                }
                disabled={
                  loading
                }
              >

                <SmartIcon
                  name="settings"
                  size={14}
                />

                {loading
                  ? "Refreshing..."
                  : "Refresh"}

              </button>


              <Link
                to={
                  config.addPath
                }
                className="lep-ai-add"
              >

                <SmartIcon
                  name="plus"
                  size={15}
                />

                Add {config.singular}

              </Link>

            </div>

          </header>


          {/* =====================================================
              MESSAGES
          ===================================================== */}

          {error && (

            <div className="lep-ai-message error">

              <SmartIcon
                name="warning"
                size={14}
              />

              {error}

            </div>

          )}


          {success && (

            <div className="lep-ai-message success">

              <SmartIcon
                name="verified"
                size={14}
              />

              {success}

            </div>

          )}


          {/* =====================================================
              STATISTICS
          ===================================================== */}

          <section className="lep-ai-metrics">

            <div className="lep-ai-metric">

              <div className="lep-ai-metric-icon">

                <SmartIcon
                  name={config.icon}
                  size={19}
                />

              </div>

              <span>
                TOTAL
              </span>

              <strong>
                {statistics.total}
              </strong>

            </div>


            <div className="lep-ai-metric">

              <div className="lep-ai-metric-icon">

                <SmartIcon
                  name="verified"
                  size={19}
                />

              </div>

              <span>
                PUBLISHED
              </span>

              <strong>
                {statistics.approved}
              </strong>

            </div>


            <div className="lep-ai-metric">

              <div className="lep-ai-metric-icon">

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


            <div className="lep-ai-metric">

              <div className="lep-ai-metric-icon">

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

          <div className="lep-ai-filter">

            <div className="lep-ai-search">

              <SmartIcon
                name="search"
                size={17}
              />

              <input
                type="text"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={`Search ${config.singular.toLowerCase()}, city, area...`}
              />

            </div>


            <div className="lep-ai-status-select">

              <label>
                STATUS
              </label>

              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
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


            <div className="lep-ai-filter-count">

              <span>
                SHOWING
              </span>

              <strong>
                {
                  filteredInstitutions.length
                }
              </strong>

            </div>

          </div>


          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading && (

            <div className="lep-ai-state">

              <div className="lep-ai-state-icon">

                <SmartIcon
                  name={config.icon}
                  size={25}
                />

              </div>

              <h2>
                Loading {config.plural}...
              </h2>

              <p>
                Please wait while we load
                the institution directory.
              </p>

            </div>

          )}


          {/* =====================================================
              EMPTY
          ===================================================== */}

          {!loading &&
            institutions.length === 0 && (

              <div className="lep-ai-state">

                <div className="lep-ai-state-icon">

                  <SmartIcon
                    name={config.icon}
                    size={25}
                  />

                </div>

                <span className="lep-ai-eyebrow">
                  ADMINISTRATION
                </span>

                <h2>
                  No {config.plural} Yet
                </h2>

                <p>
                  You have not added any{" "}
                  {config.plural.toLowerCase()}
                  yet. Add the first one to
                  start building the directory.
                </p>

                <Link
                  to={
                    config.addPath
                  }
                  className="lep-ai-primary-btn"
                >

                  <SmartIcon
                    name="plus"
                    size={14}
                  />

                  Add {config.singular}

                </Link>

              </div>

            )}


          {/* =====================================================
              NO FILTER RESULTS
          ===================================================== */}

          {!loading &&
            institutions.length > 0 &&
            filteredInstitutions.length === 0 && (

              <div className="lep-ai-state">

                <div className="lep-ai-state-icon">

                  <SmartIcon
                    name="search"
                    size={25}
                  />

                </div>

                <h2>
                  No Matching Institutions
                </h2>

                <p>
                  Try another search term or
                  change the status filter.
                </p>

              </div>

            )}


          {/* =====================================================
              INSTITUTION LIST
          ===================================================== */}

          {!loading &&
            filteredInstitutions.length > 0 && (

              <div className="lep-ai-list">

                {filteredInstitutions.map(
                  (institution) => {

                    const processing =
                      actionLoading ===
                      institution.id;


                    const status =
                      institution.status ||
                      "draft";


                    const ownership =
                      (
                        institution.ownership_type ||
                        "private"
                      ).replaceAll(
                        "_",
                        " "
                      );


                    const gender =
                      (
                        institution.gender_type ||
                        "not specified"
                      ).replaceAll(
                        "_",
                        " "
                      );


                    return (
                      <article
                        key={
                          institution.id
                        }
                        className="lep-ai-card"
                      >

                        {/* MAIN */}

                        <div>

                          <div className="lep-ai-card-main">

                            <div className="lep-ai-institution-icon">

                              <SmartIcon
                                name={
                                  config.icon
                                }
                                size={25}
                              />

                            </div>


                            <div>

                              <div className="lep-ai-title-row">

                                <h2>
                                  {
                                    institution.name
                                  }
                                </h2>


                                <span
                                  className={
                                    `lep-ai-status ${status}`
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


                              <p className="lep-ai-meta-line">

                                {ownership}

                                {" • "}

                                {gender}

                              </p>


                              <div className="lep-ai-location">

                                <SmartIcon
                                  name="location"
                                  size={12}
                                />

                                <span>

                                  {institution.area
                                    ? `${institution.area}, `
                                    : ""}

                                  {institution.city}

                                  {institution.district
                                    ? `, ${institution.district}`
                                    : ""}

                                </span>

                              </div>

                            </div>

                          </div>


                          {/* META */}

                          <div className="lep-ai-card-meta">

                            <div className="lep-ai-meta-box">

                              <span>
                                VERIFICATION
                              </span>

                              <strong>
                                {
                                  institution.verification_status ||
                                  "Unverified"
                                }
                              </strong>

                            </div>


                            <div className="lep-ai-meta-box">

                              <span>
                                STUDENTS
                              </span>

                              <strong>
                                {
                                  institution.student_count ??
                                  0
                                }
                              </strong>

                            </div>


                            <div className="lep-ai-meta-box">

                              <span>
                                TEACHERS
                              </span>

                              <strong>
                                {
                                  institution.teacher_count ??
                                  0
                                }
                              </strong>

                            </div>


                            <div className="lep-ai-meta-box">

                              <span>
                                ESTABLISHED
                              </span>

                              <strong>
                                {
                                  institution.established_year ||
                                  "N/A"
                                }
                              </strong>

                            </div>

                          </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="lep-ai-actions-column">

                          {/* MANAGE */}

                          <Link
                            to={`${config.manageBase}/${institution.id}/manage`}
                            className="lep-ai-action manage"
                          >

                            <SmartIcon
                              name="dashboard"
                              size={12}
                            />

                            Manage

                          </Link>


                          {/* EDIT */}

                          <Link
                            to={`${config.manageBase}/${institution.id}/edit`}
                            className="lep-ai-action edit"
                          >

                            <SmartIcon
                              name="edit"
                              size={12}
                            />

                            Edit

                          </Link>


                          {/* VIEW */}

                          <Link
                            to={`${config.publicBase}/${institution.slug}`}
                            className="lep-ai-action view"
                          >

                            <SmartIcon
                              name="external"
                              size={12}
                            />

                            View

                          </Link>


                          {/* APPROVE */}

                          {status !==
                            "approved" && (

                            <button
                              type="button"
                              className="lep-ai-action approve"
                              onClick={() =>
                                handleApprove(
                                  institution.id
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


                          {/* REJECT */}

                          {status !==
                            "rejected" && (

                            <button
                              type="button"
                              className="lep-ai-action reject"
                              onClick={() =>
                                handleReject(
                                  institution.id
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


                          {/* DELETE */}

                          <button
                            type="button"
                            className="lep-ai-action delete"
                            onClick={() =>
                              handleDelete(
                                institution.id,
                                institution.name
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


export default AdminInstitutions;