import "../../../assets/styles/IncomingDoc.css";

export interface columnConfig<T>{
    header: string;
    key: keyof T | string;
    render?: (item: T) => React.ReactNode; //For custome stuff like buttons
}

interface tableProps<T> {
    data: T[];
    columns: columnConfig<T>[];
}

const Table = <T,>({data, columns}: tableProps<T>) => {
  return (
    <div>
      <table className="table">
            <thead>
              <tr>
                {columns.map((col, index) =>
                    <th key={index}>{col.header}</th>
                )}
              </tr>
            </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                                
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.render ? col.render(item) : (item[col.key as keyof T] as unknown as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ): (
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