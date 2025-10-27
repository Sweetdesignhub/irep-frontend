import { Handle, Position } from '@xyflow/react';

export const NextStepsNode = ({ data }) => {
    const steps = [
        'Download a Compliance Report.',
        'Notify stakeholders directly.',
        'Align inventory and production schedules.'
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md min-w-[300px]">
            <div className="text-lg font-bold text-red-500 mb-3">Next Steps</div>
            <div className="flex flex-col gap-2">
                {steps.map((step, index) => (
                    <div key={index} className="p-2 text-black bg-gray-50 rounded">
                        {step}
                    </div>
                ))}
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};