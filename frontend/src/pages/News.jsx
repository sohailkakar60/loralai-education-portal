
import { Link } from "react-router-dom";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


const CATEGORIES = [
  {
    value: "all",
    label: "All News",
    icon: "news",
  },
  {
    value: "education",
    label: "Education",
    icon: "education",
  },
  {
    value: "scholarships",
    label: "Scholarships",
    icon: "verified",
  },
  {
    value: "admissions",
    label: "Admissions",
    icon: "admissions",
  },
  {
    value: "exams",
    label: "Exams",
    icon: "document",
  },
  {
    value: "events",
    label: "Events",
    icon: "calendar",
  },
  {
    value: "jobs",
    label: "Jobs",
    icon: "briefcase",
  },
  {
    value: "announcements",
    label: "Announcements",
    icon: "announcement",
  },
  {
    value: "general",
    label: "General",
    icon: "news",
  },
];


function News() {
  const [news, setNews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [category, setCategory] =
    useState("all");


  // =========================================================
  // LOAD NEWS
  // =========================================================

  useEffect(() => {

    const loadNews =
      async () => {

        try {

          setLoading(true);
          setError("");


          const response =
            await fetch(
              `${API_URL}/api/news`
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
            data.data?.news ||
              []
          );

        } catch (err) {

          console.error(
            "Load news error:",
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


    loadNews();

  }, []);


  // =========================================================
  // FILTER
  // =========================================================

  const filteredNews =
    useMemo(() => {

      if (
        category === "all"
      ) {
        return news;
      }


      return news.filter(
        (article) =>
          article.category ===
          category
      );

    }, [
      news,
      category,
    ]);


  // =========================================================
  // HELPERS
  // =========================================================

  const formatCategory =
    (value) => {

      if (!value) {
        return "General";
      }


      return value
        .replaceAll(
          "_",
          " "
        )
        .replace(
          /^\w/,
          (letter) =>
            letter.toUpperCase()
        );

    };


  const formatDate =
    (value) => {

      if (!value) {
        return "";
      }


      try {

        return new Date(
          value
        ).toLocaleDateString(
          "en-PK",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        );

      } catch {

        return "";

      }

    };


  // =========================================================
  // CATEGORY ICON
  // =========================================================

  const getCategoryIcon =
    (value) => {

      const item =
        CATEGORIES.find(
          (categoryItem) =>
            categoryItem.value ===
            value
        );


      return (
        item?.icon ||
        "news"
      );

    };


  return (
    <>
      <style>{styles}</style>


      <main className="lep-news-page">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="lep-news-hero">

          <div className="lep-news-container">

            <div className="lep-news-hero-grid">


              <div>

                <span className="lep-news-eyebrow">

                  <SmartIcon
                    name="news"
                    size={13}
                  />

                  LORALAI EDUCATION PORTAL

                </span>


                <h1>
                  Educational News
                  <span>
                    & Announcements
                  </span>
                </h1>


                <p>
                  Stay updated with important
                  educational information,
                  scholarships, admissions,
                  examinations, events,
                  opportunities and announcements
                  from across Loralai.
                </p>


                <div className="lep-news-hero-stats">

                  <div>

                    <strong>
                      {news.length}
                    </strong>

                    <span>
                      Published Stories
                    </span>

                  </div>


                  <div>

                    <strong>
                      {
                        news.filter(
                          (article) =>
                            article.category ===
                            "scholarships"
                        ).length
                      }
                    </strong>

                    <span>
                      Scholarships
                    </span>

                  </div>


                  <div>

                    <strong>
                      {
                        news.filter(
                          (article) =>
                            article.category ===
                            "admissions"
                        ).length
                      }
                    </strong>

                    <span>
                      Admissions
                    </span>

                  </div>

                </div>

              </div>


              <div className="lep-news-feature-card">

                <div className="lep-news-feature-icon">

                  <SmartIcon
                    name="announcement"
                    size={28}
                  />

                </div>


                <span>
                  STAY INFORMED
                </span>


                <h2>
                  Important educational
                  updates in one place.
                </h2>


                <p>
                  Explore scholarships,
                  admissions, exams, events,
                  jobs and other opportunities.
                </p>

              </div>


            </div>

          </div>

        </section>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="lep-news-content">

          <div className="lep-news-container">


            {/* =================================================
                FILTER HEADER
            ================================================= */}

            <div className="lep-news-section-header">

              <div>

                <span>
                  BROWSE NEWS
                </span>


                <h2>
                  Latest Updates
                </h2>


                <p>
                  Select a category to quickly
                  find the information you need.
                </p>

              </div>


              <div className="lep-news-result-badge">

                <SmartIcon
                  name="news"
                  size={13}
                />

                {filteredNews.length}{" "}
                {filteredNews.length === 1
                  ? "Story"
                  : "Stories"}

              </div>

            </div>


            {/* =================================================
                FILTER BUTTONS
            ================================================= */}

            <div className="lep-news-filter-bar">

              {CATEGORIES.map(
                (item) => (

                  <button
                    key={
                      item.value
                    }
                    type="button"
                    className={
                      category ===
                      item.value
                        ? "lep-news-filter active"
                        : "lep-news-filter"
                    }
                    onClick={() =>
                      setCategory(
                        item.value
                      )
                    }
                  >

                    <SmartIcon
                      name={
                        item.icon
                      }
                      size={12}
                    />

                    {item.label}

                  </button>

                )
              )}

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="lep-news-alert">

                <SmartIcon
                  name="warning"
                  size={15}
                />

                {error}

              </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

              <div className="lep-news-state">

                <div className="lep-news-state-icon">

                  <SmartIcon
                    name="news"
                    size={29}
                  />

                </div>


                <h3>
                  Loading News...
                </h3>


                <p>
                  Please wait while we load
                  the latest educational updates.
                </p>

              </div>

            ) : filteredNews.length === 0 ? (

              /* =================================================
                 EMPTY
              ================================================= */

              <div className="lep-news-state">

                <div className="lep-news-state-icon">

                  <SmartIcon
                    name="search"
                    size={29}
                  />

                </div>


                <h3>
                  No News Available
                </h3>


                <p>
                  There are no published news
                  articles in this category yet.
                </p>


                {category !== "all" && (

                  <button
                    type="button"
                    className="lep-news-state-btn"
                    onClick={() =>
                      setCategory(
                        "all"
                      )
                    }
                  >

                    View All News

                  </button>

                )}

              </div>

            ) : (

              /* =================================================
                 NEWS GRID
              ================================================= */

              <div className="lep-news-grid">

                {filteredNews.map(
                  (
                    article,
                    index
                  ) => (

                    <article
                      key={
                        article.id
                      }
                      className={
                        index === 0
                          ? "lep-news-card featured"
                          : "lep-news-card"
                      }
                    >


                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div className="lep-news-card-image">

                        {article.cover_image_url ? (

                          <img
                            src={
                              article.cover_image_url.startsWith(
                                "http"
                              )
                                ? article.cover_image_url
                                : `${API_URL}${article.cover_image_url}`
                            }
                            alt={
                              article.title
                            }
                          />

                        ) : (

                          <div className="lep-news-card-placeholder">

                            <SmartIcon
                              name={
                                getCategoryIcon(
                                  article.category
                                )
                              }
                              size={34}
                            />

                            <span>
                              {formatCategory(
                                article.category
                              )}
                            </span>

                          </div>

                        )}


                        <div className="lep-news-card-image-overlay">

                          <span>

                            <SmartIcon
                              name={
                                getCategoryIcon(
                                  article.category
                                )
                              }
                              size={10}
                            />

                            {
                              formatCategory(
                                article.category
                              )
                            }

                          </span>

                        </div>

                      </div>


                      {/* =================================================
                          BODY
                      ================================================= */}

                      <div className="lep-news-card-body">


                        <div className="lep-news-card-meta">

                          <span className="lep-news-category">

                            <SmartIcon
                              name={
                                getCategoryIcon(
                                  article.category
                                )
                              }
                              size={10}
                            />

                            {
                              formatCategory(
                                article.category
                              )
                            }

                          </span>


                          <span className="lep-news-date">

                            <SmartIcon
                              name="calendar"
                              size={10}
                            />

                            {
                              formatDate(
                                article.published_at
                              )
                            }

                          </span>

                        </div>


                        <h3>
                          {
                            article.title
                          }
                        </h3>


                        <p>
                          {
                            article.summary ||
                            "Read the latest educational update from Loralai Education Portal."
                          }
                        </p>


                        <div className="lep-news-card-footer">

                          <span>

                            <SmartIcon
                              name="user"
                              size={10}
                            />

                            By{" "}

                            {
                              article.author_name ||
                              "Education Portal"
                            }

                          </span>


                          <Link
                            to={
                              `/news/${article.slug}`
                            }
                            className="lep-news-read"
                          >

                            Read Article

                            <SmartIcon
                              name="arrow-right"
                              size={12}
                            />

                          </Link>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </div>

        </section>


      </main>
    </>
  );
}


// =========================================================
// STYLES
// =========================================================

const styles = `

  .lep-news-page {
    min-height: 100vh;

    background:
      linear-gradient(
        180deg,
        #f5f8fb,
        #edf3f8
      );
  }


  .lep-news-container {
    width:
      min(
        1160px,
        calc(100% - 32px)
      );

    margin:
      0 auto;
  }


  /* =======================================================
     HERO
  ======================================================= */

  .lep-news-hero {
    position:
      relative;

    overflow:
      hidden;

    padding:
      68px 0 72px;

    background:
      radial-gradient(
        circle at 90% 10%,
        rgba(255,107,0,.15),
        transparent 25%
      ),
      linear-gradient(
        135deg,
        #142f4f,
        #275a86
      );

    color:
      #ffffff;
  }


  .lep-news-hero::before {
    content:
      "";

    position:
      absolute;

    width:
      450px;

    height:
      450px;

    right:
      -160px;

    bottom:
      -280px;

    border-radius:
      50%;

    background:
      rgba(255,255,255,.05);
  }


  .lep-news-hero::after {
    content:
      "";

    position:
      absolute;

    width:
      270px;

    height:
      270px;

    left:
      -140px;

    top:
      -150px;

    border-radius:
      50%;

    border:
      1px solid
      rgba(255,255,255,.10);
  }


  .lep-news-hero-grid {
    position:
      relative;

    z-index:
      1;

    display:
      grid;

    grid-template-columns:
      minmax(0,1.4fr)
      minmax(280px,.6fr);

    gap:
      45px;

    align-items:
      center;
  }


  .lep-news-eyebrow {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      6px;

    color:
      #ffb06e;

    font-size:
      9px;

    font-weight:
      900;

    letter-spacing:
      1.5px;
  }


  .lep-news-hero h1 {
    max-width:
      700px;

    margin-top:
      12px;

    font-size:
      clamp(
        42px,
        6vw,
        65px
      );

    line-height:
      .97;

    letter-spacing:
      -2.7px;
  }


  .lep-news-hero h1 span {
    display:
      block;

    color:
      #ff9348;
  }


  .lep-news-hero p {
    max-width:
      670px;

    margin-top:
      17px;

    color:
      #d5e3ee;

    font-size:
      13px;

    line-height:
      1.8;
  }


  .lep-news-hero-stats {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      10px;

    margin-top:
      25px;
  }


  .lep-news-hero-stats div {
    min-width:
      116px;

    padding:
      12px 14px;

    border:
      1px solid
      rgba(255,255,255,.12);

    border-radius:
      10px;

    background:
      rgba(255,255,255,.07);

    backdrop-filter:
      blur(7px);
  }


  .lep-news-hero-stats strong {
    display:
      block;

    color:
      #ffffff;

    font-size:
      22px;
  }


  .lep-news-hero-stats span {
    display:
      block;

    margin-top:
      3px;

    color:
      #b8cad9;

    font-size:
      8px;

    font-weight:
      800;

    text-transform:
      uppercase;

    letter-spacing:
      .6px;
  }


  .lep-news-feature-card {
    padding:
      27px;

    border:
      1px solid
      rgba(255,255,255,.14);

    border-radius:
      18px;

    background:
      rgba(255,255,255,.08);

    box-shadow:
      0 25px 50px
      rgba(0,0,0,.12);

    backdrop-filter:
      blur(13px);

    transform:
      perspective(900px)
      rotateY(-5deg)
      rotateX(2deg);

    transition:
      transform .3s ease;
  }


  .lep-news-feature-card:hover {
    transform:
      perspective(900px)
      rotateY(0)
      rotateX(0)
      translateY(-5px);
  }


  .lep-news-feature-icon {
    width:
      57px;

    height:
      57px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      14px;

    background:
      linear-gradient(
        145deg,
        #ff6b00,
        #f08537
      );

    color:
      #ffffff;

    box-shadow:
      0 8px 0
      #b84b00;
  }


  .lep-news-feature-card > span {
    display:
      block;

    margin-top:
      21px;

    color:
      #ffb06e;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.2px;
  }


  .lep-news-feature-card h2 {
    margin-top:
      7px;

    font-size:
      25px;

    line-height:
      1.22;
  }


  .lep-news-feature-card p {
    margin-top:
      9px;

    color:
      #c7d6e3;

    font-size:
      10px;

    line-height:
      1.7;
  }


  /* =======================================================
     CONTENT
  ======================================================= */

  .lep-news-content {
    padding:
      29px 0 80px;
  }


  .lep-news-section-header {
    display:
      flex;

    align-items:
      flex-end;

    justify-content:
      space-between;

    gap:
      15px;

    margin-bottom:
      15px;
  }


  .lep-news-section-header > div:first-child span {
    color:
      #ff6b00;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.3px;
  }


  .lep-news-section-header h2 {
    margin-top:
      5px;

    color:
      #1a365d;

    font-size:
      26px;
  }


  .lep-news-section-header p {
    margin-top:
      4px;

    color:
      #718096;

    font-size:
      10px;
  }


  .lep-news-result-badge {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      6px;

    padding:
      8px 10px;

    border-radius:
      8px;

    background:
      #eef4f8;

    color:
      #2c5f8a;

    font-size:
      8px;

    font-weight:
      900;
  }


  /* =======================================================
     FILTERS
  ======================================================= */

  .lep-news-filter-bar {
    display:
      flex;

    flex-wrap:
      wrap;

    gap:
      7px;

    margin-bottom:
      18px;
  }


  .lep-news-filter {
    min-height:
      36px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    gap:
      6px;

    padding:
      0 10px;

    border:
      1px solid
      #dbe4ec;

    border-radius:
      8px;

    background:
      #ffffff;

    color:
      #475569;

    font-family:
      inherit;

    font-size:
      8px;

    font-weight:
      800;

    cursor:
      pointer;

    transition:
      transform .2s ease,
      background .2s ease,
      border-color .2s ease;
  }


  .lep-news-filter:hover {
    transform:
      translateY(-2px);

    border-color:
      #2c5f8a;
  }


  .lep-news-filter.active {
    border-color:
      #1a365d;

    background:
      #1a365d;

    color:
      #ffffff;

    box-shadow:
      0 5px 0
      #142b47;
  }


  /* =======================================================
     ALERT
  ======================================================= */

  .lep-news-alert {
    display:
      flex;

    align-items:
      center;

    gap:
      8px;

    margin-bottom:
      15px;

    padding:
      12px 14px;

    border:
      1px solid
      #f0cccc;

    border-radius:
      9px;

    background:
      #fff5f5;

    color:
      #b42318;

    font-size:
      10px;

    font-weight:
      800;
  }


  /* =======================================================
     GRID
  ======================================================= */

  .lep-news-grid {
    display:
      grid;

    grid-template-columns:
      repeat(
        3,
        minmax(0,1fr)
      );

    gap:
      15px;
  }


  .lep-news-card {
    position:
      relative;

    display:
      flex;

    flex-direction:
      column;

    min-height:
      420px;

    overflow:
      hidden;

    border:
      1px solid
      #e0e8ef;

    border-radius:
      16px;

    background:
      #ffffff;

    box-shadow:
      0 11px 28px
      rgba(26,54,93,.055);

    transition:
      transform .3s ease,
      box-shadow .3s ease,
      border-color .3s ease;
  }


  .lep-news-card:hover {
    transform:
      perspective(900px)
      rotateX(2deg)
      rotateY(-2deg)
      translateY(-7px);

    box-shadow:
      0 27px 50px
      rgba(26,54,93,.13);

    border-color:
      rgba(44,95,138,.22);
  }


  .lep-news-card.featured {
    grid-column:
      span 2;

    min-height:
      455px;
  }


  .lep-news-card-image {
    position:
      relative;

    height:
      195px;

    overflow:
      hidden;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );
  }


  .lep-news-card.featured
    .lep-news-card-image {
    height:
      225px;
  }


  .lep-news-card-image img {
    width:
      100%;

    height:
      100%;

    object-fit:
      cover;

    transition:
      transform .45s ease;
  }


  .lep-news-card:hover
    .lep-news-card-image img {
    transform:
      scale(1.05);
  }


  .lep-news-card-placeholder {
    width:
      100%;

    height:
      100%;

    display:
      flex;

    flex-direction:
      column;

    align-items:
      center;

    justify-content:
      center;

    gap:
      8px;

    color:
      #ff9348;
  }


  .lep-news-card-placeholder span {
    color:
      rgba(255,255,255,.78);

    font-size:
      10px;

    font-weight:
      900;

    letter-spacing:
      1px;

    text-transform:
      uppercase;
  }


  .lep-news-card-image-overlay {
    position:
      absolute;

    left:
      12px;

    bottom:
      11px;
  }


  .lep-news-card-image-overlay span {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    padding:
      6px 8px;

    border:
      1px solid
      rgba(255,255,255,.18);

    border-radius:
      6px;

    background:
      rgba(16,40,65,.72);

    color:
      #ffffff;

    font-size:
      7px;

    font-weight:
      900;

    text-transform:
      uppercase;

    backdrop-filter:
      blur(6px);
  }


  .lep-news-card-body {
    display:
      flex;

    flex:
      1;

    flex-direction:
      column;

    padding:
      17px;
  }


  .lep-news-card-meta {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      8px;
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
      #eef4f8;

    color:
      #2c5f8a;

    font-size:
      7px;

    font-weight:
      900;

    text-transform:
      uppercase;
  }


  .lep-news-date {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      4px;

    color:
      #94a3b8;

    font-size:
      7px;
  }


  .lep-news-card-body h3 {
    margin-top:
      12px;

    color:
      #1a365d;

    font-size:
      17px;

    line-height:
      1.3;
  }


  .lep-news-card.featured
    .lep-news-card-body h3 {
    font-size:
      21px;
  }


  .lep-news-card-body > p {
    margin-top:
      7px;

    color:
      #718096;

    font-size:
      9px;

    line-height:
      1.7;

    display:
      -webkit-box;

    -webkit-line-clamp:
      4;

    -webkit-box-orient:
      vertical;

    overflow:
      hidden;
  }


  .lep-news-card-footer {
    display:
      flex;

    align-items:
      center;

    justify-content:
      space-between;

    gap:
      10px;

    margin-top:
      auto;

    padding-top:
      14px;
  }


  .lep-news-card-footer > span {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      4px;

    min-width:
      0;

    color:
      #94a3b8;

    font-size:
      7px;

    overflow:
      hidden;

    white-space:
      nowrap;

    text-overflow:
      ellipsis;
  }


  .lep-news-read {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    flex-shrink:
      0;

    color:
      #1a365d;

    text-decoration:
      none;

    font-size:
      8px;

    font-weight:
      900;
  }


  .lep-news-read:hover {
    color:
      #ff6b00;
  }


  /* =======================================================
     STATES
  ======================================================= */

  .lep-news-state {
    min-height:
      320px;

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
      1px solid
      #e0e8ef;

    border-radius:
      15px;

    background:
      #ffffff;

    box-shadow:
      0 12px 28px
      rgba(26,54,93,.045);
  }


  .lep-news-state-icon {
    width:
      63px;

    height:
      63px;

    display:
      grid;

    place-items:
      center;

    margin-bottom:
      13px;

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
      0 9px 0
      #142b47;
  }


  .lep-news-state h3 {
    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-news-state p {
    max-width:
      480px;

    margin-top:
      7px;

    color:
      #718096;

    font-size:
      10px;

    line-height:
      1.7;
  }


  .lep-news-state-btn {
    min-height:
      40px;

    display:
      inline-flex;

    align-items:
      center;

    justify-content:
      center;

    margin-top:
      16px;

    padding:
      0 13px;

    border:
      none;

    border-radius:
      9px;

    background:
      #1a365d;

    color:
      #ffffff;

    font-family:
      inherit;

    font-size:
      9px;

    font-weight:
      900;

    cursor:
      pointer;
  }


  /* =======================================================
     RESPONSIVE
  ======================================================= */

  @media (max-width: 1000px) {

    .lep-news-hero-grid {
      grid-template-columns:
        1fr;
    }


    .lep-news-feature-card {
      max-width:
        460px;

      transform:
        none;
    }


    .lep-news-grid {
      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }


    .lep-news-card.featured {
      grid-column:
        span 2;
    }

  }


  @media (max-width: 650px) {

    .lep-news-container {
      width:
        calc(100% - 24px);
    }


    .lep-news-hero {
      padding:
        48px 0 52px;
    }


    .lep-news-hero h1 {
      font-size:
        42px;
    }


    .lep-news-hero-stats {
      display:
        grid;

      grid-template-columns:
        repeat(
          3,
          minmax(0,1fr)
        );
    }


    .lep-news-hero-stats div {
      min-width:
        0;

      padding:
        10px;
    }


    .lep-news-section-header {
      display:
        block;
    }


    .lep-news-result-badge {
      margin-top:
        10px;
    }


    .lep-news-grid {
      grid-template-columns:
        1fr;
    }


    .lep-news-card.featured {
      grid-column:
        auto;
    }


    .lep-news-card.featured
      .lep-news-card-image {
      height:
        195px;
    }


    .lep-news-card.featured
      .lep-news-card-body h3 {
      font-size:
        17px;
    }


    .lep-news-filter-bar {
      overflow-x:
        auto;

      flex-wrap:
        nowrap;

      padding-bottom:
        5px;
    }


    .lep-news-filter {
      flex-shrink:
        0;
    }

  }

`;

export default News;
