import "../../../assets/styles/IncomingDoc.css";

// Generic column configuration interface
// T represents the type of data each row contains
export interface columnConfig<T>{
    header: string;
    key: keyof T | string;
    render?: (item: T) => React.ReactNode; //For custome stuff like buttons
}

// Props interface for the reusable Table component
interface tableProps<T> {
    data: T[];
    columns: columnConfig<T>[];
}


// Generic reusable Table component
// <T,> allows the table to work with any data type
const Table = <T,>({data, columns}: tableProps<T>) => {
  return (
    <div>
      <table className="table">
            <thead>
              <tr>
                {/* Dynamically generate table headers based on column configuration */}
                {columns.map((col, index) =>
                    <th key={index}>{col.header}</th>
                )}
              </tr>
            </thead>
                <tbody>
                    {/* If data exists, render rows. Otherwise show empty message */}
                    {data.length > 0 ? (
                        data.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                                {/* Render each column cell for the current row */}
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                         {/* 
                                          If a custom render function exists, use it.
                                          Otherwise access the property from the data object using the column key.
                                        */}
                                        {col.render ? col.render(item) : (item[col.key as keyof T] as unknown as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ): (
                        // Display this row when the table has no data
                        <tr>
                            <td colSpan={columns.length+1} className="text-center">No records found.</td>
                        </tr>
                    )}
                </tbody>
          </table>
    </div>
  )
}

export default Table