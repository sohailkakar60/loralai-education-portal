
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import SmartIcon from "../components/SmartIcon";
import API_URL from "../config/api";


function NewsDetails() {
  const { slug } = useParams();

  const [article, setArticle] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // LOAD ARTICLE
  // =========================================================

  useEffect(() => {

    const loadArticle =
      async () => {

        try {

          setLoading(true);
          setError("");

          if (!slug) {
            throw new Error(
              "News article slug is missing."
            );
          }


          const response =
            await fetch(
              `${API_URL}/api/news/${slug}`
            );


          const data =
            await response.json();


          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "News article not found."
            );
          }


          const loadedArticle =
            data.data?.news;


          if (!loadedArticle) {
            throw new Error(
              "News article data was not returned."
            );
          }


          setArticle(
            loadedArticle
          );

        } catch (err) {

          console.error(
            "Load news article error:",
            err
          );


          setError(
            err.message ||
              "Failed to load news article."
          );

          setArticle(null);

        } finally {

          setLoading(false);

        }
      };


    loadArticle();

  }, [slug]);


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
            month: "long",
            year: "numeric",
          }
        );

      } catch {

        return "";

      }
    };


  const getCategoryIcon =
    (value) => {

      const category =
        String(
          value || "general"
        ).toLowerCase();


      const icons = {
        education: "education",
        scholarships: "verified",
        admissions: "admissions",
        exams: "document",
        events: "calendar",
        jobs: "briefcase",
        announcements: "announcement",
        general: "news",
      };


      return (
        icons[category] ||
        "news"
      );

    };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-news-details-page">

          <div className="lep-news-details-container">

            <div className="lep-news-details-state">

              <div className="lep-news-details-state-icon">

                <SmartIcon
                  name="news"
                  size={29}
                />

              </div>


              <span>
                LORALAI EDUCATION PORTAL
              </span>


              <h1>
                Loading Article...
              </h1>


              <p>
                Please wait while we load
                the news article.
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

  if (
    error ||
    !article
  ) {

    return (
      <>
        <style>{styles}</style>

        <main className="lep-news-details-page">

          <div className="lep-news-details-container">

            <div className="lep-news-details-state error">

              <div className="lep-news-details-state-icon">

                <SmartIcon
                  name="search"
                  size={29}
                />

              </div>


              <span>
                LORALAI EDUCATION PORTAL
              </span>


              <h1>
                News Article Not Found
              </h1>


              <p>
                {error ||
                  "The requested news article is unavailable."}
              </p>


              <Link
                to="/news"
                className="lep-news-details-back-btn"
              >

                <SmartIcon
                  name="arrow-left"
                  size={13}
                />

                Back to News

              </Link>

            </div>

          </div>

        </main>
      </>
    );
  }


  const category =
    formatCategory(
      article.category
    );


  const categoryIcon =
    getCategoryIcon(
      article.category
    );


  const date =
    formatDate(
      article.published_at
    );


  const paragraphs =
    String(
      article.content || ""
    )
      .split(/\r?\n/)
      .map(
        (paragraph) =>
          paragraph.trim()
      )
      .filter(Boolean);


  return (
    <>
      <style>{styles}</style>


      <main className="lep-news-details-page">


        {/* =================================================
            ARTICLE HERO
        ================================================= */}

        <section className="lep-news-details-hero">

          <div className="lep-news-details-container">


            <Link
              to="/news"
              className="lep-news-details-back"
            >

              <SmartIcon
                name="arrow-left"
                size={13}
              />

              Back to News

            </Link>


            <div className="lep-news-details-hero-content">


              <div className="lep-news-details-meta">

                <span className="lep-news-category">

                  <SmartIcon
                    name={categoryIcon}
                    size={11}
                  />

                  {category}

                </span>


                {date && (

                  <span className="lep-news-date">

                    <SmartIcon
                      name="calendar"
                      size={11}
                    />

                    {date}

                  </span>

                )}

              </div>


              <h1>
                {article.title}
              </h1>


              {article.summary && (

                <p className="lep-news-details-summary">
                  {article.summary}
                </p>

              )}


              <div className="lep-news-details-author">

                <div className="lep-news-author-icon">

                  <SmartIcon
                    name="user"
                    size={16}
                  />

                </div>


                <div>

                  <span>
                    Published by
                  </span>


                  <strong>
                    {article.author_name ||
                      "Loralai Education Portal"}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            COVER IMAGE
        ================================================= */}

        <section className="lep-news-details-cover-section">

          <div className="lep-news-details-container">

            <div className="lep-news-details-cover">

              {article.cover_image_url ? (

                <img
                  src={
                    article.cover_image_url.startsWith(
                      "http"
                    )
                      ? article.cover_image_url
                      : `${API_URL}${article.cover_image_url}`
                  }
                  alt={article.title}
                />

              ) : (

                <div className="lep-news-details-cover-placeholder">

                  <SmartIcon
                    name={categoryIcon}
                    size={45}
                  />


                  <span>
                    {category}
                  </span>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            ARTICLE BODY
        ================================================= */}

        <section className="lep-news-details-content">

          <div className="lep-news-details-container">


            <div className="lep-news-details-layout">


              {/* MAIN ARTICLE */}

              <article className="lep-news-article">


                <div className="lep-news-article-heading">

                  <div className="lep-news-article-heading-icon">

                    <SmartIcon
                      name="document"
                      size={19}
                    />

                  </div>


                  <div>

                    <span>
                      EDUCATIONAL NEWS
                    </span>

                    <h2>
                      Article Details
                    </h2>

                  </div>

                </div>


                <div className="lep-news-article-content">

                  {paragraphs.length > 0 ? (

                    paragraphs.map(
                      (
                        paragraph,
                        index
                      ) => (

                        <p
                          key={
                            index
                          }
                        >
                          {paragraph}
                        </p>

                      )
                    )

                  ) : (

                    <p>
                      {article.summary ||
                        "No article content is available."}
                    </p>

                  )}

                </div>


                <div className="lep-news-article-footer">

                  <Link
                    to="/news"
                    className="lep-news-details-back-btn"
                  >

                    <SmartIcon
                      name="arrow-left"
                      size={13}
                    />

                    Back to All News

                  </Link>

                </div>

              </article>


              {/* SIDEBAR */}

              <aside className="lep-news-details-sidebar">


                <div className="lep-news-side-card">

                  <span>
                    CATEGORY
                  </span>


                  <div className="lep-news-side-category">

                    <div>

                      <SmartIcon
                        name={categoryIcon}
                        size={18}
                      />

                    </div>


                    <strong>
                      {category}
                    </strong>

                  </div>

                </div>


                {date && (

                  <div className="lep-news-side-card">

                    <span>
                      PUBLISHED
                    </span>


                    <strong className="lep-news-side-big">
                      {date}
                    </strong>


                    <small>
                      Latest educational update
                    </small>

                  </div>

                )}


                <div className="lep-news-side-card">

                  <span>
                    SOURCE
                  </span>


                  <div className="lep-news-source">

                    <div>

                      <SmartIcon
                        name="news"
                        size={18}
                      />

                    </div>


                    <strong>
                      Loralai Education Portal
                    </strong>

                  </div>

                </div>


                <div className="lep-news-side-highlight">

                  <div className="lep-news-side-highlight-icon">

                    <SmartIcon
                      name="announcement"
                      size={19}
                    />

                  </div>


                  <span>
                    STAY INFORMED
                  </span>


                  <h3>
                    Keep up with important
                    educational updates.
                  </h3>


                  <Link
                    to="/news"
                    className="lep-news-side-link"
                  >

                    Browse More News

                    <SmartIcon
                      name="arrow-right"
                      size={12}
                    />

                  </Link>

                </div>

              </aside>

            </div>

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

  .lep-news-details-page {
    min-height: 100vh;

    background:
      linear-gradient(
        180deg,
        #f5f8fb,
        #edf3f8
      );
  }


  .lep-news-details-container {
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

  .lep-news-details-hero {
    position:
      relative;

    overflow:
      hidden;

    padding:
      40px 0 48px;

    background:
      radial-gradient(
        circle at 90% 5%,
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


  .lep-news-details-hero::before {
    content:
      "";

    position:
      absolute;

    width:
      450px;

    height:
      450px;

    right:
      -170px;

    bottom:
      -280px;

    border-radius:
      50%;

    background:
      rgba(255,255,255,.05);
  }


  .lep-news-details-back {
    position:
      relative;

    z-index:
      1;

    display:
      inline-flex;

    align-items:
      center;

    gap:
      6px;

    color:
      #d8e5ef;

    text-decoration:
      none;

    font-size:
      9px;

    font-weight:
      800;
  }


  .lep-news-details-back:hover {
    color:
      #ff9348;
  }


  .lep-news-details-hero-content {
    position:
      relative;

    z-index:
      1;

    max-width:
      880px;

    margin-top:
      25px;
  }


  .lep-news-details-meta {
    display:
      flex;

    align-items:
      center;

    flex-wrap:
      wrap;

    gap:
      8px;
  }


  .lep-news-category,
  .lep-news-date {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      5px;

    padding:
      6px 8px;

    border-radius:
      6px;

    font-size:
      7px;

    font-weight:
      900;

    text-transform:
      uppercase;
  }


  .lep-news-category {
    background:
      rgba(255,255,255,.95);

    color:
      #2c5f8a;
  }


  .lep-news-date {
    background:
      rgba(255,255,255,.08);

    color:
      #d0dfea;

    border:
      1px solid
      rgba(255,255,255,.12);
  }


  .lep-news-details-hero h1 {
    margin-top:
      14px;

    max-width:
      900px;

    color:
      #ffffff;

    font-size:
      clamp(
        39px,
        6vw,
        64px
      );

    line-height:
      1.02;

    letter-spacing:
      -2.5px;
  }


  .lep-news-details-summary {
    max-width:
      760px;

    margin-top:
      17px;

    color:
      #d5e3ee;

    font-size:
      13px;

    line-height:
      1.8;
  }


  .lep-news-details-author {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      9px;

    margin-top:
      22px;

    padding:
      10px 12px;

    border:
      1px solid
      rgba(255,255,255,.11);

    border-radius:
      10px;

    background:
      rgba(255,255,255,.07);

    backdrop-filter:
      blur(8px);
  }


  .lep-news-author-icon {
    width:
      35px;

    height:
      35px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      9px;

    background:
      #ff6b00;

    color:
      #ffffff;

    box-shadow:
      0 5px 0
      #b84b00;
  }


  .lep-news-details-author span {
    display:
      block;

    color:
      #a9bdce;

    font-size:
      7px;
  }


  .lep-news-details-author strong {
    display:
      block;

    margin-top:
      3px;

    color:
      #ffffff;

    font-size:
      9px;
  }


  /* =======================================================
     COVER
  ======================================================= */

  .lep-news-details-cover-section {
    padding:
      25px 0 0;
  }


  .lep-news-details-cover {
    position:
      relative;

    height:
      430px;

    overflow:
      hidden;

    border:
      1px solid
      #dce5ec;

    border-radius:
      18px;

    background:
      linear-gradient(
        135deg,
        #1a365d,
        #2c5f8a
      );

    box-shadow:
      0 22px 50px
      rgba(26,54,93,.13);

    transform:
      perspective(1200px)
      rotateX(1deg);
  }


  .lep-news-details-cover img {
    width:
      100%;

    height:
      100%;

    object-fit:
      cover;
  }


  .lep-news-details-cover-placeholder {
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
      10px;

    color:
      #ff9348;
  }


  .lep-news-details-cover-placeholder span {
    color:
      rgba(255,255,255,.84);

    font-size:
      10px;

    font-weight:
      900;

    letter-spacing:
      1px;

    text-transform:
      uppercase;
  }


  /* =======================================================
     CONTENT
  ======================================================= */

  .lep-news-details-content {
    padding:
      25px 0 80px;
  }


  .lep-news-details-layout {
    display:
      grid;

    grid-template-columns:
      minmax(0,1fr)
      290px;

    gap:
      17px;

    align-items:
      start;
  }


  .lep-news-article {
    padding:
      24px;

    border:
      1px solid
      #e0e8ef;

    border-radius:
      16px;

    background:
      #ffffff;

    box-shadow:
      0 12px 30px
      rgba(26,54,93,.055);
  }


  .lep-news-article-heading {
    display:
      flex;

    align-items:
      center;

    gap:
      11px;

    padding-bottom:
      17px;

    border-bottom:
      1px solid
      #edf1f4;
  }


  .lep-news-article-heading-icon {
    width:
      43px;

    height:
      43px;

    display:
      grid;

    place-items:
      center;

    flex-shrink:
      0;

    border-radius:
      10px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #2c5f8a
      );

    color:
      #ff9348;

    box-shadow:
      0 6px 0
      #142b47;
  }


  .lep-news-article-heading span {
    display:
      block;

    color:
      #ff6b00;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1.1px;
  }


  .lep-news-article-heading h2 {
    margin-top:
      4px;

    color:
      #1a365d;

    font-size:
      20px;
  }


  .lep-news-article-content {
    padding-top:
      20px;
  }


  .lep-news-article-content p {
    margin-bottom:
      16px;

    color:
      #4f6273;

    font-size:
      12px;

    line-height:
      2;
  }


  .lep-news-article-footer {
    margin-top:
      22px;

    padding-top:
      17px;

    border-top:
      1px solid
      #edf1f4;
  }


  .lep-news-details-back-btn {
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
      0 13px;

    border-radius:
      9px;

    background:
      #1a365d;

    color:
      #ffffff;

    text-decoration:
      none;

    font-size:
      9px;

    font-weight:
      900;

    box-shadow:
      0 7px 0
      #142b47;
  }


  .lep-news-details-back-btn:hover {
    background:
      #2c5f8a;
  }


  /* =======================================================
     SIDEBAR
  ======================================================= */

  .lep-news-details-sidebar {
    display:
      grid;

    gap:
      12px;

    position:
      sticky;

    top:
      90px;
  }


  .lep-news-side-card {
    padding:
      18px;

    border:
      1px solid
      #e0e8ef;

    border-radius:
      14px;

    background:
      #ffffff;

    box-shadow:
      0 10px 27px
      rgba(26,54,93,.055);
  }


  .lep-news-side-card > span {
    display:
      block;

    color:
      #ff6b00;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1.1px;
  }


  .lep-news-side-category {
    display:
      flex;

    align-items:
      center;

    gap:
      9px;

    margin-top:
      9px;
  }


  .lep-news-side-category > div,
  .lep-news-source > div {
    width:
      39px;

    height:
      39px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      9px;

    background:
      #eef4f8;

    color:
      #2c5f8a;
  }


  .lep-news-side-category strong {
    color:
      #1a365d;

    font-size:
      10px;
  }


  .lep-news-side-big {
    display:
      block;

    margin-top:
      6px;

    color:
      #1a365d;

    font-size:
      14px;
  }


  .lep-news-side-card small {
    display:
      block;

    margin-top:
      3px;

    color:
      #94a3b8;

    font-size:
      8px;
  }


  .lep-news-source {
    display:
      flex;

    align-items:
      center;

    gap:
      9px;

    margin-top:
      9px;
  }


  .lep-news-source strong {
    color:
      #1a365d;

    font-size:
      9px;

    line-height:
      1.4;
  }


  .lep-news-side-highlight {
    padding:
      19px;

    border-radius:
      14px;

    background:
      linear-gradient(
        145deg,
        #1a365d,
        #275a86
      );

    color:
      #ffffff;

    box-shadow:
      0 16px 32px
      rgba(26,54,93,.13);
  }


  .lep-news-side-highlight-icon {
    width:
      43px;

    height:
      43px;

    display:
      grid;

    place-items:
      center;

    border-radius:
      10px;

    background:
      #ff6b00;

    color:
      #ffffff;

    box-shadow:
      0 6px 0
      #b84b00;
  }


  .lep-news-side-highlight > span {
    display:
      block;

    margin-top:
      16px;

    color:
      #ffb06e;

    font-size:
      7px;

    font-weight:
      900;

    letter-spacing:
      1.1px;
  }


  .lep-news-side-highlight h3 {
    margin-top:
      5px;

    color:
      #ffffff;

    font-size:
      18px;

    line-height:
      1.3;
  }


  .lep-news-side-link {
    display:
      inline-flex;

    align-items:
      center;

    gap:
      6px;

    margin-top:
      15px;

    color:
      #ffffff;

    text-decoration:
      none;

    font-size:
      9px;

    font-weight:
      900;
  }


  .lep-news-side-link:hover {
    color:
      #ffb06e;
  }


  /* =======================================================
     STATES
  ======================================================= */

  .lep-news-details-state {
    min-height:
      500px;

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
  }


  .lep-news-details-state.error {
    background:
      transparent;
  }


  .lep-news-details-state-icon {
    width:
      65px;

    height:
      65px;

    display:
      grid;

    place-items:
      center;

    margin-bottom:
      14px;

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


  .lep-news-details-state.error
    .lep-news-details-state-icon {
    background:
      linear-gradient(
        145deg,
        #6b2430,
        #a83343
      );

    color:
      #ffb5bd;

    box-shadow:
      0 9px 0
      #501b23;
  }


  .lep-news-details-state > span {
    color:
      #ff6b00;

    font-size:
      8px;

    font-weight:
      900;

    letter-spacing:
      1.2px;
  }


  .lep-news-details-state h1 {
    margin-top:
      7px;

    color:
      #1a365d;

    font-size:
      27px;
  }


  .lep-news-details-state p {
    max-width:
      500px;

    margin-top:
      8px;

    color:
      #718096;

    font-size:
      10px;

    line-height:
      1.7;
  }


  /* =======================================================
     RESPONSIVE
  ======================================================= */

  @media (max-width: 900px) {

    .lep-news-details-layout {
      grid-template-columns:
        1fr;
    }


    .lep-news-details-sidebar {
      position:
        static;

      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
        );
    }


    .lep-news-side-highlight {
      grid-column:
        1 / -1;
    }

  }


  @media (max-width: 650px) {

    .lep-news-details-container {
      width:
        calc(100% - 24px);
    }


    .lep-news-details-hero {
      padding:
        28px 0 38px;
    }


    .lep-news-details-hero h1 {
      font-size:
        40px;
    }


    .lep-news-details-cover {
      height:
        250px;

      border-radius:
        13px;
    }


    .lep-news-article {
      padding:
        18px;
    }


    .lep-news-details-sidebar {
      grid-template-columns:
        1fr;
    }


    .lep-news-side-highlight {
      grid-column:
        auto;
    }


    .lep-news-article-content p {
      font-size:
        11px;

      line-height:
        1.85;
    }

  }

`;

export default NewsDetails;
