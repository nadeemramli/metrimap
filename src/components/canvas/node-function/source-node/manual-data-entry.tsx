"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, ArrowLeft, ArrowRight, Upload } from "lucide-react";

interface ManualDataEntryProps {
  onDataComplete: (data: any[]) => void;
  onBack: () => void;
}

export default function ManualDataEntry({
  onDataComplete,
  onBack,
}: ManualDataEntryProps) {
  const [columns, setColumns] = useState<string[]>([
    "Column 1",
    "Column 2",
    "Column 3",
  ]);
  const [rows, setRows] = useState<any[]>([
    { "Column 1": "", "Column 2": "", "Column 3": "" },
    { "Column 1": "", "Column 2": "", "Column 3": "" },
  ]);
  const [csvInput, setCsvInput] = useState("");
  const [activeTab, setActiveTab] = useState<"spreadsheet" | "csv" | "json">(
    "spreadsheet"
  );

  const addColumn = () => {
    const newColumnName = `Column ${columns.length + 1}`;
    setColumns([...columns, newColumnName]);
    setRows(rows.map((row) => ({ ...row, [newColumnName]: "" })));
  };

  const removeColumn = (columnIndex: number) => {
    const columnToRemove = columns[columnIndex];
    setColumns(columns.filter((_, i) => i !== columnIndex));
    setRows(
      rows.map((row) => {
        const newRow = { ...row };
        delete newRow[columnToRemove];
        return newRow;
      })
    );
  };

  const addRow = () => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {});
    setRows([...rows, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    setRows(rows.filter((_, i) => i !== rowIndex));
  };

  const updateCell = (rowIndex: number, column: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][column] = value;
    setRows(newRows);
  };

  const updateColumnName = (oldName: string, newName: string) => {
    const newColumns = columns.map((col) => (col === oldName ? newName : col));
    setColumns(newColumns);

    const newRows = rows.map((row) => {
      const newRow = { ...row };
      if (oldName !== newName) {
        newRow[newName] = newRow[oldName];
        delete newRow[oldName];
      }
      return newRow;
    });
    setRows(newRows);
  };

  const parseCsvInput = () => {
    const lines = csvInput.trim().split("\n");
    if (lines.length === 0) return;

    const headers = lines[0].split(",").map((h) => h.trim());
    const dataRows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      return headers.reduce(
        (acc, header, index) => ({
          ...acc,
          [header]: values[index] || "",
        }),
        {}
      );
    });

    setColumns(headers);
    setRows(dataRows);
  };

  const handleContinue = () => {
    const cleanedData = rows.filter((row) =>
      Object.values(row).some((value) => value !== "")
    );
    onDataComplete(cleanedData);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Manual Data Entry</h2>
          <p className="text-gray-600">
            Enter your data using the interface below
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "spreadsheet" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("spreadsheet")}
          >
            Spreadsheet
          </Button>
          <Button
            variant={activeTab === "csv" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("csv")}
          >
            CSV Import
          </Button>
          <Button
            variant={activeTab === "json" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("json")}
          >
            JSON Import
          </Button>
        </div>
      </div>

      {activeTab === "spreadsheet" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Data Entry</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">{rows.length} rows</Badge>
                <Badge variant="secondary">{columns.length} columns</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Button size="sm" onClick={addColumn}>
                <Plus className="h-4 w-4 mr-1" />
                Add Column
              </Button>
              <Button size="sm" onClick={addRow}>
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
            </div>

            <div className="border rounded-md overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableHead key={column} className="min-w-32">
                        <div className="flex items-center gap-2">
                          <Input
                            value={column}
                            onChange={(e) =>
                              updateColumnName(column, e.target.value)
                            }
                            className="h-8 text-sm font-semibold"
                          />
                          {columns.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeColumn(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((column) => (
                        <TableCell key={column}>
                          <Input
                            value={row[column] || ""}
                            onChange={(e) =>
                              updateCell(rowIndex, column, e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeRow(rowIndex)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "csv" && (
        <Card>
          <CardHeader>
            <CardTitle>Import CSV Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="csvInput">Paste CSV Data</Label>
              <Textarea
                id="csvInput"
                placeholder="name,age,city&#10;John Doe,30,New York&#10;Jane Smith,25,San Francisco"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="min-h-32"
              />
            </div>
            <Button onClick={parseCsvInput}>
              <Upload className="h-4 w-4 mr-2" />
              Parse CSV
            </Button>
            {rows.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="border rounded-md overflow-auto max-h-48">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.slice(0, 5).map((row, index) => (
                        <TableRow key={index}>
                          {columns.map((column) => (
                            <TableCell key={column}>{row[column]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end mt-6">
        <Button
          onClick={handleContinue}
          disabled={
            rows.length === 0 ||
            rows.every((row) => Object.values(row).every((val) => val === ""))
          }
          className="bg-green-600 hover:bg-green-700"
        >
          Continue with Data
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
