
import { Button, Modal } from "antd";
import React from "react";

const SaveRuleVersion = ({
  saveRule,
  saveRuleVersion,
  isSaveModalVisible,
  setIsSaveModalVisible,
}) => {
  const handleSaveRule = () => {
    saveRule();
    setIsSaveModalVisible(false);
  };
  const handleSaveRuleVersion = () => {
    saveRuleVersion();
    setIsSaveModalVisible(false);
  };
  return (
    <Modal
      title="Save Options"
      open={isSaveModalVisible}
      onCancel={() => setIsSaveModalVisible(false)}
      footer={[
        <Button key="save" onClick={handleSaveRule}>
          Save Rule
        </Button>,
        <Button key="saveAsVersion" onClick={handleSaveRuleVersion}>
          Save as Version
        </Button>,
      ]}
    >
      <p>Do you want to save changes to this rule or save as a new version?</p>
    </Modal>
  );
};

export default SaveRuleVersion;
