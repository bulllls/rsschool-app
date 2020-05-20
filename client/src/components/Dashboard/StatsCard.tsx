import * as React from 'react';
import { Typography } from 'antd';
import CommonCard from './CommonDashboardCard';
import { TrophyOutlined } from '@ant-design/icons';
import { StudentSummary } from 'services/course';

type Props = {
  data: StudentSummary;
};

export function StatsCard(props: Props) {
  const {
    data: { isActive, totalScore },
  } = props;
  const { Text } = Typography;
  return (
    <CommonCard
      title="Your stats"
      icon={<TrophyOutlined />}
      content={
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <p>Status:</p>
            <p style={{ display: 'flex', fontSize: 22, color: isActive ? '#87d068' : '#ff5500' }}>
              {isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Position:{' '}
              <Text style={{ marginLeft: 5, fontSize: 18 }} strong>
                {totalScore}
              </Text>
            </p>
            <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Score Points:{' '}
              <Text style={{ marginLeft: 5, fontSize: 18 }} strong>
                {totalScore}
              </Text>
            </p>
          </div>
        </div>
      }
    />
  );
}
