import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder,
  pageSize = 10,
  actions,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredData = searchable
    ? data.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rtl:left-auto rtl:right-3" />
            <Input
              type="search"
              placeholder={searchPlaceholder || t('search')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 rtl:pl-4 rtl:pr-10"
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('filter')}
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="font-semibold">
                  {column.header}
                </TableHead>
              ))}
              {actions && <TableHead className="w-24">{t('actions')}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t('no_data')}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={index} className="table-row-hover">
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? '')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {actions(item)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {`${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredData.length)} of ${filteredData.length}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
            <span className="text-sm font-medium px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
