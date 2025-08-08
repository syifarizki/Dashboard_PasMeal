import React from "react";

const Table = ({ columns, data, customRender = {} }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300">
      <table className="min-w-full">
        <thead>
          <tr className="bg-primary text-white text-left text-lg font-bold">
            {columns.map((col, i) => (
              <th key={i} className="p-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-sm">
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-300 last:border-none ">
              {columns.map((col, j) => (
                <td key={j} className="px-3 py-3">
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
