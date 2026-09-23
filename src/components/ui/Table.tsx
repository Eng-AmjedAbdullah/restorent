import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'start' | 'center' | 'end';
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'لا توجد بيانات للعرض حالياً',
  isLoading = false,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden p-8 text-center">
        <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden p-12 text-center">
        <p className="text-sm text-slate-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  const getAlignClass = (align?: 'start' | 'center' | 'end') => {
    if (align === 'center') return 'text-center';
    if (align === 'end') return 'text-end';
    return 'text-start';
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
      <table className="w-full text-sm text-slate-800 border-collapse">
        <thead className="bg-slate-50/90 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={`py-3.5 px-4 font-semibold ${getAlignClass(col.align)} ${
                  col.width ? col.width : ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, idx) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              className={`transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-slate-50/80 active:bg-slate-100/60' : 'hover:bg-slate-50/50'
              } ${idx % 2 === 1 ? 'bg-slate-50/20' : 'bg-white'}`}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className={`py-3.5 px-4 align-middle ${getAlignClass(col.align)}`}
                >
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
