
import React, { useState } from "react";
import { Table } from "antd";

const ViewTeams = ({ orgId }) => {
  const [teams] = useState([
    {
      id: 1,
      name: "Team A",
      description: "Description for Team A",
    },
    {
      id: 2,
      name: "Team B",
      description: "Description for Team B",
    },
    {
      id: 3,
      name: "Team C",
      description: "Description for Team C",
    },
  ]);

  const columns = [
    {
      title: "Team Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <div>
      <h3>Teams in Organization {orgId}</h3>
      <Table
        columns={columns}
        dataSource={teams}
        rowKey="id"
      />
    </div>
  );
};

export default ViewTeams;
