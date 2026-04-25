import PeopleList from '../people/PeopleList';
import Timeline from '../timeline/Timeline';
import DetailPanel from '../detail/DetailPanel';

export default function Layout() {
  return (
    <div className="flex flex-1 overflow-hidden min-h-0">
      <PeopleList />
      <Timeline />
      <DetailPanel />
    </div>
  );
}
