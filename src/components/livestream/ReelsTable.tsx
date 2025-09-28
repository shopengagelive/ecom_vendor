import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import { DollarSign, Edit, Trash2, Video } from "lucide-react";
import { ReelsTableProps } from "./types";

export default function ReelsTable({
  reels,
  onProductClick,
  onEditReel,
  onDeleteReel,
}: ReelsTableProps) {
  return (
    <Card padding={false}>
      <Table
        headers={[
          "SL NO.",
          "REEL CAPTION",
          "VIDEO",
          "PUBLISHED DATE",
          "CATEGORY",
          "TAGGED PRODUCTS",
          "VIEWS",
          "SALES",
          "ACTION",
        ]}
      >
        {reels.map((reel, index) => (
          <TableRow key={reel.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="max-w-xs">
              <div className="truncate" title={reel.caption}>
                {reel.caption}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Video</span>
              </div>
            </TableCell>
            <TableCell>{reel.publishedDate}</TableCell>
            <TableCell>
              <Badge variant="info">{reel.category}</Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onProductClick(reel)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Badge variant="info" className="rounded-full">
                  {reel.taggedProducts.length}
                </Badge>
              </Button>
            </TableCell>
            <TableCell>
              <span className="font-medium">
                {reel.views.toLocaleString()}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-medium text-green-600">
                {reel.sales}
              </span>
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
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => onEditReel(reel)}
                  className="text-green-600 hover:text-green-800"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDeleteReel(reel.id)}
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
