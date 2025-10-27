export class WorkflowEngine {
  constructor(initialFlow) {
    this.flowData = initialFlow;
    this.responses = new Map();
    this.nodeMap = new Map();
    this.currentPath = [];
    this.multiSelectResponses = new Map();
    // New property to store database query details globally
    this.databaseDetails = null;
    this.semanticAnalysisDetails = null;
    this.basicCalculationDetails = null;
    this.basicReportCardDetails = null;
    this.notificationCardDetails = null;
    this.templateConfig = null;
  }

  initialize() {
    try {
      return this.createNodeStructure(this.flowData);
    } catch (error) {
      console.error("Failed to initialize workflow:", error);
      throw new Error("Workflow initialization failed");
    }
  }

  createNodeStructure(node, depth = 0) {
    if (!node || !node.type) {
      // Handle output nodes specially
      // if (node.id && node.type === "ROOT") {
      //   node = node.options[0];
      //   createNodeStructure(node.options[0], (depth = 0));
      // }
      if (node.id && node.id.endsWith("-output")) {
        const position = { x: 0, y: 800 * depth };
        const nodeStructure = {
          id: node.id,
          type: "OUTPUT_NODE",
          position,
          data: node.data || {
            question: "Output node is reached",
            notificationCardDetails: this.notificationCardDetails,
            basicReportCardDetails: this.basicReportCardDetails,
            basicCalculationDetails: this.basicCalculationDetails,
          },
        };
        this.nodeMap.set(node.id, nodeStructure);
        return nodeStructure;
      }
      throw new Error("Invalid node structure");
    }
    const position = { x: 0, y: 800 * depth };
    const nodeStructure = {
      id: node.id,
      type: node.type,
      position,
      data: {
        ...node.data,
        question: node.question,
        options: node.options,
        eventDropDownValue: node.data?.eventDropDownValue,
        fileTypes: node.data?.fileTypes,
        multiSelect: node.data?.multiSelect,
      },
    };

    console.log("++Node is", nodeStructure);
    this.nodeMap.set(node.id, nodeStructure);
    return nodeStructure;
  }

  processResponse(nodeId, response, isChecked = null) {
    try {
      console.log("res: ", response);
      console.log("Start", { nodeId, response, isChecked });
      const currentNode = this.nodeMap.get(nodeId);
      if (!currentNode) {
        throw new Error(`Node not found: ${nodeId}`);
      }
      console.log("Found Current Node is: ", currentNode);
      // Special handling for Basic Template Card node type
      if (currentNode.type === "Basic Template Card") {
        // Save template configuration globally
        const templateConfig = {
          templateName: response.templateName,
          templateContent: response.templateContent,
          templateVariables: response.templateVariables,
          // You can add more template-related properties here if needed
          timestamp: new Date().toISOString(),
        };

        // data.onAnswer(templateConfig);
        this.templateConfig = templateConfig;
        console.log("Template configuration saved:", this.templateConfig);

        // Store the response in responses
        this.responses.set(currentNode.data.question, response);

        // Check if options exist
        if (currentNode.data.options && currentNode.data.options.length > 0) {
          const nextOption = currentNode.data.options[0]; // Take the first option
          if (nextOption?.next) {
            // Check if node already exists
            let nextNode = this.nodeMap.get(nextOption.next.id);
            if (!nextNode) {
              nextNode = this.createNodeStructure(
                nextOption.next,
                this.currentPath.length + 1
              );
            }

            // Pass template configuration as data to the next node
            nextNode.data = {
              ...nextNode.data,
              templateConfig: this.templateConfig,
              // Carry over other details that might be needed
              notificationCardDetails: this.notificationCardDetails,
              basicReportCardDetails: this.basicReportCardDetails,
              basicCalculationDetails: this.basicCalculationDetails,
            };

            // Prepare return values
            const nextNodes = [nextNode];
            const edges = [this.createEdge(nodeId, nextNode.id)];

            this.currentPath.push(nodeId);
            return { nodes: nextNodes, edges };
          }
        }
        // If no options exist, create an output node
        else {
          const outputNode = {
            id: `${nodeId}-output`,
            type: "OUTPUT_NODE",
            position: {
              x: currentNode.position.x,
              y: currentNode.position.y + 250,
            },
            data: {
              question: "Output node is reached",
              templateConfig: this.templateConfig,
              // Carry over other details
              notificationCardDetails: this.notificationCardDetails,
              basicReportCardDetails: this.basicReportCardDetails,
              basicCalculationDetails: this.basicCalculationDetails,
            },
          };

          // Add the output node to nodeMap
          this.nodeMap.set(outputNode.id, outputNode);

          // Prepare return values
          const nextNodes = [outputNode];
          const edges = [this.createEdge(nodeId, outputNode.id)];

          this.currentPath.push(nodeId);
          return { nodes: nextNodes, edges };
        }
      }
      // Special handling for Notification Card node type
      if (currentNode.type === "Notification Card") {
        // Save notification card details globally
        this.notificationCardDetails = response.data;
        console.log(
          "Notification card details saved:",
          this.notificationCardDetails
        );

        // Store the response in responses
        this.responses.set(currentNode.data.question, response);

        // Check if options exist
        if (currentNode.data.options && currentNode.data.options.length > 0) {
          const nextOption = currentNode.data.options[0]; // Take the first option
          if (nextOption?.next) {
            // Check if node already exists
            let nextNode = this.nodeMap.get(nextOption.next.id);
            if (!nextNode) {
              nextNode = this.createNodeStructure(
                nextOption.next,
                this.currentPath.length + 1
              );
            }

            // Pass notification card details as data to the next node
            nextNode.data = {
              ...nextNode.data,
              notificationCardDetails: this.notificationCardDetails,
              basicReportCardDetails: this.basicReportCardDetails,
              basicCalculationDetails: this.basicCalculationDetails,
            };

            // Prepare return values
            const nextNodes = [nextNode];
            const edges = [this.createEdge(nodeId, nextNode.id)];

            this.currentPath.push(nodeId);
            return { nodes: nextNodes, edges };
          }
        }
        // If no options exist, create an output node
        else {
          const outputNode = {
            id: `${nodeId}-output`,
            type: "OUTPUT_NODE",
            position: {
              x: currentNode.position.x,
              y: currentNode.position.y + 250,
            },
            data: {
              question: "Output node is reached",
              notificationCardDetails: this.notificationCardDetails,
              basicReportCardDetails: this.basicReportCardDetails,
              basicCalculationDetails: this.basicCalculationDetails,
            },
          };

          // Add the output node to nodeMap
          this.nodeMap.set(outputNode.id, outputNode);

          // Prepare return values
          const nextNodes = [outputNode];
          const edges = [this.createEdge(nodeId, outputNode.id)];

          this.currentPath.push(nodeId);
          return { nodes: nextNodes, edges };
        }
      }

      // Special handling for Basic Report Card node type
      if (currentNode.type === "Basic Report Card") {
        // Save basic report card details globally
        this.basicReportCardDetails = response;
        console.log(
          "Basic report card details saved:",
          this.basicReportCardDetails
        );

        // Store the response in responses
        this.responses.set(currentNode.data.question, response);

        // Directly proceed to the next node if available in options
        if (currentNode.data.options) {
          const nextOption = currentNode.data.options[0]; // Take the first option
          if (nextOption?.next) {
            // Check if node already exists
            let nextNode = this.nodeMap.get(nextOption.next.id);
            if (!nextNode) {
              nextNode = this.createNodeStructure(
                nextOption.next,
                this.currentPath.length + 1
              );
            }

            // Pass basic report card details as data to the next node
            // Also include previously saved basic calculation details
            nextNode.data = {
              ...nextNode.data,
              basicReportCardDetails: this.basicReportCardDetails,
              basicCalculationDetails: this.basicCalculationDetails, // Carried over from previous node
            };

            // Prepare return values
            const nextNodes = [nextNode];
            const edges = [this.createEdge(nodeId, nextNode.id)];

            this.currentPath.push(nodeId);
            return { nodes: nextNodes, edges };
          }
        }
      }

      // Special handling for Basic Calculation Card node type
      if (currentNode.type === "Basic Calculation Card") {
        // Save basic calculation details globally

        this.basicCalculationDetails = response;
        console.log("Basic calculation details saved:", response);

        // Store the response in responses
        this.responses.set(currentNode.data.question, response);

        // Directly proceed to the next node if available in options
        if (currentNode.data.options) {
          const nextOption = currentNode.data.options[0]; // Take the first option
          if (nextOption?.next) {
            // Check if node already exists
            let nextNode = this.nodeMap.get(nextOption.next.id);
            if (!nextNode) {
              nextNode = this.createNodeStructure(
                nextOption.next,
                this.currentPath.length + 1
              );
            }

            // Pass basic calculation details as data to the next node
            nextNode.data = {
              ...nextNode.data,
              basicCalculationDetails: this.basicCalculationDetails,
            };

            // Prepare return values
            const nextNodes = [nextNode];
            const edges = [this.createEdge(nodeId, nextNode.id)];

            this.currentPath.push(nodeId);
            return { nodes: nextNodes, edges };
          }
        }
      }
      // Special handling for semantic analysis node type
      if (currentNode.type === "semantic-analysis") {
        // Save semantic analysis details globally

        this.semanticAnalysisDetails = response;
        console.log(
          "Semantic analysis details saved:",
          response
          // this.semanticAnalysisDetails
        );

        // Store the response in responses
        this.responses.set(currentNode.data.question, response);

        // Directly proceed to the next node if available in options
        if (currentNode.data.options) {
          const nextOption = currentNode.data.options[0]; // Take the first option
          if (nextOption?.next) {
            // Check if node already exists
            let nextNode = this.nodeMap.get(nextOption.next.id);
            if (!nextNode) {
              nextNode = this.createNodeStructure(
                nextOption.next,
                this.currentPath.length + 1
              );
            }

            // Pass semantic analysis details as data to the next node
            nextNode.data = {
              ...nextNode.data,
              semanticAnalysisDetails: this.semanticAnalysisDetails,
            };

            // Prepare return values
            const nextNodes = [nextNode];
            const edges = [this.createEdge(nodeId, nextNode.id)];

            this.currentPath.push(nodeId);
            return { nodes: nextNodes, edges };
          }
        }
      }

      // Special handling for database query node type
      if (currentNode.type === "database-query") {
        // Save database details globally
        this.databaseDetails = response.data;
        console.log("Database details saved globally:", this.databaseDetails);

        // Directly proceed to the next node if available in options
        if (currentNode.data.options) {
          const nextOption = currentNode.data.options[0]; // Take the first option
          if (nextOption?.next) {
            // Check if node already exists
            let nextNode = this.nodeMap.get(nextOption.next.id);
            if (!nextNode) {
              nextNode = this.createNodeStructure(
                nextOption.next,
                this.currentPath.length + 1
              );
            }

            // Store the current response
            this.responses.set(currentNode.data.question, response);

            // IMPORTANT: Pass database details as data to the next node
            nextNode.data = {
              ...nextNode.data,
              databaseDetails: this.databaseDetails,
            };

            // Prepare return values
            const nextNodes = [nextNode];
            const edges = [this.createEdge(nodeId, nextNode.id)];

            this.currentPath.push(nodeId);
            return { nodes: nextNodes, edges };
          }
        }
      }

      // Store response
      if (currentNode.type === "UPLOAD_FILE") {
        this.responses.set(currentNode.data.queryDetails, response);
      } else {
        this.responses.set(currentNode.data.question, response);
      }

      const nextNodes = [];
      const edges = [];

      // Existing special node type handling
      if (currentNode.type === "GENERATE_FLOW") {
        console.log("Inside GENERATE_FLOW Node", currentNode.generateDetails);
        const { nodes: summaryNodes, edges: summaryEdges } =
          this.generateSummaryNodes(nodeId);
        nextNodes.push(...summaryNodes);
        edges.push(...summaryEdges);
      }
      // Event Node handling
      else if (currentNode.type === "EVENT_NODE") {
        if (
          currentNode.data?.options.some((opt) => opt.label === "generate flow")
        ) {
          const generateFlowNode = {
            id: `${nodeId}-generate-flow`,
            type: "GENERATE_FLOW",
            position: { x: 500, y: 250 * (this.currentPath.length + 1) },
            data: {
              question: "Generate Flow",
              data: {},
              generateDetails: this.responses,
            },
          };
          this.nodeMap.set(generateFlowNode.id, generateFlowNode);
          nextNodes.push(generateFlowNode);
          edges.push(this.createEdge(nodeId, generateFlowNode.id));
        }
      }
      // Multi-select handling
      else if (isChecked !== null) {
        const currentSelections = this.multiSelectResponses.get(nodeId) || [];
        const updatedSelections = isChecked
          ? [...currentSelections, response]
          : currentSelections.filter((item) => item !== response);

        this.multiSelectResponses.set(nodeId, updatedSelections);

        if (
          currentNode.data.requiredSelections &&
          updatedSelections.length >= currentNode.data.requiredSelections
        ) {
          const nextNode = this.getNextNodeFromSelections(
            currentNode,
            updatedSelections
          );
          if (nextNode) {
            nextNodes.push(nextNode);
            edges.push(this.createEdge(nodeId, nextNode.id));
          }
        }
      }
      // File upload handling
      else if (currentNode.type === "UPLOAD_FILE") {
        const nextNode = this.getNextNodeFromFileResponse(
          currentNode,
          response
        );
        if (nextNode) {
          nextNodes.push(nextNode);
          edges.push(this.createEdge(nodeId, nextNode.id));
        }
      }
      // New nested flow handling
      else if (currentNode.data.options && currentNode.type !== "OUTPUT_NODE") {
        const selectedOption = currentNode.data.options.find(
          (opt) => opt.label === response
        );
        if (selectedOption?.next) {
          // Check if the next node already exists in nodeMap
          let nextNode = this.nodeMap.get(selectedOption.next.id);

          // If node doesn't exist, create a new node structure
          if (!nextNode) {
            nextNode = this.createNodeStructure(
              selectedOption.next,
              this.currentPath.length + 1
            );
          }

          nextNodes.push(nextNode);
          edges.push(this.createEdge(nodeId, nextNode.id));
        }
      }

      this.currentPath.push(nodeId);
      return { nodes: nextNodes, edges };
    } catch (error) {
      console.error("Error processing response:", error);
      throw error;
    }
  }

  // Existing methods remain the same
  getNextNodeFromSelections(currentNode, selections) {
    if (currentNode.data.options) {
      const matchingOption = currentNode.data.options.find((opt) =>
        selections.includes(opt.label)
      );
      if (matchingOption?.next) {
        // Check if node already exists
        let nextNode = this.nodeMap.get(matchingOption.next.id);
        if (!nextNode) {
          nextNode = this.createNodeStructure(
            matchingOption.next,
            this.currentPath.length + 1
          );
        }
        return nextNode;
      }
    }
    return null;
  }

  getNextNodeFromFileResponse(currentNode, response) {
    console.log("Options are: ", currentNode.data.options);
    if (currentNode.data.options) {
      const matchingOption = currentNode.data.options.find(
        (opt) => opt.label === response
      );

      if (matchingOption?.next) {
        // Check if node already exists
        let nextNode = this.nodeMap.get(matchingOption.next.id);
        if (!nextNode) {
          nextNode = this.createNodeStructure(
            matchingOption.next,
            this.currentPath.length + 1
          );
        }
        return nextNode;
      }
    }
    return null;
  }

  createEdge(sourceId, targetId) {
    return {
      id: `e${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: "custom",
    };
  }

  // Other methods remain the same as in the original implementation
  generateSummaryNodes(sourceNodeId) {
    try {
      const summaryNodes = [];
      const summaryEdges = [];
      const baseY = 250 * (this.currentPath.length + 1);

      const testFlowNode = {
        id: `${sourceNodeId}-test-flow`,
        type: "TEST_FLOW",
        position: { x: 1000, y: baseY },
        data: {
          question: "Test the flow with data or files:",
          data: {},
        },
      };

      const nextStepsNode = {
        id: `${sourceNodeId}-next-steps`,
        type: "NEXT_STEPS",
        position: { x: 1000, y: baseY + 200 },
        data: {
          steps: [
            "Download a Compliance Report.",
            "Notify stakeholders directly.",
            "Align inventory and production schedules.",
          ],
        },
      };

      const decisions = [...this.responses.entries()].map(
        ([nodeId, answer]) => {
          const node = this.nodeMap.get(nodeId);
          return {
            question: node?.data?.question || nodeId,
            answer: Array.isArray(answer) ? answer.join(", ") : answer,
          };
        }
      );

      const decisionSummaryNode = {
        id: `${sourceNodeId}-decision-summary`,
        type: "DECISION_SUMMARY",
        position: { x: 1000, y: baseY + 400 },
        data: { decisions },
      };

      summaryNodes.push(testFlowNode, nextStepsNode, decisionSummaryNode);
      summaryEdges.push(
        this.createEdge(sourceNodeId, testFlowNode.id),
        this.createEdge(testFlowNode.id, nextStepsNode.id),
        this.createEdge(nextStepsNode.id, decisionSummaryNode.id)
      );

      return { nodes: summaryNodes, edges: summaryEdges };
    } catch (error) {
      console.error("Error generating summary nodes:", error);
      throw error;
    }
  }
}

// OLD IMPLEMENTATION WORKS FOR GTIN EVALUATION

// export class WorkflowEngine {
//     constructor(initialFlow) {
//         this.flowData = initialFlow;
//         this.responses = new Map();
//         this.nodeMap = new Map();
//         this.currentPath = [];
//         this.multiSelectResponses = new Map();
//     }

//     initialize() {
//         try {
//             return this.createNodeStructure(this.flowData);
//         } catch (error) {
//             console.error("Failed to initialize workflow:", error);
//             throw new Error("Workflow initialization failed");
//         }
//     }

//     createNodeStructure(node, depth = 0) {
//         if (!node || !node.type) {
//             throw new Error("Invalid node structure");
//         }
//         const position = { x: 0, y: 250 * depth };
//         const nodeStructure = {
//             id: node.id,
//             type: node.type,
//             position,
//             data: {
//                 ...node.data,
//                 question: node.question,
//                 options: node.options,
//                 eventDropDownValue: node.data?.eventDropDownValue,
//                 fileTypes: node.data?.fileTypes,
//                 multiSelect: node.data?.multiSelect
//             }
//         };

//         console.log("+++++++++++++++++++Node is", nodeStructure);
//         this.nodeMap.set(node.id, nodeStructure);
//         return nodeStructure;
//     }

//     processResponse(nodeId, response, isChecked = null) {
//         try {
//             console.log("Start", { nodeId, response, isChecked });
//             const currentNode = this.nodeMap.get(nodeId);
//             if (!currentNode) {
//                 throw new Error(`Node not found: ${nodeId}`);
//             }
//             console.log("Found Current Node is: ", currentNode);
//             if (currentNode.type === "UPLOAD_FILE") this.responses.set(currentNode.data.queryDetails, response);
//             else this.responses.set(currentNode.data.question, response);
//             // this.responses.set(nodeId, response);
//             const nextNodes = [];
//             const edges = [];

//             // Handle Generate Flow
//             if (currentNode.type === "GENERATE_FLOW") {
//                 console.log("Inside GENERATE_FLOW Node", currentNode.generateDetails);
//                 console.log("Responses are: ", this.responses);
//                 // Generate summary nodes using the current node's ID
//                 const { nodes: summaryNodes, edges: summaryEdges } = this.generateSummaryNodes(nodeId);
//                 nextNodes.push(...summaryNodes);
//                 edges.push(...summaryEdges);
//             }
//             // Handle Event Node
//             else if (currentNode.type === "EVENT_NODE") {
//                 console.log("Inside Event Node", currentNode);

//                 if (currentNode.data?.options.some((opt) => opt.label === 'generate flow')) {
//                     console.log("there is generate flow");

//                     const generateFlowNode = {
//                         id: `${nodeId}-generate-flow`,
//                         type: "GENERATE_FLOW",
//                         position: { x: 500, y: 250 * (this.currentPath.length + 1) },
//                         data: {
//                             question: "Generate Flow",
//                             data: {},
//                             generateDetails: this.responses,
//                         },

//                     };
//                     console.log("Created Generate Flow is: ", generateFlowNode);
//                     // Store the node in nodeMap
//                     this.nodeMap.set(generateFlowNode.id, generateFlowNode);

//                     nextNodes.push(generateFlowNode);
//                     edges.push(this.createEdge(nodeId, generateFlowNode.id));
//                 }
//             }
//             // Handle multi-select responses
//             else if (isChecked !== null) {
//                 const currentSelections = this.multiSelectResponses.get(nodeId) || [];
//                 const updatedSelections = isChecked
//                     ? [...currentSelections, response]
//                     : currentSelections.filter(item => item !== response);

//                 this.multiSelectResponses.set(nodeId, updatedSelections);

//                 // Process next node if all required selections are made
//                 if (currentNode.data.requiredSelections &&
//                     updatedSelections.length >= currentNode.data.requiredSelections) {
//                     const nextNode = this.getNextNodeFromSelections(currentNode, updatedSelections);
//                     if (nextNode) {
//                         nextNodes.push(nextNode);
//                         edges.push(this.createEdge(nodeId, nextNode.id));
//                     }
//                 }
//             }
//             // Handle file upload responses
//             else if (currentNode.type === "UPLOAD_FILE") {
//                 const nextNode = this.getNextNodeFromFileResponse(currentNode, response);
//                 console.log("Next Node is :", nextNode);
//                 if (nextNode) {
//                     nextNodes.push(nextNode);
//                     edges.push(this.createEdge(nodeId, nextNode.id));
//                 }
//             }
//             // Handle regular flow
//             else if (currentNode.data.options && currentNode.type !== "OUTPUT_NODE") {
//                 console.log("HEREEeeeeeee", currentNode);
//                 const selectedOption = currentNode.data.options.find(opt => opt.label === response);
//                 if (selectedOption?.next) {
//                     const nextNode = this.createNodeStructure(selectedOption.next, this.currentPath.length + 1);
//                     nextNodes.push(nextNode);
//                     edges.push(this.createEdge(nodeId, nextNode.id));
//                 }
//             }

//             this.currentPath.push(nodeId);
//             return { nodes: nextNodes, edges };
//         } catch (error) {
//             console.error("Error processing response:", error);
//             throw error;
//         }
//     }

//     getNextNodeFromSelections(currentNode, selections) {
//         // Implementation depends on your multi-select logic
//         if (currentNode.data.options) {
//             const matchingOption = currentNode.data.options.find(opt =>
//                 selections.includes(opt.label));
//             if (matchingOption?.next) {
//                 return this.createNodeStructure(matchingOption.next, this.currentPath.length + 1);
//             }
//         }
//         return null;
//     }

//     getNextNodeFromFileResponse(currentNode, response) {
//         // Implementation depends on your file upload logic
//         console.log("Options are: ", currentNode.data.options);
//         if (currentNode.data.options) {
//             const matchingOption = currentNode.data.options.find(opt =>
//                 opt.label === response);

//             if (matchingOption?.next) {
//                 return this.createNodeStructure(matchingOption.next, this.currentPath.length + 1);
//             }
//         }
//         return null;
//     }

//     createEdge(sourceId, targetId) {
//         return {
//             id: `e${sourceId}-${targetId}`,
//             source: sourceId,
//             target: targetId,
//             type: "custom"
//         };
//     }

//     generateSummaryNodes(sourceNodeId) {
//         try {
//             const summaryNodes = [];
//             const summaryEdges = [];
//             const baseY = 250 * (this.currentPath.length + 1);

//             const testFlowNode = {
//                 id: `${sourceNodeId}-test-flow`,
//                 type: "TEST_FLOW",
//                 position: { x: 1000, y: baseY },
//                 data: {
//                     question: "Test the flow with data or files:",
//                     data: {}
//                 }
//             };

//             const nextStepsNode = {
//                 id: `${sourceNodeId}-next-steps`,
//                 type: "NEXT_STEPS",
//                 position: { x: 1000, y: baseY + 200 },
//                 data: {
//                     steps: [
//                         'Download a Compliance Report.',
//                         'Notify stakeholders directly.',
//                         'Align inventory and production schedules.'
//                     ]
//                 }
//             };

//             const decisions = [...this.responses.entries()].map(([nodeId, answer]) => {
//                 const node = this.nodeMap.get(nodeId);
//                 return {
//                     question: node?.data?.question || nodeId,
//                     answer: Array.isArray(answer) ? answer.join(', ') : answer
//                 };
//             });

//             const decisionSummaryNode = {
//                 id: `${sourceNodeId}-decision-summary`,
//                 type: "DECISION_SUMMARY",
//                 position: { x: 1000, y: baseY + 400 },
//                 data: { decisions }
//             };

//             summaryNodes.push(testFlowNode, nextStepsNode, decisionSummaryNode);
//             summaryEdges.push(
//                 this.createEdge(sourceNodeId, testFlowNode.id),
//                 this.createEdge(testFlowNode.id, nextStepsNode.id),
//                 this.createEdge(nextStepsNode.id, decisionSummaryNode.id)
//             );

//             return { nodes: summaryNodes, edges: summaryEdges };
//         } catch (error) {
//             console.error("Error generating summary nodes:", error);
//             throw error;
//         }
//     }
// }
