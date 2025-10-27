import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, Select, message, Collapse } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;
const { Option } = Select;

const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const Teams = () => {
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.organization.organizations);

  const [selectedOrgId, setSelectedOrgId] = useState(null); // Organization selection
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isUpdateTeamModalOpen, setIsUpdateTeamModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [memberForm] = Form.useForm();
  const navigate = useNavigate();

  // Fetch teams based on selected organization
  useEffect(() => {
    if (!selectedOrgId) return; // Don't fetch if no org is selected

    setLoading(true);
    axios
      .get(`${host}/org/${selectedOrgId}/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTeams(response.data.data);
        setLoading(false);
        // navigate(0);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setLoading(false);
      });
  }, [selectedOrgId, token]);

  // Fetch users for adding to a team
  useEffect(() => {
    axios
      .get(`${host}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setUsers(response.data.users);
        // navigate(0);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [token]);

  // Handle organization selection
  const handleOrgChange = (orgId) => {
    setSelectedOrgId(orgId);
    setTeams([]); // Reset teams when changing organizations
  };

  // Add team member
  const handleAddTeamMember = async (values) => {
    try {
      await axios.post(`${host}/teams/${selectedTeam.id}/add-member`, values, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      message.success("Team member added successfully!");
      setIsAddMemberModalOpen(false);
      navigate(0);
      memberForm.resetFields();
      // fetchTeams(selectedOrgId); // Refresh teams list
    } catch (error) {
      console.error("Error adding team member:", error);
      message.error("Failed to add team member.");
    }
  };

  // Update team details
  const handleUpdateTeam = async (values) => {
    try {
      await axios.put(`${host}/teams/${selectedTeam.id}`, values, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      message.success("Team updated successfully!");
      setIsUpdateTeamModalOpen(false);
      form.resetFields();
      navigate(0);
      // fetchTeams(selectedOrgId);
    } catch (error) {
      console.error("Error updating team:", error);
      message.error("Failed to update team.");
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will delete the team.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`${host}/teams/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Team deleted successfully!");
          navigate(0);
          // fetchTeams(selectedOrgId);
        } catch (error) {
          console.error("Error deleting team:", error);
          message.error("Failed to delete team.");
        }
      },
    });
  };

  // Delete team member
  const handleDeleteTeamMember = async (teamId, userId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will remove the member from the team.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`${host}/teams/${teamId}/remove-member/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Team member deleted successfully!");
          // fetchTeams(selectedOrg.id); // Refresh teams list
          navigate(0);
        } catch (error) {
          console.error("Error deleting team member:", error);
          message.error(
            error.response?.data?.error || "Failed to delete team member. Please try again."
          );
        }
      },
    });
  };
  return (
    <div className="ml-48 mr-48 mt-16">
      <h3 className="text-2xl font-semibold">Teams</h3>

      {/* Organization Selection Dropdown */}
      <div className="mb-4">
        <label className="font-semibold">Select Organization:</label>
        <Select
          className="w-full mt-2"
          placeholder="Choose an organization"
          onChange={handleOrgChange}
          value={selectedOrgId}
        >
          {organizations.map((org) => (
            <Option key={org.id} value={org.id}>
              {org.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Teams List */}
      <Collapse accordion className="mt-4">
        {teams.map((team) => (
          <Panel header={team.name} key={team.id}>
            <div className="flex justify-between items-center">
              <p>{team.description}</p>
              <div className="flex space-x-2">
                <Button
                  icon={<UserAddOutlined />}
                  onClick={() => {
                    setSelectedTeam(team);
                    setIsAddMemberModalOpen(true);
                  }}
                >
                  Add Member
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedTeam(team);
                    setIsUpdateTeamModalOpen(true);
                  }}
                >
                  Update
                </Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteTeam(team.id)}>
                  Delete
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold">Members:</h4>
              {team.users.map((user) => (
                <div key={user.id} className="flex justify-between items-center">
                  <span>{user.name}</span>
                  <Button
                    danger
                    size="small"
                    onClick={() => handleDeleteTeamMember(team.id, user.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </Collapse>

      {/* Add Member Modal */}
      <Modal
        title="Add Team Member"
        open={isAddMemberModalOpen}
        onCancel={() => setIsAddMemberModalOpen(false)}
        footer={null}
      >
        <Form form={memberForm} layout="vertical" onFinish={handleAddTeamMember}>
          <Form.Item label="User Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Enter user email" />
          </Form.Item>
          <div className="text-right">
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Update Team Modal */}
      <Modal
        title="Update Team Details"
        open={isUpdateTeamModalOpen}
        onCancel={() => setIsUpdateTeamModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateTeam}>
          <Form.Item label="Team Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter team name" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          <div className="text-right">
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Teams;
