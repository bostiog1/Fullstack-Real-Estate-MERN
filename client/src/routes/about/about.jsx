import React from "react";

const AboutPage = () => {
  return (
    <>
      <style>
        {`
          .aboutPage {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          @media (min-width: 768px) {
            .aboutPage {
              flex-direction: row;
            }
          }

          .textContainer {
            flex: 3;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 2rem 1rem;
            gap: 2rem;
          }

          @media (min-width: 768px) {
            .textContainer {
              padding-left: 6rem;
              padding-right: 2rem;
              gap: 2.5rem;
            }
          }

          @media (min-width: 1024px) {
            .textContainer {
              padding-left: 10rem;
              padding-right: 4rem;
            }
          }

          .textContainer h1 {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1f2937;
            line-height: 1.25;
          }

          @media (min-width: 1024px) {
            .textContainer h1 {
              font-size: 3rem;
            }
          }

          .textContainer p {
            font-size: 1.125rem;
            color: #4b5563;
            line-height: 1.625;
          }

          .boxes {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin-top: 2rem;
            flex-wrap: wrap;
          }

          @media (max-width: 640px) {
            .boxes {
              display: none;
            }
          }

          .box {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            flex: 1;
            min-width: 150px;
          }

          .box h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: #1f2937;
          }

          @media (min-width: 1024px) {
            .box h1 {
              font-size: 2.5rem;
            }
          }

          .box h2 {
            font-size: 0.875rem;
            font-weight: 300;
            color: #6b7280;
            margin-top: 0.25rem;
          }

          @media (min-width: 768px) {
            .box h2 {
              font-size: 1.125rem;
            }
          }

          .imgContainer {
            flex: 2;
            background-color: #fcf5f3;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            position: relative;
            overflow: hidden;
          }

          @media (max-width: 767px) {
            .imgContainer {
              display: none;
            }
          }

          .imgContainer img {
            width: 115%;
            object-fit: cover;
            position: absolute;
            right: 0;
          }

          @media (min-width: 1024px) {
            .imgContainer img {
              width: 105%;
            }
          }
        `}
      </style>
      <div className="aboutPage">
        <div className="textContainer">
          <h1>
            Cine suntem: Partenerul dumneavoastră de încredere în domeniul
            imobiliar
          </h1>
          <p>
            La BoostEstate, credem că găsirea unei locuințe este mai mult decât
            o simplă tranzacție ; este un eveniment de viață important. Misiunea
            noastră este de a simplifica călătoria prin furnizarea de servicii
            de neegalat, expert îndrumare, și o selecție curată de proprietăți
            care se potrivesc viziunea ta unică. Cu peste 16 ani de experiență,
            am ajutat mii de clienți să-și găsească casele și investițiile de
            vis.
          </p>
          <p>
            Echipa noastră de profesioniști dedicați se angajează să vă facă
            experiența imobiliară fără probleme și plăcută. Ne folosim de
            tehnologia de ultimă generație și de o cunoaștere aprofundată a
            pieței pentru a ne asigura că aveți toate informațiile de care aveți
            nevoie, chiar la îndemână.
          </p>

          <div className="boxes">
            <div className="box">
              <h1>2000+</h1>
              <h2>Proprietăți existente</h2>
            </div>

            <div className="box">
              <h1>5+</h1>
              <h2>Ani de experiență</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
