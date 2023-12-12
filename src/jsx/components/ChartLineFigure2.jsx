import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

// https://www.highcharts.com/
import Highcharts from 'highcharts';
import highchartsAccessibility from 'highcharts/modules/accessibility';
import highchartsExporting from 'highcharts/modules/exporting';
import highchartsExportData from 'highcharts/modules/export-data';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

import roundNr from '../helpers/RoundNr.js';

highchartsAccessibility(Highcharts);
highchartsExporting(Highcharts);
highchartsExportData(Highcharts);

Highcharts.setOptions({
  lang: {
    decimalPoint: '.',
    downloadCSV: 'Download CSV data',
    thousandsSep: ','
  }
});
Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => {
  const path = [
    // Arrow stem
    'M', x + w * 0.5, y,
    'L', x + w * 0.5, y + h * 0.7,
    // Arrow head
    'M', x + w * 0.3, y + h * 0.5,
    'L', x + w * 0.5, y + h * 0.7,
    'L', x + w * 0.7, y + h * 0.5,
    // Box
    'M', x, y + h * 0.9,
    'L', x, y + h,
    'L', x + w, y + h,
    'L', x + w, y + h * 0.9
  ];
  return path;
};

function LineChart({
  allow_decimals, data, idx, line_width, note, show_first_label, source, subtitle, suffix, title
}) {
  const chartRef = useRef();
  const isVisible = useIsVisible(chartRef, { once: true });

  const chartHeight = 700;
  const createChart = useCallback(() => {
    Highcharts.chart(`chartIdx${idx}`, {
      caption: {
        align: 'left',
        margin: 30,
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Roboto',
          fontSize: '14px'
        },
        text: `<em>Source:</em> ${source} <br /><em>Note:</em> <span>${note}`,
        verticalAlign: 'bottom',
        useHTML: true,
        x: 0
      },
      chart: {
        events: {
          load() {
            // eslint-disable-next-line react/no-this-in-sfc
            this.renderer.image('https://storage.unctad.org/2023-global_trade_trends_3/assets/img/unctad_logo.png', 20, 15, 83, 100).add();
          }
        },
        marginLeft: 70,
        height: chartHeight,
        resetZoomButton: {
          theme: {
            fill: '#fff',
            r: 0,
            states: {
              hover: {
                fill: '#0077b8',
                stroke: 'transparent',
                style: {
                  color: '#fff',
                  fontFamily: 'Roboto',
                }
              }
            },
            stroke: '#7c7067',
            style: {
              fontFamily: 'Roboto',
              fontSize: '13px',
              fontWeight: 400
            }
          }
        },
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Roboto',
          fontWeight: 400
        },
        type: 'line',
        zoomType: 'x'
      },
      colors: ['#009edb', '#f58220', '#72bf44'],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'separator', 'downloadPNG', 'downloadPDF', 'separator', 'downloadCSV'],
            symbol: 'download',
            symbolFill: '#000'
          }
        }
      },
      legend: {
        align: 'right',
        enabled: (data.length > 1),
        itemDistance: 20,
        itemStyle: {
          color: '#000',
          cursor: 'default',
          fontFamily: 'Roboto',
          fontSize: '14px',
          fontWeight: 400
        },
        layout: 'horizontal',
        verticalAlign: 'top'
      },
      plotOptions: {
        line: {
          animation: {
            duration: 3000
          },
          cursor: 'pointer',
          dataLabels: {
            allowOverlap: true,
            enabled: false,
            formatter() {
              // eslint-disable-next-line react/no-this-in-sfc
              return `<span style="color: ${this.color}">${roundNr(this.y, 0).toLocaleString('en-US')}${suffix}</div>`;
            },
            style: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontFamily: 'Roboto',
              fontSize: '18px',
              fontWeight: 400,
              textOutline: '2px solid #fff'
            }
          },
          events: {
            legendItemClick() {
              return false;
            },
            mouseOver() {
              return false;
            }
          },
          selected: true,
          lineWidth: line_width,
          marker: {
            enabled: false,
            radius: 0,
            states: {
              hover: {
                animation: false,
                enabled: false,
                radius: 8
              }
            },
            symbol: 'circle'
          },
          states: {
            hover: {
              halo: {
                size: 0
              },
              enabled: false,
              lineWidth: line_width
            }
          }
        }
      },
      responsive: {
        rules: [{
          chartOptions: {
            title: {
              margin: 40
            }
          },
          condition: {
            maxWidth: 630
          }
        }, {
          chartOptions: {
            chart: {
              height: 700
            },
            legend: {
              layout: 'horizontal'
            },
            title: {
              margin: 40,
              style: {
                fontSize: '26px',
                lineHeight: '30px'
              }
            },
            yAxis: [{
              title: {
                text: null
              }
            }, {
              title: {
                text: null
              }
            }]
          },
          condition: {
            maxWidth: 500
          }
        }, {
          chartOptions: {
            chart: {
              height: 800
            }
          },
          condition: {
            maxWidth: 400
          }
        }]
      },
      series: data,
      subtitle: {
        align: 'left',
        enabled: true,
        style: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '18px'
        },
        text: subtitle,
        widthAdjust: -100,
        x: 100
      },
      title: {
        align: 'left',
        margin: 20,
        style: {
          color: '#000',
          fontSize: '30px',
          fontWeight: 700,
          lineHeight: '34px'
        },
        text: title,
        widthAdjust: -160,
        x: 100
      },
      tooltip: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 0,
        borderWidth: 1,
        crosshairs: true,
        formatter() {
          // eslint-disable-next-line react/no-this-in-sfc
          const values = this.points.filter(point => point.series.name !== '').map(point => [point.series.name.split(' (')[0], point.y, point.color]);
          const rows = [];
          rows.push(values.map(point => `<div><span class="tooltip_label" style="color: ${point[2]}">${(point[0]) ? `${point[0]}: ` : ''}</span><span class="tooltip_value">${roundNr(point[1], 1).toFixed(1).toLocaleString('en-US')}${suffix}</span></div>`).join(''));
          // eslint-disable-next-line react/no-this-in-sfc
          return `<div class="tooltip_container"><h3 class="tooltip_header">${this.points[0].key}</h3>${rows}</div>`;
        },
        shadow: false,
        shared: true,
        useHTML: true
      },
      xAxis: {
        allowDecimals: false,
        crosshair: {
          color: '#ccc',
          width: 1
        },
        categories: data.labels,
        labels: {
          allowOverlap: false,
          enabled: true,
          style: {
            color: 'rgba(0, 0, 0, 0.8)',
            fontFamily: 'Roboto',
            fontSize: '14px',
            fontWeight: 400
          },
          formatter: (val) => (val.value).split(' ')[0],
          rotation: 0,
          reserveSpace: true,
          useHTML: false,
          y: 25
        },
        lineColor: '#ccc',
        lineWidth: 1,
        opposite: false,
        plotLines: [{
          color: 'rgba(124, 112, 103, 0.2)',
          value: -0.5,
          width: 1
        }, {
          color: 'rgba(124, 112, 103, 0.2)',
          value: 3.5,
          width: 1
        }, {
          color: 'rgba(124, 112, 103, 0.2)',
          value: 1.3,
          width: 0,
          label: {
            rotation: 0,
            verticalAlign: 'bottom',
            y: 45,
            text: '2022',
            style: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontFamily: 'Roboto',
              fontSize: '14px',
              fontWeight: 600
            }
          }
        }, {
          color: 'rgba(124, 112, 103, 0.2)',
          value: 5.3,
          width: 0,
          label: {
            rotation: 0,
            verticalAlign: 'bottom',
            y: 45,
            text: '2023',
            style: {
              color: 'rgba(0, 0, 0, 0.8)',
              fontFamily: 'Roboto',
              fontSize: '14px',
              fontWeight: 600
            }
          }
        }],
        tickInterval: 1,
        tickLength: 5,
        tickWidth: 1,
        title: {
          text: null
        },
        type: 'category'
      },
      yAxis: {
        allowDecimals: allow_decimals,
        gridLineColor: 'rgba(124, 112, 103, 0.2)',
        gridLineDashStyle: 'shortdot',
        gridLineWidth: 1,
        labels: {
          format: '{text}%',
          reserveSpace: true,
          style: {
            color: '#000',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: 400
          }
        },
        lineColor: 'transparent',
        lineWidth: 0,
        max: 8,
        min: -6,
        plotLines: [{
          color: 'rgba(124, 112, 103, 0.6)',
          value: 100,
          width: 1
        }],
        opposite: false,
        showFirstLabel: show_first_label,
        showLastLabel: true,
        tickInterval: 2,
        title: {
          text: null
        },
        type: 'linear'
      }
    });
    chartRef.current.querySelector(`#chartIdx${idx}`).style.opacity = 1;
  }, [allow_decimals, data, idx, line_width, note, show_first_label, source, subtitle, suffix, title]);

  useEffect(() => {
    if (isVisible === true) {
      setTimeout(() => {
        createChart();
      }, 300);
    }
  }, [createChart, isVisible]);

  return (
    <div className="chart_container">
      <div ref={chartRef}>
        {(isVisible) && (<div className="chart" id={`chartIdx${idx}`} />)}
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

LineChart.propTypes = {
  allow_decimals: PropTypes.bool,
  data: PropTypes.instanceOf(Array).isRequired,
  idx: PropTypes.string.isRequired,
  line_width: PropTypes.number,
  note: PropTypes.string,
  show_first_label: PropTypes.bool,
  source: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  suffix: PropTypes.string,
  title: PropTypes.string.isRequired,
};

LineChart.defaultProps = {
  allow_decimals: true,
  line_width: 5,
  note: '',
  show_first_label: true,
  subtitle: false,
  suffix: ''
};

export default LineChart;
