import React, { useState, useEffect } from 'react';

// Load helpers.
import { transpose } from 'csv-transpose';
import CSVtoJSON from './helpers/CSVtoJSON.js';
import ChartLine from './components/ChartLineFigure2.jsx';

import '../styles/styles.less';

function Figure3() {
  // Data states.
  const [dataFigure, setDataFigure] = useState(false);

  const cleanData = (data) => data.map((el, i) => {
    const labels = Object.keys(el).filter(val => val !== 'Name').map(val => val);
    const values = Object.values(el).map(val => parseFloat(val)).filter(val => !Number.isNaN(val));
    return ({
      data: values.map((val, j) => ({
        dataLabels: {
          y: (i === 0) ? -10 : 30
        },
        name: labels[j],
        y: val
      })),
      labels,
      lineWidth: 4,
      name: el.Name
    });
  });

  useEffect(() => {
    const data_file = `${(window.location.href.includes('unctad.org')) ? 'https://storage.unctad.org/2023-global_trade_trends_3/' : './'}assets/data/2023-global_trade_trends_3_figure2.csv`;
    try {
      fetch(data_file)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.text();
        })
        .then(body => setDataFigure(cleanData(CSVtoJSON(transpose(body)))));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="app">
      {dataFigure && (
      <ChartLine
        idx="3"
        data={dataFigure}
        note="Bilateral trade is categorized into 3 groups according to the geopolitical closeness index utilizing UN voting records as a metric. The figure then plots the change in the trade share of each of these groups taking Q1 2022 as basis. Data is weighed averaged and excludes intra European Union. Data excludes services."
        show_first_label
        source="UNCTAD calculations based on national statistics."
        subtitle="Average change in bilateral trade with each group since Q1 2022"
        suffix="%"
        title="Global trade patterns take a geopolitical turn"
        ylabel=""
      />
      )}
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default Figure3;
