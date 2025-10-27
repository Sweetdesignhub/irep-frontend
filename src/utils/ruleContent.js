// Function to extract the flow JSON from the JavaScript content
export const extractFlowJSON = (content) => {
    try {
        const cleanedContent = content.trim();
        const match = cleanedContent.match(/export const flow = ({.*?});/s);

        if (match && match[1]) {
            const jsonString = match[1];
            return JSON.parse(jsonString); // Return parsed JSON object
        } else {
            throw new Error("Flow JSON object not found.");
        }
    } catch (err) {
        console.error("Error parsing flow content:", err);
        return null;
    }
};
