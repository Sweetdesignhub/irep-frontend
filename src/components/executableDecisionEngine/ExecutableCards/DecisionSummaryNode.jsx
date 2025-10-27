import { Handle, Position } from '@xyflow/react';
// import { CheckCircle } from 'lucide-react';

export const DecisionSummaryNode = ({ data }) => {
    const decisions = [
        'Trade Name updated',
        'EU MDR requires updates',
        'New GTIN assigned.'
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md min-w-[300px]">
            <div className="text-black font-bold mb-3">Decision Summary</div>
            <div className="flex flex-col gap-2">
                {decisions.map((decision, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-blue-500">{decision}</span>
                        {/* <CheckCircle className="text-green-500" size={16} /> */}
                    </div>
                ))}
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};
