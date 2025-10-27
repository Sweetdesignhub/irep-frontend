import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, Select, message, Collapse } from "antd";
import { BsPlus } from "react-icons/bs";
import { EditOutlined, DeleteOutlined, UserAddOutlined, TeamOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import useFetchOrganizations from "../components/hooks/useFetchOrganizations.jsx";
import axios from "axios";
import {
  setOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  setLoading,
} from "../redux/organizationSlice/organizationSlice.js";
import { useNavigate } from "react-router-dom";

const { Panel } = Collapse;

const host = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const Organizations = () => {
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.organization.organizations);
  const loading = useSelector((state) => state.organization.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isValid, setIsValid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isUpdateTeamModalOpen, setIsUpdateTeamModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [form] = Form.useForm();
  const [memberForm] = Form.useForm();
  const [teamForm] = Form.useForm();
  const [updateTeamForm] = Form.useForm();
  const [users, setUsers] = useState([]); // List of users for team creation
  const [teams, setTeams] = useState([]); // List of teams for the selected organization

  useFetchOrganizations();

  // Fetch organizations
  // useEffect(() => {

  //   if (!token) return;

  //   dispatch(setLoading(true));

  //   axios
  //     .get(`${host}/org`, { headers: { Authorization: `Bearer ${token}` } })
  //     .then((response) => {
  //       dispatch(setOrganizations(response.data.data));
  //       // navigate(0);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching organizations:", error);
  //       dispatch(setLoading(false));
  //     });
  // }, [token, dispatch]);

  // Fetch users for team creation
  useEffect(() => {
    if (isCreateTeamModalOpen || isUpdateTeamModalOpen) {
      axios
        .get(`${host}/users`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUsers(response.data.users);
          // navigate(0);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }

  }, [isCreateTeamModalOpen, isUpdateTeamModalOpen, token]);

  // Fetch teams for the selected organization
  const fetchTeams = (orgId) => {
    axios
      .get(`${host}/org/${orgId}/teams`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setTeams(response.data.data);

      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  };

  // Open modal for new org or editing
  const showModal = (org = null) => {
    setEditingOrg(org);
    form.setFieldsValue(org || { name: "", description: "" });
    setIsModalOpen(true);
  };

  // Open add team member modal
  const showAddMemberModal = (team) => {
    console.log("Team Member", team);
    setSelectedTeam(team);
    setIsAddMemberModalOpen(true);
  };

  // Open create team modal
  const showCreateTeamModal = (org) => {
    console.log("Organization is: ", org);
    setSelectedOrg(org);
    setIsCreateTeamModalOpen(true);
  };

  // Open update team modal
  const showUpdateTeamModal = (team) => {
    setEditingTeam(team);
    updateTeamForm.setFieldsValue(team);
    setIsUpdateTeamModalOpen(true);
  };

  // Create or update organization
  const handleSaveOrganization = async (values) => {
    try {
      let response;
      if (editingOrg) {
        response = await axios.put(`${host}/org/${editingOrg.id}`, values, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        dispatch(updateOrganization(response.data));
        message.success("Organization updated successfully!");
        navigate(0);
      } else {
        response = await axios.post(`${host}/org`, values, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        dispatch(addOrganization(response.data));
        message.success("Organization created successfully!");
        navigate(0);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving organization:", error);
      message.error("Failed to save organization.");
    }
  };

  // Add team member to team
  // const handleAddTeamMember = async (values) => {
  //   try {
  //     await axios.post(`${host}/teams/${selectedTeam.id}/add-member`, values, {
  //       headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  //     });
  //     message.success("Team member added successfully!");
  //     setIsAddMemberModalOpen(false);
  //     memberForm.resetFields();
  //     fetchTeams(selectedOrg.id); // Refresh teams list
  //   } catch (error) {
  //     console.error("Error adding team member:", error);
  //     message.error("Failed to add team member.");
  //   }
  // };
  const handleAddTeamMember = async (values) => {
    const { email } = values; // Extract email from the form values

    try {
      // Send a POST request to add the team member
      const response = await axios.post(
        `${host}/teams/${selectedTeam.id}/add-member`,
        { email }, // Send the email in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success
      message.success("Team member added successfully!");
      setIsAddMemberModalOpen(false); // Close the modal
      navigate(0);
      memberForm.resetFields(); // Reset the form fields
      console.log("Selected Org: ", selectedOrg.id);
      // fetchTeams(selectedOrg.id); // Refresh the teams list
    } catch (error) {
      // Handle error
      console.error("Error adding team member:", error);
      message.error(
        error.response?.data?.error || "Failed to add team member. Please try again."
      );
    }
  };
  // Create a new team
  const handleCreateTeam = async (values) => {
    try {
      const { name, description, ownerId, userIds } = values;
      const organizationId = selectedOrg.id;

      await axios.post(
        `${host}/teams/create`,
        { name, description, organizationId, ownerId, userIds },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      message.success("Team created successfully!");
      setIsCreateTeamModalOpen(false);
      teamForm.resetFields();
      // fetchTeams(selectedOrg.id); // Refresh teams list
      navigate(0);
    } catch (error) {
      console.error("Error creating team:", error);
      message.error("Failed to create team.");
    }
  };

  // Update team details
  const handleUpdateTeam = async (values) => {
    try {
      await axios.put(`${host}/teams/${editingTeam.id}`, values, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      message.success("Team updated successfully!");
      setIsUpdateTeamModalOpen(false);
      updateTeamForm.resetFields();
      // fetchTeams(selectedOrg.id); // Refresh teams list
      navigate(0);
    } catch (error) {
      console.error("Error updating team:", error);
      message.error("Failed to update team.");
    }
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
          navigate(0);
          console.log("Selected Org: ", selectedOrg.id);
          // fetchTeams(selectedOrg.id); // Refresh teams list
        } catch (error) {
          console.error("Error deleting team member:", error);
          message.error(
            error.response?.data?.error || "Failed to delete team member. Please try again."
          );
        }
      },
    });
  };

  // Delete organization (soft delete)
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This will remove the organization.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`${host}/org/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(deleteOrganization(id));
          message.success("Organization deleted successfully!");
        } catch (error) {
          console.error("Error deleting organization:", error);
          message.error("Failed to delete organization.");
        }
      },
    });
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
          // fetchTeams(selectedOrg.id); // Refresh teams list
        } catch (error) {
          console.error("Error deleting team:", error);
          message.error("Failed to delete team.");
        }
      },
    });
  };

  const columns = [
    {
      title: "Organization Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <button className="py-1 text-blue-600 rounded-lg" onClick={() => showModal(record)}>
          {text}
        </button>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
          <Button icon={<PlusOutlined />} type="dashed" size="medium" onClick={() => showCreateTeamModal(record)}>
            Create Team
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-row justify-center h-full px-16 py-5">
      <div className="w-full">
        <div className="text-right">
          <Button
            className="bg-[#EB1700] rounded-xl hover:opacity-90 text-white w-48 py-1 text-sm inline-flex justify-around items-center mr-6"
            onClick={() => showModal()}
          >
            <span>New Organization</span>
            <BsPlus size={30} className="h-6" />
          </Button>
        </div>

        <div className="px-4 py-4 m-2 mt-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
          <h3 className="text-3xl font-semibold">Organizations</h3>
          <div className="mt-8">
            <Table
              columns={columns}
              dataSource={organizations}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowRender: (record) => (
                  <Collapse
                    accordion
                    onChange={() => fetchTeams(record.id)}
                    className="bg-gray-100"
                  >
                    <Panel header="Teams" key="teams">
                      {teams.map((team) => (
                        <div key={team.id} className="mb-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">{team.name}</h4>
                            <div className="flex space-x-2">
                              <Button
                                icon={<UserAddOutlined />}
                                onClick={() => showAddMemberModal(team)}
                              >
                                Add Member
                              </Button>
                              <Button
                                icon={<EditOutlined />}
                                onClick={() => showUpdateTeamModal(team)}
                              >
                                Update
                              </Button>
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => handleDeleteTeam(team.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h5 className="font-medium">Members:</h5>
                            {team.users.map((user) => (
                              <div key={user.id} className="m-2 flex justify-between items-center">
                                <span>{user.name + " || " + user.email}</span>
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
                        </div>
                      ))}
                    </Panel>
                  </Collapse>
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal for Creating & Editing Organizations */}
      <Modal
        title={editingOrg ? "Edit Organization" : "Create New Organization"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveOrganization}>
          <Form.Item label="Organization Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter organization name" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          <div className="text-right">
            <Button type="primary" htmlType="submit">
              {editingOrg ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal for Adding Team Member */}
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

      {/* Modal for Creating a Team */}
      <Modal
        title="Create New Team"
        open={isCreateTeamModalOpen}
        onCancel={() => setIsCreateTeamModalOpen(false)}
        footer={null}
      >
        <Form form={teamForm} layout="vertical" onFinish={handleCreateTeam}>
          <Form.Item label="Team Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter team name" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          <Form.Item label="Owner" name="ownerId" rules={[{ required: true }]}>
            <Select placeholder="Select owner">
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Team Members" name="userIds" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Select team members">
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="text-right">
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal for Updating Team Details */}
      <Modal
        title="Update Team Details"
        open={isUpdateTeamModalOpen}
        onCancel={() => setIsUpdateTeamModalOpen(false)}
        footer={null}
      >
        <Form form={updateTeamForm} layout="vertical" onFinish={handleUpdateTeam}>
          <Form.Item label="Team Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter team name" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          <Form.Item label="Owner" name="ownerId" rules={[{ required: true }]}>
            <Select placeholder="Select owner">
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
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

export default Organizations;