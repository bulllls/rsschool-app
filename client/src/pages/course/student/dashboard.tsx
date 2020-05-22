import { message, Result } from 'antd';
import moment from 'moment';
import Masonry from 'react-masonry-css';
import css from 'styled-jsx/css';
import { useAsync } from 'react-use';
import { useMemo, useState } from 'react';

import { PageLayout, LoadingScreen } from 'components';
import withCourseData from 'components/withCourseData';
import withSession from 'components/withSession';
import { CourseService, StudentSummary, CourseTask } from 'services/course';
import { CoursePageProps } from 'services/models';
import { UserService } from 'services/user';
import { StudentTasksDetail } from '../../../../../common/models';
import { MainStatsCard, MentorCard, TasksStatsCard } from 'components/Dashboard';

function Page(props: CoursePageProps) {
  const { githubId } = props.session;
  const { fullName } = props.course;

  const courseService = useMemo(() => new CourseService(props.course.id), [props.course.id]);
  const userService = useMemo(() => new UserService(), [props.course.id]);

  const [studentSummary, setStudentSummary] = useState({} as StudentSummary);
  const [courseTasks, setCourseTasks] = useState([] as CourseTask[]);
  const [tasksDetail, setTasksDetail] = useState([] as StudentTasksDetail[]);
  const [loading, setLoading] = useState(false);

  const checkTaskResults = (results: any[], taskId: number) =>
    results.find((task: any) => task.courseTaskId === taskId);

  useAsync(async () => {
    try {
      setLoading(true);
      const [studentSummary, courseTasks, statisticsCourses] = await Promise.all([
        courseService.getStudentSummary(githubId),
        courseService.getCourseTasks(),
        userService.getProfileInfo(githubId),
      ]);
      const tasksDetailCurrentCourse =
        statisticsCourses.studentStats?.find(course => course.courseId === props.course.id)?.tasks ?? [];

      setStudentSummary(studentSummary);
      setCourseTasks(courseTasks);
      setTasksDetail(tasksDetailCurrentCourse);
    } catch {
      message.error('An error occurred. Please try later.');
    } finally {
      setLoading(false);
    }
  }, [props.course.id]);

  const currentDate = moment([2020, 2, 26]);

  const maxCourseScore = courseTasks.reduce((score, task) => score + (task.maxScore ?? 0), 0);

  const tasksCompleted = courseTasks
    .filter(task => !!checkTaskResults(studentSummary.results, task.id))
    .map(task => {
      const { comment, taskGithubPrUris, score } = tasksDetail.find(taskDetail => taskDetail.name === task.name) ?? {};
      return { ...task, comment, githubPrUri: taskGithubPrUris, score };
    });
  const tasksNotDone = courseTasks
    .filter(
      task =>
        moment(task.studentEndDate as string).isBefore(currentDate, 'date') &&
        !checkTaskResults(studentSummary.results, task.id),
    )
    .map(task => ({ ...task, comment: null, githubPrUri: null, score: 0 }));
  const tasksFuture = courseTasks
    .filter(
      task =>
        moment(task.studentEndDate as string).isAfter(currentDate, 'date') &&
        !checkTaskResults(studentSummary.results, task.id),
    )
    .map(task => ({ ...task, comment: null, githubPrUri: null, score: null }));

  const taskStatistics = { completed: tasksCompleted, notDone: tasksNotDone, future: tasksFuture };
  const courseProgress = Number((tasksCompleted.length / courseTasks.length * 100).toFixed(1));

  const { isActive, totalScore } = studentSummary ?? {};

  const cards = [
    studentSummary && (
      <MainStatsCard
        isActive={isActive}
        totalScore={totalScore}
        position={356}
        courseProgress={courseProgress}
        maxCourseScore={maxCourseScore}
      />
    ),
    studentSummary?.mentor && <MentorCard mentor={studentSummary?.mentor} />,
    courseTasks.length && <TasksStatsCard tasks={taskStatistics} courseName={fullName} />,
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
