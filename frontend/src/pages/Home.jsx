import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import SmartIcon from "../components/SmartIcon";


function Home() {
  const navigate = useNavigate();


  // =========================================================
  // STATE
  // =========================================================

  const [stats, setStats] = useState({
    institutions: 0,
    teachers: 0,
    programs: 0,
  });

  const [schools, setSchools] = useState([]);
  const [news, setNews] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);


  // =========================================================
  // LOAD HOMEPAGE DATA
  // =========================================================

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [
          schoolsResponse,
          statsResponse,
          newsResponse,
        ] = await Promise.all([
          fetch(
            "http://localhost:5000/api/public/institutions?type=school&limit=6"
          ),

          fetch(
            "http://localhost:5000/api/public/stats"
          ),

          fetch(
            "http://localhost:5000/api/news"
          ),
        ]);


        // =====================================================
        // SCHOOLS
        // =====================================================

        const schoolsData =
          await schoolsResponse.json();

        if (
          schoolsResponse.ok &&
          schoolsData.success
        ) {
          setSchools(
            schoolsData.data?.institutions || []
          );
        }


        // =====================================================
        // STATS
        // =====================================================

        const statsData =
          await statsResponse.json();

        if (
          statsResponse.ok &&
          statsData.success
        ) {
          setStats({
            institutions:
              statsData.data?.institutions || 0,

            teachers:
              statsData.data?.teachers || 0,

            programs:
              statsData.data?.programs || 0,
          });
        }


        // =====================================================
        // NEWS
        // =====================================================

        if (newsResponse.ok) {
          const newsData =
            await newsResponse.json();

          if (newsData.success) {
            setNews(
              newsData.data?.news || []
            );
          }
        }

      } catch (error) {
        console.error(
          "Homepage data error:",
          error
        );
      } finally {
        setLoading(false);
        setNewsLoading(false);
      }
    };


    loadHomeData();

  }, []);


  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (event) => {
    event.preventDefault();

    const value =
      search.trim();


    if (!value) {
      navigate("/schools");
      return;
    }


    navigate(
      `/schools?search=${encodeURIComponent(value)}`
    );
  };


  return (
    <main className="premium-homepage">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="premium-hero">

        <div className="premium-hero-glow premium-glow-one" />

        <div className="premium-hero-glow premium-glow-two" />


        <div className="container premium-hero-inner">


          {/* =================================================
              HERO CONTENT
          ================================================= */}

          <div className="premium-hero-content">

            <span className="premium-eyebrow">
              WELCOME TO LORALAI
            </span>


            <h1>
              Empowering Education.
              <br />

              <span>
                Building Futures.
              </span>
            </h1>


            <p>
              Your complete education directory for
              schools, colleges, universities,
              academies and tutors in Loralai.
              Find, connect and grow with quality
              education.
            </p>


            <div className="premium-hero-actions">

              <Link
                to="/schools"
                className="premium-btn premium-btn-orange"
              >
                Explore Institutions

                <span>
                  →
                </span>
              </Link>


              <Link
                to="/tutors"
                className="premium-btn premium-btn-light"
              >
                Browse Tutors

                <span>
                  ↗
                </span>
              </Link>

            </div>


            <div className="premium-hero-trust">

              <div>

                <strong>
                  <SmartIcon
                    name="verified"
                    size={15}
                  />
                </strong>

                <span>
                  Verified institutions
                </span>

              </div>


              <div>

                <strong>
                  <SmartIcon
                    name="verified"
                    size={15}
                  />
                </strong>

                <span>
                  Trusted information
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              3D HERO VISUAL
          ================================================= */}

          <div className="premium-hero-visual">

            <div className="premium-hero-scene">


              {/* BUILDING */}

              <div className="premium-building">

                <div className="building-roof" />


                <div className="building-columns">

                  <span />
                  <span />
                  <span />
                  <span />
                  <span />

                </div>


                <div className="building-steps">

                  <span />
                  <span />
                  <span />

                </div>

              </div>


              {/* FLOATING EDUCATION CARD */}

              <div className="premium-stat-card">


                <div className="premium-stat-card-header">

                  <span>
                    EDUCATION IN LORALAI
                  </span>

                </div>


                {/* INSTITUTIONS */}

                <div className="premium-floating-stat">

                  <div className="premium-floating-icon">

                    <SmartIcon
                      name="school"
                      size={21}
                    />

                  </div>


                  <div>

                    <strong>
                      {loading
                        ? "..."
                        : stats.institutions}
                    </strong>

                    <span>
                      Institutions
                    </span>

                  </div>

                </div>


                {/* UNIVERSITIES */}

                <div className="premium-floating-stat">

                  <div className="premium-floating-icon">

                    <SmartIcon
                      name="university"
                      size={21}
                    />

                  </div>


                  <div>

                    <strong>
                      Explore
                    </strong>

                    <span>
                      Colleges & Universities
                    </span>

                  </div>

                </div>


                {/* TEACHERS */}

                <div className="premium-floating-stat">

                  <div className="premium-floating-icon">

                    <SmartIcon
                      name="teacher"
                      size={21}
                    />

                  </div>


                  <div>

                    <strong>
                      {loading
                        ? "..."
                        : stats.teachers}
                    </strong>

                    <span>
                      Teachers
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="premium-search-wrap">

        <div className="container">

          <form
            className="premium-search-card"
            onSubmit={handleSearch}
          >


            <div className="premium-search-title">

              <span>
                FIND THE RIGHT
              </span>

              <strong>
                Institution{" "}
                <em>
                  for You
                </em>
              </strong>

            </div>


            <div className="premium-search-fields">


              {/* CATEGORY */}

              <button
                type="button"
                className="premium-search-field"
                onClick={() =>
                  navigate("/schools")
                }
              >

                <span className="premium-search-icon">

                  <SmartIcon
                    name="school"
                    size={19}
                  />

                </span>


                <div>

                  <small>
                    CATEGORY
                  </small>

                  <strong>
                    Select Category
                  </strong>

                </div>

              </button>


              {/* LOCATION */}

              <button
                type="button"
                className="premium-search-field"
                onClick={() =>
                  navigate("/schools")
                }
              >

                <span className="premium-search-icon">

                  <SmartIcon
                    name="location"
                    size={19}
                  />

                </span>


                <div>

                  <small>
                    LOCATION
                  </small>

                  <strong>
                    Loralai
                  </strong>

                </div>

              </button>


              {/* SEARCH INPUT */}

              <div className="premium-search-input-wrap">

                <span>

                  <SmartIcon
                    name="search"
                    size={19}
                  />

                </span>


                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search institution or course"
                />

              </div>


              <button
                type="submit"
                className="premium-search-button"
              >
                Search

                <span>

                  <SmartIcon
                    name="search"
                    size={17}
                  />

                </span>

              </button>

            </div>


            <div className="premium-popular">

              <span>
                Popular:
              </span>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/schools?search=government"
                  )
                }
              >
                Government Schools
              </button>


              <button
                type="button"
                onClick={() =>
                  navigate("/colleges")
                }
              >
                Degree Colleges
              </button>


              <button
                type="button"
                onClick={() =>
                  navigate("/universities")
                }
              >
                Universities
              </button>


              <button
                type="button"
                onClick={() =>
                  navigate("/tutors")
                }
              >
                Tutors
              </button>

            </div>

          </form>

        </div>

      </section>


      {/* =====================================================
          EDUCATION CATEGORIES
      ===================================================== */}

      <section className="premium-section">

        <div className="container">


          <div className="premium-section-heading">

            <div>

              <span>
                EXPLORE EDUCATION
              </span>


              <h2>
                Find What You Need
              </h2>

            </div>


            <Link to="/news">
              View Latest Updates →
            </Link>

          </div>


          <div className="premium-category-grid">


            {/* SCHOOL */}

            <Link
              to="/schools"
              className="premium-category-card"
            >

              <div className="premium-category-icon navy">

                <SmartIcon
                  name="school"
                  size={23}
                />

              </div>


              <h3>
                Schools
              </h3>


              <p>
                Primary to matric education.
              </p>


              <strong>
                Explore →
              </strong>

            </Link>


            {/* COLLEGE */}

            <Link
              to="/colleges"
              className="premium-category-card"
            >

              <div className="premium-category-icon blue">

                <SmartIcon
                  name="college"
                  size={23}
                />

              </div>


              <h3>
                Colleges
              </h3>


              <p>
                Intermediate and degree programs.
              </p>


              <strong>
                Explore →
              </strong>

            </Link>


            {/* UNIVERSITY */}

            <Link
              to="/universities"
              className="premium-category-card"
            >

              <div className="premium-category-icon cyan">

                <SmartIcon
                  name="university"
                  size={23}
                />

              </div>


              <h3>
                Universities
              </h3>


              <p>
                Higher education and degrees.
              </p>


              <strong>
                Explore →
              </strong>

            </Link>


            {/* ACADEMY */}

            <Link
              to="/academies"
              className="premium-category-card"
            >

              <div className="premium-category-icon purple">

                <SmartIcon
                  name="academy"
                  size={23}
                />

              </div>


              <h3>
                Academies
              </h3>


              <p>
                Professional learning centers.
              </p>


              <strong>
                Explore →
              </strong>

            </Link>


            {/* TUTORS */}

            <Link
              to="/tutors"
              className="premium-category-card"
            >

              <div className="premium-category-icon green">

                <SmartIcon
                  name="tutor"
                  size={23}
                />

              </div>


              <h3>
                Tutors
              </h3>


              <p>
                Find verified subject experts.
              </p>


              <strong>
                Find Tutors →
              </strong>

            </Link>


            {/* NEWS */}

            <Link
              to="/news"
              className="premium-category-card"
            >

              <div className="premium-category-icon orange">

                <SmartIcon
                  name="news"
                  size={23}
                />

              </div>


              <h3>
                News & Updates
              </h3>


              <p>
                Latest educational announcements.
              </p>


              <strong>
                View News →
              </strong>

            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED SCHOOLS + NEWS
      ===================================================== */}

      <section className="premium-section premium-featured-section">

        <div className="container">


          <div className="premium-two-column-heading">

            <div>

              <span>
                VERIFIED INSTITUTIONS
              </span>


              <h2>
                Featured Schools
              </h2>

            </div>


            <Link to="/schools">
              View All Schools →
            </Link>

          </div>


          <div className="premium-featured-layout">


            {/* =================================================
                SCHOOLS
            ================================================= */}

            <div className="premium-school-grid">

              {schools.length === 0 ? (

                <div className="premium-empty-card">

                  <div>

                    <SmartIcon
                      name="school"
                      size={34}
                    />

                  </div>


                  <h3>
                    More schools coming soon
                  </h3>


                  <p>
                    Verified schools will appear
                    here as the portal grows.
                  </p>

                </div>

              ) : (

                schools
                  .slice(0, 3)
                  .map((school) => (

                    <Link
                      key={school.id}
                      to={`/schools/${school.slug}`}
                      className="premium-school-card"
                    >


                      <div className="premium-school-image">

                        {school.cover_image_url ? (

                          <img
                            src={
                              `http://localhost:5000${school.cover_image_url}`
                            }
                            alt={
                              school.name
                            }
                          />

                        ) : (

                          <div>

                            <SmartIcon
                              name="school"
                              size={44}
                            />

                          </div>

                        )}

                      </div>


                      <div className="premium-school-info">

                        <span>

                          {school.institution_type ||
                            "School"}

                        </span>


                        <h3>
                          {school.name}
                        </h3>


                        <p>

                          <SmartIcon
                            name="location"
                            size={12}
                          />

                          {" "}

                          {school.area
                            ? `${school.area}, `
                            : ""}

                          {school.city}

                        </p>

                      </div>

                    </Link>

                  ))

              )}

            </div>


            {/* =================================================
                NEWS
            ================================================= */}

            <div className="premium-news-panel">


              <div className="premium-news-panel-heading">

                <div>

                  <span>
                    STAY INFORMED
                  </span>


                  <h2>
                    Latest News
                  </h2>

                </div>


                <Link to="/news">
                  View All →
                </Link>

              </div>


              {newsLoading ? (

                <div className="premium-news-empty">

                  Loading news...

                </div>

              ) : news.length === 0 ? (

                <div className="premium-news-empty">

                  <SmartIcon
                    name="news"
                    size={34}
                  />

                  <div>
                    No published news yet.
                  </div>

                </div>

              ) : (

                news
                  .slice(0, 3)
                  .map((article) => (

                    <Link
                      key={article.id}
                      to={`/news/${article.slug}`}
                      className="premium-news-row"
                    >


                      <div className="premium-news-thumb">

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
                            size={25}
                          />

                        )}

                      </div>


                      <div className="premium-news-content">

                        <strong>
                          {article.title}
                        </strong>


                        <p>
                          {article.summary ||
                            "Latest educational information."}
                        </p>


                        <small>

                          {article.published_at
                            ? new Date(
                                article.published_at
                              ).toLocaleDateString()
                            : ""}

                        </small>

                      </div>


                      <span className="premium-news-arrow">
                        →
                      </span>

                    </Link>

                  ))

              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          METRICS
      ===================================================== */}

      <section className="premium-metrics">

        <div className="container">

          <div className="premium-metrics-grid">


            <div className="premium-metric">

              <span>
                INSTITUTIONS
              </span>


              <strong>
                {loading
                  ? "..."
                  : stats.institutions}
              </strong>


              <small>
                Registered institutions
              </small>

            </div>


            <div className="premium-metric">

              <span>
                TEACHERS
              </span>


              <strong>
                {loading
                  ? "..."
                  : stats.teachers}
              </strong>


              <small>
                Education professionals
              </small>

            </div>


            <div className="premium-metric">

              <span>
                PROGRAMS
              </span>


              <strong>
                {loading
                  ? "..."
                  : stats.programs}
              </strong>


              <small>
                Academic programs
              </small>

            </div>


            <div className="premium-metric">

              <span>
                VERIFIED
              </span>


              <strong>

                <SmartIcon
                  name="verified"
                  size={28}
                />

              </strong>


              <small>
                Trusted portal data
              </small>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section className="premium-section">

        <div className="container">

          <div className="premium-about">


            <div className="premium-about-visual">

              <div className="premium-about-card">

                <div className="premium-about-building">

                  <SmartIcon
                    name="university"
                    size={72}
                  />

                </div>


                <div className="premium-about-badge">

                  <SmartIcon
                    name="verified"
                    size={14}
                  />

                  {" "}
                  Verified Education

                </div>

              </div>

            </div>


            <div className="premium-about-content">

              <span>
                ABOUT LORALAI EDUCATION PORTAL
              </span>


              <h2>
                Committed to
                <br />
                Quality Education
              </h2>


              <p>
                Loralai Education Portal is your
                one-stop platform to discover
                educational institutions, find expert
                tutors, and stay updated with the
                latest education news and opportunities
                in Loralai.
              </p>


              <p>
                We aim to connect students, teachers,
                parents and institutions through one
                trusted digital platform.
              </p>


              <div className="premium-about-points">

                <span>

                  <SmartIcon
                    name="verified"
                    size={13}
                  />

                  {" "}
                  Verified Institutions

                </span>


                <span>

                  <SmartIcon
                    name="teacher"
                    size={13}
                  />

                  {" "}
                  Expert Educators

                </span>


                <span>

                  <SmartIcon
                    name="programs"
                    size={13}
                  />

                  {" "}
                  Quality Learning

                </span>


                <span>

                  <SmartIcon
                    name="students"
                    size={13}
                  />

                  {" "}
                  Bright Futures

                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="premium-final-cta">

        <div className="container">


          <div>

            <span>
              LORALAI EDUCATION PORTAL
            </span>


            <h2>
              Start Your Education Journey Today!
            </h2>


            <p>
              Find the right institution or connect
              with a trusted tutor.
            </p>

          </div>


          <div className="premium-final-actions">

            <Link
              to="/schools"
              className="premium-btn premium-btn-light"
            >

              <SmartIcon
                name="school"
                size={16}
              />

              Browse Institutions

            </Link>


            <Link
              to="/tutors"
              className="premium-btn premium-btn-orange"
            >

              <SmartIcon
                name="tutor"
                size={16}
              />

              Find a Tutor

              <span>
                →
              </span>

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


export default Home;