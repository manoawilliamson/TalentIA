import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import Skills from './pages/Skills/Index';
import Projects from './pages/Projets/Index';
import Person from './pages/Person/Index';

import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import PersonSkills from './pages/Person/PersonSkills';
import UnifiedLists from './pages/Lists/UnifiedLists';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route
        index
        element={
          <>
            <PageTitle title="TalentIA | Login" />
            <SignIn />
          </>
        }
      />

      <Route
        element={<DefaultLayout />}
      >
        <Route
          path='/dashboard'
          element={
            <>
              <PageTitle title="Dashboard | Overview" />
              <ECommerce />
            </>
          }
        />
        <Route
          path='/person'
          element={
            <>
              <PageTitle title="Person | Overview" />
              <Person />
            </>
          }
        />
        <Route
          path='/skill'
          element={
            <>
              <PageTitle title="Skills | Overview" />
              <Skills />
            </>
          }
        />
        <Route
          path='/project'
          element={
            <>
              <PageTitle title="Projects | Overview" />
              <Projects />
            </>
          }
        />

        <Route
          path='/calendar'
          element={
            <>
              <PageTitle title="Calendar | Overview" />
              <Calendar />
            </>
          }
        />
        <Route
          path='/settings'
          element={
            <>
              <PageTitle title="Settings | Overview" />
              <Settings />
            </>
          }
        />
        <Route
          path='/person-skills'
          element={
            <>
              <PageTitle title="Person Skills | Overview" />
              <PersonSkills />
            </>
          }
        />
        <Route
          path='/lists'
          element={
            <>
              <PageTitle title="Lists | Overview" />
              <UnifiedLists />
            </>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
