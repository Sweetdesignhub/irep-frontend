
import React from "react";
import TimeFilter from "../components/dashboard/TimeFilter";
import Rules from "../components/dashboard/Rules";
import OverAllUsage from "../components/dashboard/OverAllUsage";
import Cost from "../components/dashboard/Cost";
import UsageTrend from "../components/dashboard/UsageTrend";
import TeamUsage from "../components/dashboard/TeamUsage";
import TopBar from "../components/dashboard/TopBar";

function Dashboard() {
  const dashboardData = {
    rulesData: {
      totalRules: 494,
      activeRules: 350,
      inactiveRules: 144,
    },
    usageData: {
      totalExecutionsCount: 8000,
      totalSuccessfulExecutions: 7200,
      totalFailedExecutions: 800,
      executionData: [
        { month: "Oct", successful: 2000, failed: 400 },
        { month: "Nov", successful: 1800, failed: 500 },
        { month: "Dec", successful: 2200, failed: 300 },
        { month: "Jan", successful: 2100, failed: 300 },
        { month: "Feb", successful: 2500, failed: 200 },
        { month: "Mar", successful: 2600, failed: 100 },
      ],
    },
    budgetData: {
      totalBudget: 5000,
      utilization: 40,
      spent: 2000,
      remaining: 3000,
    },
  };

  const ruleAnalytics = dashboardData.rulesData || {};
  const usageAnalytics = dashboardData.usageData || {};
  const budgetAnalytics = dashboardData.budgetData || {};
  const executionData = usageAnalytics.executionData || [];

  return (
    <div className="p-9">
      <section className="mb-10">
        <TopBar />
        {/* <TimeFilter failed={usageAnalytics.totalFailedExecutions} /> */}
      </section>

      <section className="flex flex-wrap items-center justify-center">
        <div className="flex flex-col w-full mt-4 md:flex-row md:w-1/2 lg:w-1/2 lg:pl-2 md:mt-0">
          <div className="w-full mt-4 md:w-1/2 lg:w-1/2 lg:pl-2 md:mt-0">
            <Rules
              totalRules={ruleAnalytics.totalRules}
              status={4}
              active={ruleAnalytics.activeRules}
              inactive={ruleAnalytics.inactiveRules}
            />
          </div>
          <div className="w-full mt-4 md:w-1/2 lg:w-1/2 lg:pl-2 md:mt-0">
            <OverAllUsage
              totalRules={usageAnalytics.totalExecutionsCount}
              status={"0"}
              successfull={usageAnalytics.totalSuccessfulExecutions}
              failed={usageAnalytics.totalFailedExecutions}
            />
          </div>
        </div>
        <div className="w-full mt-4 md:w-1/2 lg:w-1/2 lg:pl-2 md:mt-0">
          <Cost
            totalBudget={budgetAnalytics.totalBudget}
            utilization={budgetAnalytics.utilization}
            spent={budgetAnalytics.spent}
            remaining={budgetAnalytics.remaining}
          />
        </div>
      </section>

      <section className="flex flex-wrap mt-4">
        <div className="w-full mt-4 md:w-1/2 lg:w-1/2 lg:pl-2 md:mt-0">
          <UsageTrend executionData={executionData} />
        </div>
        <div className="w-full mt-4 md:w-1/2 lg:w-1/2 lg:pl-2 md:mt-0">
          <TeamUsage />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
