import React from "react";

const Table = ({ columns, data, customRender = {} }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300">
      <table className="min-w-full">
        <thead>
          <tr className="bg-primary text-white text-left text-lg font-bold">
            {columns.map((col) => (
              <th key={col} className="p-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-sm">
          {data.map((row) => (
            
            <tr
              key={row.id}
              className="border-b border-gray-300 last:border-none"
            >
              {columns.map((col) => (
                <td key={`${row.id}-${col}`} className="px-3 py-3">
                  {customRender[col] ? customRender[col](row) : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
