import {
  message,
  //  Card, Row, Col, Statistic,
  //  Typography,
  // Popover,
  Result,
} from 'antd';
import moment from 'moment';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  // GithubUserLink,
  PageLayout,
  LoadingScreen,
} from 'components';
import withCourseData from 'components/withCourseData';
import withSession from 'components/withSession';
import { useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { CourseService, StudentSummary, CourseTask } from 'services/course';
import { CoursePageProps } from 'services/models';
// import { dateTimeRenderer } from 'components/Table/renderers';
import Masonry from 'react-masonry-css';
import css from 'styled-jsx/css';
import { StatsCard } from 'components/Dashboard/StatsCard';
import { MentorCard } from 'components/Dashboard/MentorCard';
import { TasksStatsCard } from 'components/Dashboard/TasksStatsCard';

function Page(props: CoursePageProps) {
  const courseService = useMemo(() => new CourseService(props.course.id), [props.course.id]);
  const [studentSummary, setStudentSummary] = useState({} as StudentSummary);
  const [courseTasks, setCourseTasks] = useState([] as CourseTask[]);
  const [loading, setLoading] = useState(false);

  // const renderContact = (label: string, value?: string) => {
  //   if (!value) {
  //     return null;
  //   }
  //   return (
  //     <p>
  //       <Typography.Text type="secondary">{label}:</Typography.Text> {value}
  //     </p>
  //   );
  // };

  const checkTaskResults = (results: any[], taskId: number) =>
    results.find((task: any) => task.courseTaskId === taskId);

  // const renderIconTaskInfo = (
  //   scoreWeight: number | string = '',
  //   taskEndDate: string | null,
  //   taskStartDate: string | null,
  // ) => (
  //   <Popover
  //     content={
  //       <ul>
  //         <li>Coefficient: {scoreWeight}</li>
  //         <li>Start: {dateTimeRenderer(taskStartDate)}</li>
  //         <li>Deadline: {dateTimeRenderer(taskEndDate)}</li>
  //       </ul>
  //     }
  //     trigger="click"
  //   >
  //     <QuestionCircleOutlined title="Click for detatils" />
  //   </Popover>
  // );

  // const renderTask = (task: CourseTask) => {
  //   const { id, name, descriptionUrl, scoreWeight, studentEndDate, studentStartDate } = task;
  //   return (
  //     <div key={`task-id-${id}`}>
  //       <Typography.Text strong>
  //         <a target="_blank" className="link-user-profile" href={descriptionUrl ?? '#'}>
  //           {name}
  //         </a>
  //       </Typography.Text>{' '}
  //       {renderIconTaskInfo(scoreWeight, studentEndDate, studentStartDate)}
  //     </div>
  //   );
  // };

  useAsync(async () => {
    try {
      setLoading(true);
      const [studentSummary, courseTasks] = await Promise.all([
        courseService.getStudentSummary('me'),
        courseService.getCourseTasks(),
      ]);
      setStudentSummary(studentSummary);
      setCourseTasks(courseTasks);
    } catch {
      message.error('An error occurred. Please try later.');
    } finally {
      setLoading(false);
    }
  }, [props.course.id]);

  // const { name, githubId, contactsEmail, contactsPhone, contactsSkype, contactsTelegram, contactsNotes } =
  //   studentSummary.mentor ?? {};
  const currentDate = moment([2020, 2, 26]);

  const tasksCompleted = courseTasks.filter(task => !!checkTaskResults(studentSummary.results, task.id));
  const tasksNotDone = courseTasks.filter(
    task =>
      moment(task.studentEndDate as string).isBefore(currentDate, 'date') &&
      !checkTaskResults(studentSummary.results, task.id),
  );
  const tasksFuture = courseTasks.filter(
    task =>
      moment(task.studentEndDate as string).isAfter(currentDate, 'date') &&
      !checkTaskResults(studentSummary.results, task.id),
  );

  const taskStatistics = { completed: tasksCompleted, notDone: tasksNotDone, future: tasksFuture };

  const cards = [
    studentSummary && <StatsCard data={studentSummary} />,
    studentSummary?.mentor && <MentorCard data={studentSummary?.mentor} />,
    courseTasks.length && <TasksStatsCard data={taskStatistics} />,
  ];

  return (
    <PageLayout
      loading={loading}
      title="Student dashboard"
      githubId={props.session.githubId}
      courseName={props.course.name}
    >
      <LoadingScreen show={loading}>
        {studentSummary ? (
          <div style={{ padding: 10 }}>
            <Masonry
              breakpointCols={{
                default: 4,
                1100: 3,
                700: 2,
                500: 1,
              }}
              className={masonryClassName}
              columnClassName={masonryColumnClassName}
            >
              {cards.map((card, idx) => (
                <div style={{ marginBottom: gapSize }} key={`card-${idx}`}>
                  {card}
                </div>
              ))}
            </Masonry>
            {masonryStyles}
            {masonryColumnStyles}
          </div>
        ) : (
          <>
            <Result status={'403' as any} title="No access or user does not exist" />
          </>
        )}
      </LoadingScreen>
    </PageLayout>
  );
}

const gapSize = 16;
const { className: masonryClassName, styles: masonryStyles } = css.resolve`
  div {
    display: flex;
    margin-left: -${gapSize}px;
    width: auto;
  }
`;
const { className: masonryColumnClassName, styles: masonryColumnStyles } = css.resolve`
  div {
    padding-left: ${gapSize}px;
    background-clip: padding-box;
  }
`;

export default withCourseData(withSession(Page));
