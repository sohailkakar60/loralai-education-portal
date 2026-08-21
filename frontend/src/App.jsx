import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";
import "./threeD-theme.css";
import Register from "./pages/Register";

// =========================================================
// GLOBAL NAVBAR
// =========================================================

import Navbar from "./components/Navbar";


// =========================================================
// PUBLIC PAGES
// =========================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Institutions from "./pages/Institutions";
import InstitutionDetails from "./pages/InstitutionDetails";

import Tutors from "./pages/Tutors";
import TutorDetails from "./pages/TutorDetails";

import News from "./pages/News";
import NewsDetails from "./pages/NewsDetails";

import Rankings from "./pages/Rankings";


// =========================================================
// ADMIN PAGES
// =========================================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminInstitutions from "./pages/AdminInstitutions";
import AdminNews from "./pages/AdminNews";
import AdminTutors from "./pages/AdminTutors";
import AdminReviews from "./pages/AdminReviews";


// =========================================================
// INSTITUTION PAGES
// =========================================================

import AddInstitution from "./pages/AddInstitution";
import ManageInstitution from "./pages/ManageInstitution";
import EditSchool from "./pages/EditSchool";


// =========================================================
// TUTOR PAGES
// =========================================================

import AddTutor from "./pages/AddTutor";
import EditTutor from "./pages/EditTutor";


// =========================================================
// MANAGEMENT MODULES
// =========================================================

import ManagePrograms from "./pages/ManagePrograms";
import ManageTeachers from "./pages/ManageTeachers";
import ManageFacilities from "./pages/ManageFacilities";
import ManageContacts from "./pages/ManageContacts";
import ManageFees from "./pages/ManageFees";
import ManageAdmissions from "./pages/ManageAdmissions";


// =========================================================
// ADMIN PROTECTION
// =========================================================

function AdminRoute({ children }) {
  const token =
    localStorage.getItem("authToken");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("authUser") || "null"
    );
  } catch (error) {
    console.error(
      "Failed to parse authUser:",
      error
    );
  }


  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  const isAdmin =
    user.role === "admin" ||
    user.role === "super_admin";


  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return children;
}


// =========================================================
// APP
// =========================================================

function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL NAVBAR */}

      <Navbar />


      <Routes>

        {/* =================================================
            PUBLIC
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
<Route
  path="/register"
  element={
    <Register />
  }
/>

        {/* =================================================
            PUBLIC INSTITUTIONS
        ================================================= */}

        <Route
          path="/schools"
          element={
            <Institutions type="school" />
          }
        />

        <Route
          path="/colleges"
          element={
            <Institutions type="college" />
          }
        />

        <Route
          path="/universities"
          element={
            <Institutions type="university" />
          }
        />

        <Route
          path="/academies"
          element={
            <Institutions type="academy" />
          }
        />


        {/* =================================================
            PUBLIC INSTITUTION DETAILS
        ================================================= */}

        <Route
          path="/schools/:slug"
          element={
            <InstitutionDetails type="school" />
          }
        />

        <Route
          path="/colleges/:slug"
          element={
            <InstitutionDetails type="college" />
          }
        />

        <Route
          path="/universities/:slug"
          element={
            <InstitutionDetails type="university" />
          }
        />

        <Route
          path="/academies/:slug"
          element={
            <InstitutionDetails type="academy" />
          }
        />


        {/* =================================================
            PUBLIC TUTORS
        ================================================= */}

        <Route
          path="/tutors"
          element={<Tutors />}
        />

        <Route
  path="/tutors/:id"
  element={
    <TutorDetails />
  }
