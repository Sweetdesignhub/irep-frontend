// nodeTypes.js

import ResponseCard from "../cards/BasicCard/ResponseCard";
import RequestCard from "../cards/RequestCard/RequestCard";

// Rule Card
import CreateRuleCard from "../cards/RuleCard/CreateRule/CreateRule";
import TextractCard from "../cards/RuleCard/TextractNode/TextractNode";
import CodeExpressionCard from "../cards/RuleCard/CodeExpressionCard/CodeExpressionCard";
import GenerateFlowCard from "../cards/RuleCard/GenerateFlowCard/GenerateFlowCard";
import MultiSelect from "../cards/RuleCard/MultiSelect/MultiSelect";

// Basic Card
import ReportCard from "../cards/BasicCard/ReportCard";
import MemoryCard from "../cards/BasicCard/MemoryCard";
import VariableCard from "../cards/BasicCard/VariableCard";
import CalculationCard from "../cards/BasicCard/CalculationCard";
import DecisionCard from "../cards/BasicCard/DecisionCard/DecisionCard";

// Advanced Card
import AiCard from "../cards/AdvancedCard/AdvanceAiCard";
import ApiCard from "../cards/AdvancedCard/ApiCard";
import DocumentTemplateCard from "../cards/AdvancedCard/DocumentTemplateCard";
import ExpressionCard from "../cards/AdvancedCard/ExpressionCard";

// Database
import MainDataAccessCard from "../cards/DatabaseCard/MainDataAccessCard";
import SourceCard from "../cards/DatabaseCard/SourceCard";
import RetrieveDataCard from "../cards/DatabaseCard/RetrieveDataCard";
import JoinDataCard from "../cards/DatabaseCard/JoinDataCard";
import UpdateDataCard from "../cards/DatabaseCard/UpdateDataCard";
import QueryDataCard from "../cards/DatabaseCard/QueryDataCard";
import InsertDataCard from "../cards/DatabaseCard/InsertDataCard";
import TransformDataCard from "../cards/DatabaseCard/TransformDataCard";
import DeleteDataCard from "../cards/DatabaseCard/TruncateDataCard";

// Model Training
import DatasetCard from "../cards/ModelTraining/DatasetCard";
import PreProcessingCard from "../cards/ModelTraining/PreProcessingCard";
import AlgorithmCard from "../cards/ModelTraining/AlgorithmCard";
import AICard from "../cards/ModelTraining/AICard";
import NLPCard from "../cards/ModelTraining/NLPCard";

// Prediction
import InputParameterCard from "../cards/Prediction/inputParameterCard";
import ModelDetailCard from "../cards/Prediction/ModelDetailCard";

// Storage
import AwsS3Card from "../cards/StorageCard/StorageCard";
import NotificationsCard from "../cards/AdvancedCard/NotificationCard/NotificationsCard";
import TemplateCard from "../cards/BasicCard/TemplateCard/TemplateCard";

export const nodeTypes = {
  "Response Card": ResponseCard,
  "Request Card": RequestCard,

  // Rule Card
  "Rule Card": CreateRuleCard,
  "Textract Card": TextractCard,
  "Code Expression Card": CodeExpressionCard,
  "Generate Flow Card": GenerateFlowCard,
  "Multi Select Card": MultiSelect,

  // Basic Card
  "Memory Card": MemoryCard,
  "Variable Card": VariableCard,
  "Decision Card": DecisionCard,
  "Calculation Card": CalculationCard,
  "Report Card": ReportCard,
  "Template Card": TemplateCard,

  // Advanced Card
  "Advance AI Card": AiCard,
  "API Card": ApiCard,
  "Notification Card": NotificationsCard,
  "Document Template Card": DocumentTemplateCard,
  "Expression Card": ExpressionCard,

  // Database
  "Data Access Card": MainDataAccessCard,
  "Source Card": SourceCard,
  "Retrieve Card": RetrieveDataCard,
  "Join Card": JoinDataCard,
  "Update Data Card": UpdateDataCard,
  "Query Data Card": QueryDataCard,
  "Insert Data Card": InsertDataCard,
  "Transform Data Card": TransformDataCard,
  "Delete Data Card": DeleteDataCard,

  // Model Training
  "Dataset Card": DatasetCard,
  "Pre-Processing Card": PreProcessingCard,
  "Algorithm Card": AlgorithmCard,
  "AI Card": AICard,
  "NLP Card": NLPCard,

  // Prediction
  "Input Parameter Card": InputParameterCard,
  "Model Detail Card": ModelDetailCard,

  // Storage
  "AWS S3 Card": AwsS3Card,
};
