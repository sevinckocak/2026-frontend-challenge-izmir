import { InvestigationProvider } from '../../context/InvestigationContext';
import CaseHeader from '../../components/header/CaseHeader';
import SuspectPanel from '../../components/suspects/SuspectPanel';
import InvestigationMap from '../../components/map/InvestigationMap';
import CaseTimeline from '../../components/timeline/CaseTimeline';
import RightPanels from '../../components/forensics/RightPanels';
import Taskbar from '../../components/taskbar/Taskbar';

export default function Dashboard() {
  return (
    <InvestigationProvider>
      <div className="h-screen flex flex-col bg-[#06091a] text-white overflow-hidden select-none">
        <CaseHeader />

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left: Suspects */}
          <SuspectPanel />

          {/* Center: Map + Timeline */}
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <InvestigationMap />
            <CaseTimeline />
          </div>

          {/* Right: Forensics / Evidence / Network */}
          <RightPanels />
        </div>

        <Taskbar />
      </div>
    </InvestigationProvider>
  );
}