/>


        {/* =================================================
            PUBLIC NEWS
        ================================================= */}

        <Route
          path="/news"
          element={<News />}
        />

        <Route
          path="/news/:slug"
          element={<NewsDetails />}
        />


        {/* =================================================
            PUBLIC RANKINGS
        ================================================= */}

        <Route
          path="/rankings"
          element={<Rankings />}
        />


        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


        {/* =================================================
            ADMIN INSTITUTIONS
        ================================================= */}

        <Route
          path="/admin/schools"
          element={
            <AdminRoute>
              <AdminInstitutions type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges"
          element={
            <AdminRoute>
              <AdminInstitutions type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities"
          element={
            <AdminRoute>
              <AdminInstitutions type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies"
          element={
            <AdminRoute>
              <AdminInstitutions type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            ADD INSTITUTIONS
        ================================================= */}

        <Route
          path="/admin/schools/add"
          element={
            <AdminRoute>
              <AddInstitution type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/add"
          element={
            <AdminRoute>
              <AddInstitution type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/add"
          element={
            <AdminRoute>
              <AddInstitution type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/add"
          element={
            <AdminRoute>
              <AddInstitution type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            MANAGE INSTITUTIONS
        ================================================= */}

        <Route
          path="/admin/schools/:id/manage"
          element={
            <AdminRoute>
              <ManageInstitution type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/:id/manage"
          element={
            <AdminRoute>
              <ManageInstitution type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/:id/manage"
          element={
            <AdminRoute>
              <ManageInstitution type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/:id/manage"
          element={
            <AdminRoute>
              <ManageInstitution type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            EDIT INSTITUTIONS
        ================================================= */}

        <Route
          path="/admin/schools/:id/edit"
          element={
            <AdminRoute>
              <EditSchool type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/:id/edit"
          element={
            <AdminRoute>
              <EditSchool type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/:id/edit"
          element={
            <AdminRoute>
              <EditSchool type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/:id/edit"
          element={
            <AdminRoute>
              <EditSchool type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            ACADEMIC PROGRAMS
        ================================================= */}

        <Route
          path="/admin/schools/:id/programs"
          element={
            <AdminRoute>
              <ManagePrograms type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/:id/programs"
          element={
            <AdminRoute>
              <ManagePrograms type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/:id/programs"
          element={
            <AdminRoute>
              <ManagePrograms type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/:id/programs"
          element={
            <AdminRoute>
              <ManagePrograms type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            TEACHERS
        ================================================= */}

        <Route
          path="/admin/schools/:id/teachers"
          element={
            <AdminRoute>
              <ManageTeachers type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/:id/teachers"
          element={
            <AdminRoute>
              <ManageTeachers type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/:id/teachers"
          element={
            <AdminRoute>
              <ManageTeachers type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/:id/teachers"
          element={
            <AdminRoute>
              <ManageTeachers type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            FACILITIES
        ================================================= */}

        <Route
          path="/admin/schools/:id/facilities"
          element={
            <AdminRoute>
              <ManageFacilities type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/:id/facilities"
          element={
            <AdminRoute>
              <ManageFacilities type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/:id/facilities"
          element={
            <AdminRoute>
              <ManageFacilities type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/:id/facilities"
          element={
            <AdminRoute>
              <ManageFacilities type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            CONTACTS
        ================================================= */}

        <Route
          path="/admin/schools/:id/contacts"
          element={
            <AdminRoute>
              <ManageContacts type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/:id/contacts"
          element={
            <AdminRoute>
              <ManageContacts type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/:id/contacts"
          element={
            <AdminRoute>
              <ManageContacts type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/:id/contacts"
          element={
            <AdminRoute>
              <ManageContacts type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            FEES
        ================================================= */}

        <Route
          path="/admin/schools/:id/fees"
          element={
            <AdminRoute>
              <ManageFees type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/:id/fees"
          element={
            <AdminRoute>
              <ManageFees type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/:id/fees"
          element={
            <AdminRoute>
              <ManageFees type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/:id/fees"
          element={
            <AdminRoute>
              <ManageFees type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            ADMISSIONS
        ================================================= */}

        <Route
          path="/admin/schools/:id/admissions"
          element={
            <AdminRoute>
              <ManageAdmissions type="school" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/colleges/:id/admissions"
          element={
            <AdminRoute>
              <ManageAdmissions type="college" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/universities/:id/admissions"
          element={
            <AdminRoute>
              <ManageAdmissions type="university" />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/academies/:id/admissions"
          element={
            <AdminRoute>
              <ManageAdmissions type="academy" />
            </AdminRoute>
          }
        />


        {/* =================================================
            ADMIN NEWS
        ================================================= */}

        <Route
          path="/admin/news"
          element={
            <AdminRoute>
              <AdminNews />
            </AdminRoute>
          }
        />


        {/* =================================================
            ADMIN TUTORS
        ================================================= */}

        <Route
          path="/admin/tutors"
          element={
            <AdminRoute>
              <AdminTutors />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/tutors/add"
          element={
            <AdminRoute>
              <AddTutor />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/tutors/:id/edit"
          element={
            <AdminRoute>
              <EditTutor />
            </AdminRoute>
          }
        />


        {/* =================================================
            ADMIN REVIEWS
        ================================================= */}

        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <AdminReviews />
            </AdminRoute>
          }
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;