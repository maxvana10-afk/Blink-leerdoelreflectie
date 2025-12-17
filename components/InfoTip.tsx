import React from 'react';

interface InfoTipProps {
  example: string;
  criteria: string;
}

export const InfoTip: React.FC<InfoTipProps> = ({ example, criteria }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r text-sm text-slate-700 mb-2">
      <p className="font-bold text-blue-800 mb-1">💡 Tip & Criteria:</p>
      <ul className="list-disc list-inside space-y-1">
        <li className="italic text-slate-600">{example}</li>
        <li className="font-medium text-blue-900">{criteria}</li>
      </ul>
    </div>
  );
};
