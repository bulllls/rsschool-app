import * as React from 'react';
import { Typography, Row, Col } from 'antd';
import CommonCard from './CommonDashboardCard';
import { TrophyOutlined } from '@ant-design/icons';
import GaugeChart from 'react-gauge-chart';

type Props = {
  isActive: boolean;
  totalScore: number;
  position: number;
  maxCourseScore: number;
};

export function MainStatsCard(props: Props) {
  const { isActive, totalScore, position, maxCourseScore } = props;
  const { Text } = Typography;
  return (
    <CommonCard
      title="Your stats"
      icon={<TrophyOutlined />}
      content={
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Row>
            <Col style={{ marginBottom: 7, marginRight: 50 }}>
            <GaugeChart id="gauge-chart1" />
            </Col>
            <Col>
              <p style={{ marginBottom: 7}}>
                Status: <Text style={{ color: isActive ? '#87d068' : '#ff5500' }} strong>{isActive ? 'Active' : 'Inactive'}</Text>
              </p>
              {position && (
                <p style={{ marginBottom: 7 }}>
                  Position: <Text strong>{position}</Text>
                </p>
              )}
              <p style={{ marginBottom: 7 }}>
                Total Score: <Text mark>{totalScore}</Text>
                {maxCourseScore && ` / ${maxCourseScore}`}
              </p>
            </Col>
          </Row>
        </div>
      }
    />
  );
}
