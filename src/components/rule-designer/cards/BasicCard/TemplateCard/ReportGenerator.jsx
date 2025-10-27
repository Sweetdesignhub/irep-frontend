import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import html2pdf from 'html2pdf.js';
import 'react-quill/dist/quill.snow.css';

const ReportGenerator = () => {
  const [template, setTemplate] = useState('');
  const reportRef = useRef();
  
  // Sample report data
  const [reportData, setReportData] = useState({
    title: "Monthly Sales Report",
    date: new Date().toLocaleDateString(),
    author: "Sales Team",
    summary: "This report shows our monthly sales performance across all regions.",
    salesData: [
      { region: "North", amount: 125000, growth: "12%" },
      { region: "South", amount: 98000, growth: "8%" },
      { region: "East", amount: 156000, growth: "15%" },
      { region: "West", amount: 110000, growth: "10%" }
    ],
    kpis: [
      { metric: "New Customers", value: 245, target: 200 },
      { metric: "Conversion Rate", value: "3.2%", target: "2.8%" },
      { metric: "Avg. Order Value", value: "$89.50", target: "$85.00" }
    ]
  });

  // Default template with placeholders
  const defaultTemplate = `
    <h1>{{title}}</h1>
    <p><strong>Generated on:</strong> {{date}}</p>
    <p><strong>Prepared by:</strong> {{author}}</p>
    
    <h2>Executive Summary</h2>
    <p>{{summary}}</p>
    
    <h2>Regional Sales Performance</h2>
    {{table:salesData}}
    
    <h2>Key Performance Indicators</h2>
    {{table:kpis}}
    
    <div style="margin-top: 40px; font-style: italic;">
      <p>This report was generated automatically on {{date}}.</p>
    </div>
  `;

  // Initialize with default template
  if (!template) setTemplate(defaultTemplate);

  // Parse template and replace placeholders with actual data
  const parseTemplate = (template, data) => {
    // Replace simple variables
    let output = template.replace(/\{\{(\w+)\}\}/g, (match, p1) => data[p1] || match);
    
    // Replace tables
    output = output.replace(/\{\{table:(\w+)\}\}/g, (match, p1) => {
      const dataset = data[p1];
      if (!Array.isArray(dataset)) return match;
      
      // Generate table HTML
      return `
        <table border="1" style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              ${Object.keys(dataset[0]).map(key => 
                `<th style="padding: 8px; text-align: left;">${key}</th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
            ${dataset.map(row => `
              <tr>
                ${Object.values(row).map(val => 
                  `<td style="padding: 8px;">${val}</td>`
                ).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    });
    
    return output;
  };

  // Generate PDF report
  const generatePDF = () => {
    // Parse the template with actual data
    const finalHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            h2 { color: #3498db; margin-top: 25px; }
            table { margin: 15px 0; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          ${parseTemplate(template, reportData)}
        </body>
      </html>
    `;
    
    // Create PDF
    const element = document.createElement('div');
    element.innerHTML = finalHtml;
    
    const opt = {
      margin: 10,
      filename: 'sales_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Report Generator</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Template Editor</h2>
        <ReactQuill
          theme="snow"
          value={template}
          onChange={setTemplate}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image'],
              ['table'],
              ['clean']
            ]
          }}
          style={{ height: '400px', marginBottom: '40px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Report Preview</h2>
        <div 
          ref={reportRef} 
          dangerouslySetInnerHTML={{ __html: parseTemplate(template, reportData) }} 
          style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            minHeight: '200px',
            backgroundColor: '#fff'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={generatePDF}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Generate PDF
        </button>
        
        <button 
          onClick={() => setTemplate(defaultTemplate)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reset Template
        </button>
      </div>
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa' }}>
        <h3>Template Guide</h3>
        <ul>
          <li>Use <code>{'{{variable}}'}</code> for simple values (e.g., <code>{'{{title}}'}</code>)</li>
          <li>Use <code>{'{{table:dataset}}'}</code> for tables (e.g., <code>{'{{table:salesData}}'}</code>)</li>
          <li>Standard HTML is supported in the template</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportGenerator;