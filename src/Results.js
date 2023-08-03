// results
import 'antd/dist/antd.js'; 
import './Results.css'; 
import React from 'react';
import { Table } from 'antd';
import teams from './styles.js'; 
import jsonData from './final_scores.json'; // Import the JSON data

// Additional import statements as per your project's requirements

const Results = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const formattedData = Object.entries(jsonData).map(([name, item], index) => ({
      ...item,
      key: index,
      Name: name,
    }));

    const sortedData = formattedData.sort((a, b) => b.Score - a.Score); // Sort data by "Score" in descending order

    setData(sortedData);
  }, []);

  const displayedColumns = ['Name', 'Team', 'Position', 'Price', 'Score'];

  const columns = displayedColumns.map((column) => {
    if (column === 'Name') {
      return {
        title: column,
        dataIndex: column,
        key: column,
        render: (text, record) => (
          <div
            style={{
              fontWeight: 'bold',
            }}
          >
            {text}
          </div>
        ),
      };
    }

    if (column === 'Team') {
      return {
        title: column,
        dataIndex: column,
        key: column,
        render: (text, record) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: teams[text].background, // Access background color from teams object
                color: teams[text].text, // Access text color from teams object
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              {text}
            </span>
          </div>
        ),
      };
    }

    if (column === 'Score') {
      return {
        title: column,
        dataIndex: column,
        key: column,
        render: (text, record) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: calculateBackgroundColor(text),
                border: '1px solid black',
                display: 'inline-block',
                padding: '2px',
                textAlign: 'center',
                width: '100px',
              }}
            >
              {text}
            </span>
          </div>
        ),
      };
    }

    return {
      title: column,
      dataIndex: column,
      key: column,
      render: (text, record) => (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              backgroundColor: '',
              border: 'none',
              display: 'inline-block',
              padding: '2px',
              textAlign: 'center',
              width: '100px',
            }}
          >
            {text}
          </span>
        </div>
      ),
    };
  });

  const calculateBackgroundColor = (value) => {
    const normalizedValue = (value - 0) / (100 - 0);

    const red = Math.min(0.5, (1 - (normalizedValue - 0.35) / 0.65)) * 2 * 255;
    const green = Math.min(0.5, normalizedValue) * 2 * 255;
    const blue = 0;

    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <Table
      dataSource={data}
      columns={columns}
      bordered // Add bordered prop to enable borders around the table cells
      rowClassName={() => 'vertical-line-row'} // Add custom CSS class to rows for vertical line pattern
    />
  );
};

export default Results;