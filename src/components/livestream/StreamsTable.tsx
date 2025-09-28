import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Play, DollarSign, Trash2 } from "lucide-react";
import { StreamsTableProps } from "./types";

export default function StreamsTable({
  streams,
  onProductClick,
  onDeleteStream,
  formatDuration,
}: StreamsTableProps) {
  return (
    <Card padding={false}>
      <Table
        headers={[
          "SL NO.",
          "BROADCAST TITLE",
          "STARTED ON",
          "DURATION",
          "COMPLETED ON",
          "BROADCASTER TYPE",
          "RECORDING",
          "RESTREAM",
          "TAGGED PRODUCTS",
          "ACTION",
        ]}
      >
        {streams.map((stream, index) => (
          <TableRow key={stream.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-medium text-gray-900">
              {stream.broadcastTitle}
            </TableCell>
            <TableCell>{stream.startedOn}</TableCell>
            <TableCell>{formatDuration(stream.duration)}</TableCell>
            <TableCell>{stream.completedOn}</TableCell>
            <TableCell>{stream.broadcasterType}</TableCell>
            <TableCell>
              <Badge variant={stream.recording ? "success" : "default"}>
                {stream.recording ? "True" : "False"}
              </Badge>
            </TableCell>
            <TableCell>
              {stream.restream ? (
                <div className="flex flex-wrap gap-1">
                  {stream.restreamPlatforms.map((platform, idx) => (
                    <Badge key={idx} variant="info" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Badge variant="default">False</Badge>
              )}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onProductClick(stream)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Badge variant="info" className="rounded-full">
                  {stream.taggedProducts.length}
                </Badge>
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={DollarSign}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Sales
                  {stream.sales > 0 && (
                    <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                      {stream.sales}
                    </span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Play}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Recording
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDeleteStream(stream.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </Card>
  );
}
