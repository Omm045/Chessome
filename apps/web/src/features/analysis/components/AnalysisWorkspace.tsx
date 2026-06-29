import React from 'react';
import { InteractiveBoard } from './Board/InteractiveBoard';
import { EnginePanel } from './Panels/EnginePanel';
import { MoveList } from './Panels/MoveList';
import { EvaluationGraph } from './Graph/EvaluationGraph';
import './AnalysisWorkspace.css';

export function AnalysisWorkspace() {
  return (
    <div className="analysis-workspace">
      
      {/* Mobile/Tablet/Desktop dynamic grid layout via CSS */}
      
      <div className="workspace-engine">
        <EnginePanel />
      </div>

      <div className="workspace-board">
        <InteractiveBoard />
        <div className="workspace-graph">
          <EvaluationGraph />
        </div>
      </div>

      <div className="workspace-moves">
        <MoveList />
      </div>

    </div>
  );
}
