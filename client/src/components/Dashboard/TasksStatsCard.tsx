import * as React from 'react';
import CommonCard from './CommonDashboardCard';
import { AuditOutlined } from '@ant-design/icons';
import { CourseTask } from 'services/course';
import { Doughnut } from 'react-chartjs-2';

export interface TasksStatistics {
  completed: CourseTask[];
  notDone: CourseTask[];
  future: CourseTask[];
}

export interface ITooltipItem {
  datasetIndex: number;
  index: number;
  x: number;
  xLabel: string;
  y: number;
  yLabel: number;
}

export interface ITooltipData<T> {
  datasets: IChartsConfigDataDatasets<T>[];
  labels: string[];
}

interface IChartsConfigDataDatasets<T> {
  data: T[];
  ricData?: string[];
  totData?: string[];
  hoverBorderColor?: string;
  hoverBorderWidth?: number;
  backgroundColor?: string;
  label?: string;
  borderWidth?: number;
  borderColor?: string;
  borderAlign?: string;
}

type Props = {
  data: TasksStatistics;
};

export function TasksStatsCard(props: Props) {
  const {
    data: { completed, notDone, future },
  } = props;
  const totalCountTasks = completed.length + notDone.length + future.length;
  console.log(totalCountTasks);

  function setChartTooltipOptions() {
    return {
      title(tooltipItems: ITooltipItem[], data: ITooltipData<number>) {
        const index: number = tooltipItems[0].index;
        const label: string = data.labels[index].toLowerCase();
        const value: number = data.datasets[0].data[index];
        return `Tasks ${label}: ${value}`;
      },
      label() {
        return;
      },
      footer() {
        return ' Click to see details';
      },
    };
  }

  const data = {
    labels: ['Completed', 'Not completed', 'Future'],
    datasets: [
      {
        data: [completed.length, notDone.length, future.length],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const options = {
    cutoutPercentage: 20,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 10,
      },
    },
    legend: {
      labels: {
        fontSize: 14,
        padding: 30,
        boxWidth: 15,
      },
      position: 'bottom',
    },
    tooltips: {
      titleFontStyle: 'normal',
      titleFontSize: 14,
      callbacks: setChartTooltipOptions(),
    },
    onClick: (_: any, chartItem: any) => {
      if (chartItem[0]) {
        console.log(chartItem[0]._model.label);
      }
    },
  };

  return (
    <CommonCard
      title="Tasks statistics Pie chart"
      icon={<AuditOutlined />}
      content={
        <div>
          <Doughnut data={data} options={options} />
        </div>
      }
    />
  );
}
