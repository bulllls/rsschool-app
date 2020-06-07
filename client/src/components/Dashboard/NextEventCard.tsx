import * as React from 'react';
import CommonCard from './CommonDashboardCard';
import { ScheduleOutlined, YoutubeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { CourseEvent } from 'services/course';
import { Row, Col, Tag, Typography, Select, Tooltip } from 'antd';
import { TIMEZONES } from 'configs/timezones';
import { dateTimeTimeZoneRenderer } from './renderers';
import { GithubUserLink } from 'components';

type Props = {
  nextEvent: CourseEvent;
};

const EventTypeColor: Record<string, string> = {
  deadline: 'red',
  test: '#63ab91',
  jstask: 'green',
  htmltask: 'green',
  htmlcssacademy: 'green',
  externaltask: 'green',
  codewars: 'green',
  codejam: 'green',
  newtask: 'green',
  lecture: 'blue',
  lecture_online: 'blue',
  lecture_offline: 'blue',
  lecture_mixed: 'blue',
  lecture_self_study: 'blue',
  info: '#ff7b00',
  warmup: '#63ab91',
  meetup: '#bde04a',
  workshop: '#bde04a',
  interview: '#63ab91',
};

const EventTypeToName: Record<string, string> = {
  lecture_online: 'online lecture',
  lecture_offline: 'offline lecture',
  lecture_mixed: 'mixed lecture',
  lecture_self_study: 'self study',
  warmup: 'warm-up',
  jstask: 'js task',
  kotlintask: 'kotlin task',
  objctask: 'objc task',
  htmltask: 'html task',
  codejam: 'code jam',
  externaltask: 'external task',
  htmlcssacademy: 'html/css academy',
  'codewars:stage1': 'codewars',
  'codewars:stage2': 'codewars',
};

export function NextEventCard(props: Props) {
  const [timeZone, setTimeZone] = React.useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const { nextEvent } = props;
  const { Text } = Typography;

  return (
    <CommonCard
      title="Next event"
      icon={<ScheduleOutlined />}
      content={
        Object.keys(nextEvent).length ? (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Row>
              <Select
                size={'small'}
                style={{ width: 150, height: 25, marginBottom: 16 }}
                placeholder="Please select a timezone"
                defaultValue={timeZone}
                onChange={setTimeZone}
              >
                {TIMEZONES.map(tz => (
                  <Select.Option key={tz} value={tz}>
                    {tz}
                  </Select.Option>
                ))}
              </Select>
              <Col>
                <p style={{ marginBottom: 7 }}>
                  Type:{' '}
                  <Tag color={EventTypeColor[nextEvent.event.type]}>
                    {EventTypeToName[nextEvent.event.type] || nextEvent.event.type}
                  </Tag>
                </p>
                {nextEvent?.event?.name && (
                  <Tooltip title={nextEvent?.comment ? nextEvent?.comment : null}>
                    <p style={{ marginBottom: 7 }}>
                      Name:{' '}
                      {
                        <Text strong>
                          {nextEvent?.event?.descriptionUrl ? (
                            <a target="_blank" href={nextEvent?.event?.descriptionUrl}>
                              {nextEvent?.event?.name}
                            </a>
                          ) : nextEvent?.broadcastUrl ? (
                            <a target="_blank" href={nextEvent?.broadcastUrl}>
                              {nextEvent?.event?.name}
                            </a>
                          ) : (
                            nextEvent?.event?.name
                          )}
                        </Text>
                      }
                    </p>
                  </Tooltip>
                )}
                {nextEvent?.dateTime && (
                  <p style={{ marginBottom: 7 }}>
                    Date: <Text strong>{dateTimeTimeZoneRenderer(nextEvent?.dateTime, timeZone)}</Text>
                  </p>
                )}
                {nextEvent?.place && (
                  <p style={{ marginBottom: 7 }}>
                    Place:{' '}
                    <Text strong>
                      {nextEvent?.place.includes('Youtube') ? (
                        <span>
                          <YoutubeOutlined /> {nextEvent?.place}{' '}
                          <Tooltip title="Ссылка будет в Discord">
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      ) : (
                        nextEvent?.place
                      )}
                    </Text>
                  </p>
                )}
                {nextEvent?.organizer.githubId && (
                  <div style={{ marginBottom: 7 }}>
                    Organizer: <Text strong>{<GithubUserLink value={nextEvent?.organizer.githubId} />}</Text>
                  </div>
                )}
              </Col>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
            </Row>
          </div>
        ) : (
          undefined
        )
      }
    />
  );
}
