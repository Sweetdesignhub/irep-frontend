

import { TableView } from "./TableView";
import { GridView } from "./GridView";
// import { Loading } from "../common/Loading";

// const ruleItems = [
//   {
//     id: 1,
//     title: "Access Controls",
//     description: "Manages user access levels and permissions",
//     category: "Security",
//     activationDate: "18-04-2024",
//     execution: "30",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fd7bc4c5b9be74bff92b58afd24361b93",
//     errorRate: "10%",
//     borderColor: "#69D0FF",
//   },
//   {
//     id: 2,
//     title: "Data Backup",
//     description: "Automates regular data backup processes",
//     category: "Operations",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fa7f7cfd0225e40f0aae063af84d2a5b9",
//     errorRate: "10%",
//     borderColor: "#B844EE",
//   },
//   {
//     id: 3,
//     title: "Leave Request",
//     description: "Automates employee leave requests",
//     category: "HR",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fa7f7cfd0225e40f0aae063af84d2a5b9",
//     errorRate: "10%",
//     borderColor: "#FF7E29",
//   },
//   {
//     id: 4,
//     title: "Inventory Check",
//     description: "Checks for low stock and initiates reorder",
//     category: "Logistics",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fa7f7cfd0225e40f0aae063af84d2a5b9",
//     errorRate: "10%",
//     borderColor: "#FF7E29",
//   },
//   {
//     id: 5,
//     title: "Expense Reporting",
//     description: "MStreamlines submission of expense reports",
//     category: "Finance",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fd7bc4c5b9be74bff92b58afd24361b93",
//     errorRate: "10%",
//     borderColor: "#69D0FF",
//   },
//   {
//     id: 6,
//     title: "Quality Check",
//     description: "Ensures product quality meets standards",
//     category: "Productions",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fd7bc4c5b9be74bff92b58afd24361b93",
//     errorRate: "10%",
//     borderColor: "#43A945",
//   },
//   {
//     id: 7,
//     title: "Overtime Authorization",
//     description: "Authorizes overtime work for employees",
//     category: "HR",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fa7f7cfd0225e40f0aae063af84d2a5b9",
//     errorRate: "10%",
//     borderColor: "#43A945",
//   },
//   {
//     id: 8,
//     title: "Inventory Replenishment",
//     description: "Triggers restock when inventory falls below threshold",
//     category: "Logistics",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fa7f7cfd0225e40f0aae063af84d2a5b9",
//     errorRate: "10%",
//     borderColor: "#FF7E29",
//   },
//   {
//     id: 9,
//     title: "Access Controls",
//     description: "Manages user access levels and permissions",
//     category: "Security",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fd7bc4c5b9be74bff92b58afd24361b93",
//     errorRate: "10%",
//     borderColor: "#B844EE",
//   },
//   {
//     id: 10,
//     title: "Access Controls",
//     description: "Manages user access levels and permissions",
//     category: "Security",
//     activationDate: "18-04-2024",
//     execution: "10",
//     trend:
//       "https://cdn.builder.io/api/v1/image/assets%2F80831ebc592245a9bb7889764d1141b4%2Fd7bc4c5b9be74bff92b58afd24361b93",
//     errorRate: "10%",
//     borderColor: "#43A945",
//   },
// ];

const ListGridViewToggle = ({ view, ruleItems, currOrg, fetchRules }) => {
  if (!ruleItems || ruleItems.length === 0) {
    return <div className="text-center">
      No rules, create new rule..
    </div>;
  }
  return (
    <div className="p-4 relative">
      {view === "list" ? (
        <TableView
          ruleItems={ruleItems}
          currOrg={currOrg}
          fetchRules={fetchRules}
        />
      ) : (
        <GridView
          ruleItems={ruleItems}
          currOrg={currOrg}
          fetchRules={fetchRules}
        />
      )}
    </div>
  );
};

export default ListGridViewToggle;
