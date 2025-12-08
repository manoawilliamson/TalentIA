import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const periods = [
  { label: 'Month', value: 'month' },
  { label: 'Week', value: 'week' },
  { label: 'Year', value: 'year' },
];

const baseOptions: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    forceNiceScale: true,
  },
};

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState([{ name: 'Projets', data: [] as number[] }]);
  const [categories, setCategories] = useState<string[]>([]);
  const [period, setPeriod] = useState<'month' | 'week' | 'year'>('month');

  useEffect(() => {
    fetch(`http://localhost:8080/api/projects/count-by-period/${period}`)
      .then(res => res.json())
      .then(res => {
        const data = res.data || [];
        setCategories(data.map((d: any) => d.period_display));
        setSeries([{ name: 'Projets', data: data.map((d: any) => d.project_count) }]);
      });
  }, [period]);

  const chartOptions: ApexOptions = {
    ...baseOptions,
    xaxis: {
      ...baseOptions.xaxis,
      categories,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            {periods.map(p => (
              <button
                key={p.value}
                className={`rounded py-1 px-3 text-xs font-medium ${
                  period === p.value
                    ? 'bg-white text-black shadow-card dark:bg-boxdark dark:text-white'
                    : 'text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark'
                }`}
                onClick={() => setPeriod(p.value as any)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;