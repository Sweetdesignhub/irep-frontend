import { useState } from 'react';
import { Button, Popover, Select } from 'antd';
import { CheckOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const frameworks = [
    { value: "eu-mdr", label: "EU MDR" },
    { value: "eu-ivdr", label: "EU IVDR" },
    { value: "fda-qsr", label: "FDA QSR" },
    { value: "iso-13485", label: "ISO 13485" },
];

const standards = [
    { value: "gs1", label: "GS1 Standards" },
    { value: "hl7", label: "HL7" },
    { value: "dicom", label: "DICOM" },
    { value: "ihe", label: "IHE" },
];

export default function MultiSelect() {
    const [selectedFramework, setSelectedFramework] = useState("eu-mdr");
    const [selectedStandard, setSelectedStandard] = useState("gs1");

    return (
        <div className="w-full max-w-2xl p-6 space-y-4 rounded-xl bg-white shadow-sm">
            <h2 className="text-xl font-medium text-gray-700">Which regulatory frameworks apply to this product?</h2>

            <div className="flex items-center gap-3">
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a framework"
                    optionFilterProp="children"
                    value={selectedFramework}
                    onChange={setSelectedFramework}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    suffixIcon={<DownOutlined className="text-gray-500" />}
                >
                    {frameworks.map((framework) => (
                        <Option key={framework.value} value={framework.value}>
                            {framework.label}
                        </Option>
                    ))}
                </Select>

                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a standard"
                    optionFilterProp="children"
                    value={selectedStandard}
                    onChange={setSelectedStandard}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    suffixIcon={<DownOutlined className="text-gray-500" />}
                >
                    {standards.map((standard) => (
                        <Option key={standard.value} value={standard.value}>
                            {standard.label}
                        </Option>
                    ))}
                </Select>

                <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 hover:bg-blue-700" />
            </div>
        </div>
    );
}