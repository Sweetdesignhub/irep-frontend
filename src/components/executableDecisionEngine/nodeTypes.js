// nodeTypes.js

import ResponseCard from "../cards/BasicCard/ResponseCard";
import RequestCard from "../cards/RequestCard/RequestCard";

// Rule Card
import CreateRuleCard from "../cards/RuleCard/CreateRule/CreateRule";
import TesseractCard from "../cards/RuleCard/TesseractNode/TesseractNode";
import CodeExpressionExecutable from "./ExecutableCards/CodeExpressionExecutable";

// Basic Card
import MemoryCard from "../cards/BasicCard/MemoryCard";
import VariableCard from "../cards/BasicCard/VariableCard";
import DecisionCard from "../cards/BasicCard/DecisionCard";
import CalculationCard from "../cards/BasicCard/CalculationCard";

// Advanced Card
import APIExecutable from "./ExecutableCards/ApiCardExecutable";
import AiCard from "../cards/AdvancedCard/AdvanceAiCard";
import ApiCard from "../cards/AdvancedCard/ApiCard";
import DocumentTemplateCard from "../cards/AdvancedCard/DocumentTemplateCard";
import ExpressionCard from "../cards/AdvancedCard/ExpressionCard";

// Database
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

// Prediction
import InputParameterCard from "../cards/Prediction/inputParameterCard";
import ModelDetailCard from "../cards/Prediction/ModelDetailCard";

// Storage
import AwsS3Card from "../cards/StorageCard/StorageCard";

export const nodeTypes = {
  "Response Card": ResponseCard,
  "Request Card": RequestCard,

  // Rule Card
  "Rule Card": CreateRuleCard,
  "Tesseract Card": TesseractCard,
  // "Code Expression Card": CodeExpressionExecutable,
  // "customNode": cus

  // Basic Card
  "Memory Card": MemoryCard,
  "Variable Card": VariableCard,
  "Decision Card": DecisionCard,
  "Calculation Card": CalculationCard,

  // Advanced Card
  "Api Card": APIExecutable,
  "Advance AI Card": AiCard,
  //   "API Card": ApiCard,
  "Document Template Card": DocumentTemplateCard,
  "Expression Card": ExpressionCard,

  // Database
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

  // Prediction
  "Input Parameter Card": InputParameterCard,
  "Model Detail Card": ModelDetailCard,

  // Storage
  "AWS S3 Card": AwsS3Card,
};
