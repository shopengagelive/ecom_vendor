import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Table, TableRow, TableCell } from "../ui/Table";
import { Edit, Trash2, Link } from "lucide-react";
import { AttributesTableProps } from "./types";

export default function AttributesTable({
  attributes,
  categories,
  onEditAttribute,
  onDeleteAttribute,
  onLinkCategories,
  linkingCategories,
  submitting,
  deleting,
  getCategoryName,
}: AttributesTableProps) {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Product Attributes
        </h3>
        <p className="text-sm text-gray-600">
          Configure product attributes like size, color, material, etc.
        </p>
      </div>

      <Table
        headers={[
          "Name",
          "Type",
          "Options",
          "Values",
          "Group",
          "Required",
          "Sort Order",
          "Linked Categories",
          "Actions",
        ]}
      >
        {attributes.map((attribute) => (
          <TableRow key={attribute.id}>
            <TableCell className="font-medium">{attribute.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge>{attribute.type}</Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {attribute.options.slice(0, 3).map((option, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {option}
                  </span>
                ))}
                {attribute.options.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{attribute.options.length - 3} more
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {attribute.type === "color"
                  ? attribute.values
                      .slice(0, 3)
                      .map((value, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: value }}
                          title={value}
                        />
                      ))
                  : attribute.values.slice(0, 3).map((value, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 px-2 py-1 rounded"
                      >
                        {value}
                      </span>
                    ))}
                {attribute.values.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{attribute.values.length - 3} more
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="default" className="text-xs">
                {attribute.group}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={attribute.isRequired ? "success" : "default"}>
                {attribute.isRequired ? "Yes" : "No"}
              </Badge>
            </TableCell>
            <TableCell>{attribute.sortOrder}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {attribute.linkedCategories
                  .slice(0, 2)
                  .map((categoryId, index) => (
                    <Badge key={index} variant="info" className="text-xs">
                      {getCategoryName(categoryId)}
                    </Badge>
                  ))}
                {attribute.linkedCategories.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{attribute.linkedCategories.length - 2} more
                  </span>
                )}
                {attribute.linkedCategories.length === 0 && (
                  <span className="text-xs text-gray-400">None</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Link}
                  onClick={() => onLinkCategories(attribute)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="Link Categories"
                  disabled={linkingCategories}
                >
                  {""}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit}
                  onClick={() => onEditAttribute(attribute)}
                  disabled={submitting || deleting}
                >
                  {""}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDeleteAttribute(attribute)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={submitting || deleting}
                >
                  {""}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </Card>
  );
}
