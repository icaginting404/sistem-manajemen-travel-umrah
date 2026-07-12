type TableProps = {
  headers: string[];
  data: React.ReactNode[][];
};

const Table = ({ headers, data }: TableProps) => {
  return (
    <div className="p-2">
      <table className="w-full overflow-hidden rounded-lg border shadow-xl text-sm">
        <thead>
          <tr className="bg-sab-gray-100 h-10 text-sab-gray-500 ">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3 text-left">
                {header}{" "}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="font-semibold text-black text-sm">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-sab-gray-100">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  {cell}
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
